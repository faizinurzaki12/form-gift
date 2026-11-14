// ============================================================
// Composable WebRTC (peer-to-peer) untuk live preview 2 kamera
// Signaling dilakukan via channel Supabase (broadcast).
// ============================================================
import { ref, onUnmounted } from 'vue'

export function useWebRTC(channelRef, localStream, role) {
  // Dukung ref maupun nilai langsung
  const getChannel = () => (channelRef && typeof channelRef === 'object' && 'value' in channelRef)
    ? channelRef.value
    : channelRef
  const remoteStream = ref(null)
  const connected = ref(false)
  let pc = null

  const rtcConfig = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  }

  function createPeer() {
    pc = new RTCPeerConnection(rtcConfig)

    // Tambahkan track lokal
    if (localStream.value) {
      localStream.value.getTracks().forEach((track) => {
        pc.addTrack(track, localStream.value)
      })
    }

    // Terima track remote
    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        remoteStream.value = event.streams[0]
        connected.value = true
      }
    }

    // Kirim ICE candidate via signaling
    pc.onicecandidate = (event) => {
      const ch = getChannel()
      if (event.candidate && ch) {
        ch.send({
          type: 'broadcast',
          event: 'signal',
          payload: { kind: 'candidate', candidate: event.candidate, from: role },
        })
      }
    }

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') connected.value = true
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        connected.value = false
      }
    }
  }

  // Host: buat offer saat guest bergabung
  async function makeOffer() {
    if (!pc) createPeer()
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    getChannel()?.send({
      type: 'broadcast',
      event: 'signal',
      payload: { kind: 'offer', sdp: pc.localDescription, from: role },
    })
  }

  // Guest: terima offer, buat answer
  async function handleOffer(sdp) {
    if (!pc) createPeer()
    await pc.setRemoteDescription(new RTCSessionDescription(sdp))
    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)
    getChannel()?.send({
      type: 'broadcast',
      event: 'signal',
      payload: { kind: 'answer', sdp: pc.localDescription, from: role },
    })
  }

  async function handleAnswer(sdp) {
    if (pc) await pc.setRemoteDescription(new RTCSessionDescription(sdp))
  }

  async function handleCandidate(candidate) {
    if (pc) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate))
      } catch (e) {
        // Abaikan error ICE minor
      }
    }
  }

  function handleSignal(payload) {
    if (!payload || payload.from === role) return
    switch (payload.kind) {
      case 'joined':
        if (role === 'host') makeOffer()
        break
      case 'offer':
        if (role === 'guest') handleOffer(payload.sdp)
        break
      case 'answer':
        if (role === 'host') handleAnswer(payload.sdp)
        break
      case 'candidate':
        handleCandidate(payload.candidate)
        break
      default:
        break
    }
  }

  function announceJoin() {
    getChannel()?.send({
      type: 'broadcast',
      event: 'signal',
      payload: { kind: 'joined', from: role },
    })
  }

  function close() {
    if (pc) {
      pc.close()
      pc = null
    }
    remoteStream.value = null
    connected.value = false
  }

  onUnmounted(() => close())

  return { remoteStream, connected, handleSignal, announceJoin, makeOffer, close }
}