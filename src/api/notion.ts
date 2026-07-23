import type { FiiHolding } from '../types'
import { fetchMultipleFiis } from './bolsai'

const PROXY_BASE = '/api/notion-proxy'
const PAGE_BASE = '/api/notion-page'
const CACHE_KEY = 'notion:query'
const CACHE_TTL_MS = 5 * 60 * 1000
const TIMEOUT_MS = 15000

export interface QueryParams {
  databaseId: string
  filter?: Record<string, unknown>
  sorts?: Record<string, unknown>[]
  start_cursor?: string
  page_size?: number
}

export interface NotionPageResponse {
  id: string
  properties: Record<string, {
    type: string
    title?: { plain_text: string }[]
    rich_text?: { plain_text: string }[]
    number?: number
    select?: { name: string }
    formula?: { number?: number; type: string }
    [key: string]: unknown
  }>
  [key: string]: unknown
}

export interface NotionQueryResponse {
  results: NotionPageResponse[]
  next_cursor: string | null
  has_more: boolean
  [key: string]: unknown
}

interface CacheEntry<T> {
  data: T
  timestamp: number
}

function getCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const entry: CacheEntry<T> = JSON.parse(raw)
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(key)
      return null
    }
    return entry.data
  } catch {
    return null
  }
}

function setCache<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now() }
    localStorage.setItem(key, JSON.stringify(entry))
  } catch {
  }
}

async function postToNotion<T>(endpoint: string, body: unknown): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err.error || `HTTP ${response.status}`)
    }

    return response.json()
  } finally {
    clearTimeout(timer)
  }
}

async function getFromNotion<T>(endpoint: string): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      signal: controller.signal,
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err.error || `HTTP ${response.status}`)
    }

    return response.json()
  } finally {
    clearTimeout(timer)
  }
}

export async function queryDatabase(
  params: QueryParams
): Promise<NotionQueryResponse> {
  const cacheKey = `${CACHE_KEY}:${params.databaseId}:${JSON.stringify(params)}`
  const cached = getCache<NotionQueryResponse>(cacheKey)
  if (cached) return cached

  const data = await postToNotion<NotionQueryResponse>(PROXY_BASE, params)
  setCache(cacheKey, data)
  return data
}

export async function fetchPage(pageId: string): Promise<NotionPageResponse> {
  return getFromNotion<NotionPageResponse>(`${PAGE_BASE}/${pageId}`)
}

function extractText(
  prop: NotionPageResponse['properties'][string] | undefined
): string {
  if (!prop) return ''
  if (prop.type === 'title' && prop.title) {
    return prop.title.map((t) => t.plain_text).join('')
  }
  if (prop.type === 'rich_text' && prop.rich_text) {
    return prop.rich_text.map((t) => t.plain_text).join('')
  }
  return ''
}

function extractNumber(
  prop: NotionPageResponse['properties'][string] | undefined
): number {
  if (!prop) return 0
  if (prop.type === 'number') return prop.number ?? 0
  if (prop.type === 'formula') return prop.formula?.number ?? 0
  return 0
}

export function extractFiiList(response: NotionQueryResponse): FiiHolding[] {
  return response.results.map((page) => {
    const props = page.properties

    return {
      id: page.id,
      nome: extractText(props['Fundo']),
      qnt: extractNumber(props['Qtd']),
      total: extractNumber(props['Total']),
      percentual: extractNumber(props['Percentual']),
      totalFiis: extractNumber(props['Total Fiis']),
      tipo: props['Tipo']?.select?.name ?? '',
    }
  })
}

export async function enrichWithPrices(
  holdings: FiiHolding[]
): Promise<FiiHolding[]> {
  const tickers = holdings.map((h) => h.nome)
  const fiis = await fetchMultipleFiis(tickers)

  return holdings.map((h) => ({
    ...h,
    precoAtual: fiis.get(h.nome.toUpperCase())?.close_price ?? undefined,
  }))
}