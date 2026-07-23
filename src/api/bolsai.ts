import type { FiiData, UsageData } from '../types'
import { getMockFii, getAllMockFiis } from './__mocks__'
import { get, set } from '@/services/cache'

const API_BASE = '/api/bolsai'
const TIMEOUT_MS = 10000
const MAX_RETRIES = 2
const CACHE_TTL_MIN = 360

const CACHE_PREFIX = 'bolsai:'

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

async function fetchFiiWithRetry(ticker: string): Promise<FiiData> {
  const url = `${API_BASE}/${ticker}`

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetchWithTimeout(url, TIMEOUT_MS)
      if (!response.ok) {
        throw new Error(`Bolsai API error: ${response.status} ${response.statusText}`)
      }
      return response.json()
    } catch (error) {
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 1000))
        continue
      }
      throw error
    }
  }

  throw new Error(`Failed to fetch ${ticker} after ${MAX_RETRIES + 1} attempts`)
}

export async function fetchFiiData(ticker: string): Promise<FiiData> {
  const normalized = ticker.toUpperCase()
  const cached = get<FiiData>(CACHE_PREFIX + normalized)
  if (cached) return cached

  try {
    const data = await fetchFiiWithRetry(normalized)
    set(CACHE_PREFIX + normalized, data, CACHE_TTL_MIN)
    return data
  } catch {
    const mock = getMockFii(normalized)
    if (mock) return mock
    throw new Error(`FII ${normalized} not found`)
  }
}

export async function fetchMultipleFiis(tickers: string[]): Promise<Map<string, FiiData>> {
  if (tickers.length === 0) return new Map()

  const results = await Promise.allSettled(tickers.map((t) => fetchFiiData(t)))
  const map = new Map<string, FiiData>()
  for (const result of results) {
    if (result.status === 'fulfilled') {
      map.set(result.value.ticker, result.value)
    }
  }
  if (map.size === 0) {
    const allMock = getAllMockFiis().filter((f) => tickers.map(t => t.toUpperCase()).includes(f.ticker))
    return new Map(allMock.map((f) => [f.ticker, f]))
  }
  return map
}

export async function fetchUsage(): Promise<UsageData> {
  const cacheKey = `${CACHE_PREFIX}usage`
  const cached = get<UsageData>(cacheKey)
  if (cached) return cached

  const url = `${API_BASE}/keys/usage`
  const response = await fetchWithTimeout(url, TIMEOUT_MS)
  if (!response.ok) {
    throw new Error(`Bolsai API error: ${response.status} ${response.statusText}`)
  }
  const data = await response.json()
  set(cacheKey, data, CACHE_TTL_MIN)
  return data
}
