import type { FiiData } from '../../types'
import { mockFiis } from './BolsaiMock'

function applyPriceVariation(fii: FiiData): FiiData {
  const variation = (Math.random() - 0.5) * 0.02
  const newClose = Math.round(fii.close_price * (1 + variation) * 100) / 100
  const newPvp = Math.round((newClose / fii.book_value_per_share) * 100) / 100

  return { ...fii, close_price: newClose, pvp: newPvp }
}

export function getMockFii(ticker: string): FiiData | undefined {
  const fii = mockFiis.find((f) => f.ticker === ticker.toUpperCase())
  if (!fii) return undefined
  return applyPriceVariation(fii)
}

export function getAllMockFiis(): FiiData[] {
  return mockFiis.map(applyPriceVariation)
}

export { mockFiis } from './BolsaiMock'
