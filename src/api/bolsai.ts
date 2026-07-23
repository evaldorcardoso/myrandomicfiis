import type { FiiData } from '../types'
import { getMockFii, getAllMockFiis } from './__mocks__'

const API_BASE = 'https://api.usebolsai.com/api/v1/fiis'

function hasApiKey(): boolean {
  return !!import.meta.env.VITE_BOLSAI_API_KEY
}

async function fetchFii(ticker: string): Promise<FiiData> {
  const response = await fetch(`${API_BASE}/${ticker}`, {
    headers: { 'X-API-Key': import.meta.env.VITE_BOLSAI_API_KEY as string },
  })

  if (!response.ok) {
    throw new Error(`Bolsai API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export async function getFii(ticker: string): Promise<FiiData> {
  if (!hasApiKey()) {
    const mock = getMockFii(ticker)
    if (!mock) throw new Error(`FII ${ticker} not found in mock data`)
    return mock
  }

  return fetchFii(ticker)
}

export async function getAllFiis(tickers: string[]): Promise<FiiData[]> {
  if (!hasApiKey()) {
    return getAllMockFiis().filter((f) => tickers.includes(f.ticker))
  }

  const results = await Promise.allSettled(tickers.map(fetchFii))
  return results
    .filter((r) => r.status === 'fulfilled')
    .map((r) => (r as PromiseFulfilledResult<FiiData>).value)
}
