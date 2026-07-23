import type { FiiData } from '../types'
import type { PortfolioData, SegmentAllocation } from './portfolio'

export interface FiiScore {
  ticker: string
  name: string
  segment: string
  score: number
  currentPrice: number
  pvp: number
  dividendYield: number
  liquidity: number
  currentAllocation: number
  targetAllocation: number
  rebalanceScore: number
  pvpScore: number
  dyScore: number
  diversificationScore: number
  liquidityScore: number
}

export interface RankedFii extends FiiScore {
  rank: number
}

export interface SimulateAporteResult {
  purchases: Array<{
    ticker: string
    name: string
    quantity: number
    unitPrice: number
    total: number
  }>
  totalUsed: number
  remaining: number
  top5Alternatives: RankedFii[]
}

const PVP_MIN = 0.7
const PVP_MAX = 1.2
const MIN_LIQUIDITY = 100000

export const TARGET_ALLOCATIONS: Record<string, number> = {
  Logística: 15,
  Papel: 30,
  Shopping: 15,
  Lajes: 15,
  'Varejo/renda urbana': 15,
  Misto: 10,
}

function normalize(value: number, min: number, max: number, invert = false): number {
  if (max <= min) return 0
  const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)))
  return invert ? 1 - normalized : normalized
}

function calculateRebalanceScore(
  currentAllocation: number,
  targetAllocation: number
): number {
  const diff = targetAllocation - currentAllocation
  if (diff <= 0) return 0
  return Math.min(100, (diff / targetAllocation) * 100)
}

function calculatePvpScore(pvp: number): number {
  if (pvp <= 0) return 0
  return normalize(pvp, PVP_MIN, PVP_MAX, true) * 100
}

function calculateDyScore(dividendYield: number, maxDy: number): number {
  if (maxDy <= 0) return 0
  return normalize(dividendYield, 0, maxDy) * 100
}

function calculateDiversificationScore(
  segment: string,
  segmentAllocations: SegmentAllocation[]
): number {
  const segmentData = segmentAllocations.find((s) => s.segment === segment)
  if (!segmentData || segmentData.targetPercentage === 0) return 0

  const diff = segmentData.targetPercentage - segmentData.percentage
  if (diff <= 0) return 0

  return Math.min(100, (diff / segmentData.targetPercentage) * 100)
}

function calculateLiquidityScore(liquidity: number): number {
  if (liquidity <= 0) return 0
  return Math.min(100, (liquidity / MIN_LIQUIDITY) * 100)
}

function getMaxDividendYield(fiis: FiiData[]): number {
  return Math.max(...fiis.map((f) => f.dividend_yield_ttm ?? 0), 1)
}

export function calculateScore(
  fii: FiiData,
  portfolio: PortfolioData,
  _targetAllocation: Record<string, number> = TARGET_ALLOCATIONS,
  allFiis: FiiData[] = []
): FiiScore {
  const segmentAllocations = portfolio.segmentAllocation
  const currentFiiAllocation = portfolio.fiiAllocation.find(
    (f) => f.ticker === fii.ticker
  )

  const currentAllocation = currentFiiAllocation?.percentage ?? 0
  const targetAllocation = TARGET_ALLOCATIONS[fii.segment] ?? 0

  const rebalanceScore = calculateRebalanceScore(currentAllocation, targetAllocation)
  const pvpScore = calculatePvpScore(fii.pvp ?? 0)
  const maxDy = getMaxDividendYield(allFiis.length > 0 ? allFiis : [fii])
  const dyScore = calculateDyScore(fii.dividend_yield_ttm ?? 0, maxDy)
  const diversificationScore = calculateDiversificationScore(fii.segment, segmentAllocations)
  const liquidityScore = calculateLiquidityScore(fii.net_asset_value ?? 0)

  const score =
    0.4 * rebalanceScore +
    0.3 * pvpScore +
    0.15 * dyScore +
    0.1 * diversificationScore +
    0.05 * liquidityScore

  const finalScore = Number.isFinite(score) ? Math.round(Math.max(0, Math.min(100, score))) : 0

  return {
    ticker: fii.ticker,
    name: fii.name,
    segment: fii.segment,
    score: finalScore,
    currentPrice: fii.close_price ?? 0,
    pvp: fii.pvp ?? 0,
    dividendYield: fii.dividend_yield_ttm ?? 0,
    liquidity: fii.net_asset_value ?? 0,
    currentAllocation,
    targetAllocation,
    rebalanceScore: Math.round(rebalanceScore),
    pvpScore: Math.round(pvpScore),
    dyScore: Math.round(dyScore),
    diversificationScore: Math.round(diversificationScore),
    liquidityScore: Math.round(liquidityScore),
  }
}

export function rankRecommendations(
  fiis: FiiData[],
  portfolio: PortfolioData,
  targetAllocation: Record<string, number> = TARGET_ALLOCATIONS
): RankedFii[] {
  if (fiis.length === 0) return []

  const scored = fiis.map((fii) => calculateScore(fii, portfolio, targetAllocation, fiis))
  scored.sort((a, b) => b.score - a.score)

  return scored.map((fii, index) => ({
    ...fii,
    rank: index + 1,
  }))
}

export function simulateAporte(
  _totalPortfolioValue: number,
  aporteValue: number,
  rankedFiis: RankedFii[]
): SimulateAporteResult {
  if (aporteValue <= 0 || rankedFiis.length === 0) {
    return {
      purchases: [],
      totalUsed: 0,
      remaining: aporteValue,
      top5Alternatives: rankedFiis.slice(0, 5),
    }
  }

  let remaining = aporteValue
  const purchases: SimulateAporteResult['purchases'] = []

  for (const fii of rankedFiis) {
    if (remaining <= 0) break

    const price = fii.currentPrice
    if (price <= 0) continue

    const maxQuantity = Math.floor(remaining / price)
    if (maxQuantity <= 0) continue

    const total = maxQuantity * price
    purchases.push({
      ticker: fii.ticker,
      name: fii.name,
      quantity: maxQuantity,
      unitPrice: price,
      total,
    })
    remaining -= total
  }

  return {
    purchases,
    totalUsed: aporteValue - remaining,
    remaining,
    top5Alternatives: rankedFiis.slice(0, 5),
  }
}