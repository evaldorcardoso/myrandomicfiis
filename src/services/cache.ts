const PREFIX = 'myrandomicfiis_'

interface CacheEntry<T> {
  value: T
  expiresAt: number
}

export const DEFAULT_TTL = 5
export const NOTION_TTL = 10

function now(): number {
  return Date.now()
}

export function set<T>(key: string, value: T, ttlMinutes: number = DEFAULT_TTL): void {
  const entry: CacheEntry<T> = {
    value,
    expiresAt: now() + ttlMinutes * 60 * 1000,
  }
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(entry))
  } catch {
    /* storage full or unavailable */
  }
}

export function get<T>(key: string): T | null {
  const raw = localStorage.getItem(PREFIX + key)
  if (raw === null) return null

  try {
    const entry: CacheEntry<T> = JSON.parse(raw)
    if (now() >= entry.expiresAt) {
      localStorage.removeItem(PREFIX + key)
      return null
    }
    return entry.value
  } catch {
    localStorage.removeItem(PREFIX + key)
    return null
  }
}

export function has(key: string): boolean {
  const raw = localStorage.getItem(PREFIX + key)
  if (raw === null) return false

  try {
    const entry: CacheEntry<unknown> = JSON.parse(raw)
    if (now() >= entry.expiresAt) {
      localStorage.removeItem(PREFIX + key)
      return false
    }
    return true
  } catch {
    localStorage.removeItem(PREFIX + key)
    return false
  }
}

export function invalidate(key: string): void {
  localStorage.removeItem(PREFIX + key)
}

export function clearAll(): void {
  const keys: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k?.startsWith(PREFIX)) {
      keys.push(k)
    }
  }
  keys.forEach((k) => localStorage.removeItem(k))
}