import { describe, it, expect } from 'vitest'
import { generateRoomCode } from '../roomCode.js'

describe('generateRoomCode', () => {
  it('menghasilkan kode yang mengandung nama host', () => {
    const code = generateRoomCode('Andi')
    expect(code).toContain('photobooth-andi-')
  })

  it('menghasilkan kode unik (acak)', () => {
    const a = generateRoomCode('Budi')
    const b = generateRoomCode('Budi')
    expect(a).not.toBe(b)
  })
})