import { describe, it, expect, beforeEach } from 'vitest'
import { set, get, has, invalidate, clearAll, DEFAULT_TTL } from '../cache'

describe('cache service', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('set/get', () => {
    it('should store and retrieve a value', () => {
      set('test-key', { foo: 'bar' })
      const result = get('test-key')
      expect(result).toEqual({ foo: 'bar' })
    })

    it('should store and retrieve a string', () => {
      set('str-key', 'hello')
      expect(get('str-key')).toBe('hello')
    })

    it('should store and retrieve a number', () => {
      set('num-key', 42)
      expect(get('num-key')).toBe(42)
    })

    it('should store and retrieve an array', () => {
      const arr = [1, 2, 3]
      set('arr-key', arr)
      expect(get('arr-key')).toEqual(arr)
    })

    it('should return null for non-existent key', () => {
      expect(get('non-existent')).toBeNull()
    })

    it('should return null for expired key', () => {
      set('expire-key', 'value', 0)
      expect(get('expire-key')).toBeNull()
    })
  })

  describe('TTL', () => {
    it('should expire correctly with short TTL', async () => {
      set('ttl-key', 'value', 0) // 0 minutos = expira imediatamente
      expect(get('ttl-key')).toBeNull()
    })

    it('should respect custom TTL in minutes', () => {
      set('custom-ttl', 'value', 60)
      expect(get('custom-ttl')).toBe('value')
    })
  })

  describe('has', () => {
    it('should return true for existing key', () => {
      set('exists', 'value')
      expect(has('exists')).toBe(true)
    })

    it('should return false for non-existent key', () => {
      expect(has('no-exists')).toBe(false)
    })

    it('should return false for expired key', () => {
      set('expired', 'value', 0)
      expect(has('expired')).toBe(false)
    })
  })

  describe('invalidate', () => {
    it('should remove a specific item', () => {
      set('key1', 'value1')
      set('key2', 'value2')

      invalidate('key1')

      expect(get('key1')).toBeNull()
      expect(get('key2')).toBe('value2')
    })

    it('should do nothing for non-existent key', () => {
      invalidate('no-exists')
      expect(get('no-exists')).toBeNull()
    })
  })

  describe('clearAll', () => {
    it('should clear all cached items', () => {
      set('a', 1)
      set('b', 2)
      set('c', 3)

      clearAll()

      expect(get('a')).toBeNull()
      expect(get('b')).toBeNull()
      expect(get('c')).toBeNull()
    })

    it('should not affect non-prefixed keys', () => {
      localStorage.setItem('other_key', 'value')
      set('cached', 'data')

      clearAll()

      expect(get('cached')).toBeNull()
      expect(localStorage.getItem('other_key')).toBe('value')
    })
  })

  describe('DEFAULT_TTL', () => {
    it('should have default TTL of 5 minutes', () => {
      expect(DEFAULT_TTL).toBe(5)
    })
  })
})
