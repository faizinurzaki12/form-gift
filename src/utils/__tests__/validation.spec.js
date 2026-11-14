import { describe, it, expect } from 'vitest'
import { isNonEmpty, isValidRoomCode } from '../validation.js'

describe('validation', () => {
  it('isNonEmpty menolak string kosong', () => {
    expect(isNonEmpty('')).toBe(false)
    expect(isNonEmpty('   ')).toBe(false)
    expect(isNonEmpty('halo')).toBe(true)
  })

  it('isValidRoomCode menerima slug', () => {
    expect(isValidRoomCode('photobooth-andi-A1B2')).toBe(true)
    expect(isValidRoomCode('abc')).toBe(false)
  })
})