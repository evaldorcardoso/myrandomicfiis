import { queryDatabase, extractFiiList, enrichWithPrices } from '../api/notion'
import { get, set, invalidate, NOTION_TTL } from './cache'
import type { FiiHolding } from '../types'

const PORTFOLIO_CACHE_KEY = 'portfolio:holdings'
const PORTFOLIO_ENRICHED_CACHE_KEY = 'portfolio:enriched'
const DATABASE_ID = import.meta.env.VITE_NOTION_DATABASE_ID

export interface PortfolioTotals {
  totalInvested: number
  totalCurrent: number
  totalProfitLoss: number
  averageDY: number
  averagePVP: number
  fiiCount: number
}

export interface FiiAllocation {
  ticker: string
  name: string
  invested: number
  current: number
  percentage: number
  segment: string
}

export interface SegmentAllocation {
  segment: string
  invested: number
  current: number
  percentage: number
  targetPercentage: number
  difference: number
}

export interface PortfolioData {
  holdings: FiiHolding[]
  totals: PortfolioTotals
  fiiAllocation: FiiAllocation[]
  segmentAllocation: SegmentAllocation[]
}

async function loadFromNotion(): Promise<FiiHolding[]> {
  if (!DATABASE_ID) {
    throw new Error('VITE_NOTION_DATABASE_ID não configurado')
  }

  const response = await queryDatabase({ databaseId: DATABASE_ID })
  const holdings = extractFiiList(response)
  return enrichWithPrices(holdings)
}

export async function loadPortfolio(useCache = true): Promise<PortfolioData> {
  if (useCache) {
    const cached = get<PortfolioData>(PORTFOLIO_CACHE_KEY)
    if (cached) return cached
  }

  const holdings = await loadFromNotion()
  const data = buildPortfolioData(holdings)
  set(PORTFOLIO_CACHE_KEY, data, NOTION_TTL)
  return data
}

export async function refreshPortfolio(): Promise<PortfolioData> {
  invalidate(PORTFOLIO_CACHE_KEY)
  invalidate(PORTFOLIO_ENRICHED_CACHE_KEY)
  return loadPortfolio(false)
}

function buildPortfolioData(holdings: FiiHolding[]): PortfolioData {
  const totals = calcTotals(holdings)
  const fiiAllocation = calcFiiAllocation(holdings, totals.totalInvested)
  const segmentAllocation = calcSegmentAllocation(holdings, totals.totalInvested)

  return {
    holdings,
    totals,
    fiiAllocation,
    segmentAllocation,
  }
}

function calcTotals(holdings: FiiHolding[]): PortfolioTotals {
  const totalInvested = holdings.reduce((sum, h) => sum + h.total, 0)
  const totalCurrent = holdings.reduce((sum, h) => {
    const price = h.precoAtual ?? 0
    return sum + price * h.qnt
  }, 0)
  const totalProfitLoss = totalCurrent - totalInvested

  const fiisWithDY = holdings.filter((h) => h.precoAtual && h.precoAtual > 0)
  const averageDY = fiisWithDY.length
    ? fiisWithDY.reduce((sum, h) => sum + (h.precoAtual ?? 0), 0) / fiisWithDY.length
    : 0

  const fiisWithPVP = holdings.filter((h) => h.precoAtual && h.precoAtual > 0)
  const averagePVP = fiisWithPVP.length
    ? fiisWithPVP.reduce((sum, h) => sum + (h.precoAtual ?? 0), 0) / fiisWithPVP.length
    : 0

  return {
    totalInvested,
    totalCurrent,
    totalProfitLoss,
    averageDY,
    averagePVP,
    fiiCount: holdings.length,
  }
}

function calcFiiAllocation(holdings: FiiHolding[], totalInvested: number): FiiAllocation[] {
  return holdings.map((h) => {
    const current = (h.precoAtual ?? 0) * h.qnt
    return {
      ticker: h.nome,
      name: h.nome,
      invested: h.total,
      current,
      percentage: totalInvested > 0 ? (h.total / totalInvested) * 100 : 0,
      segment: h.tipo,
    }
  })
}

function calcSegmentAllocation(holdings: FiiHolding[], totalInvested: number): SegmentAllocation[] {
  const segmentMap = new Map<string, { invested: number; current: number }>()

  holdings.forEach((h) => {
    const segment = h.tipo || 'Outros'
    const current = (h.precoAtual ?? 0) * h.qnt
    const existing = segmentMap.get(segment) ?? { invested: 0, current: 0 }
    existing.invested += h.total
    existing.current += current
    segmentMap.set(segment, existing)
  })

  const targetPercentages: Record<string, number> = {
    Logística: 15,
    Papel: 30,
    Shopping: 15,
    Lajes: 15,
    'Varejo/renda urbana': 15,
    Misto: 10,
  }

  return Array.from(segmentMap.entries()).map(([segment, values]) => ({
    segment,
    invested: values.invested,
    current: values.current,
    percentage: totalInvested > 0 ? (values.invested / totalInvested) * 100 : 0,
    targetPercentage: targetPercentages[segment] ?? 0,
    difference:
      targetPercentages[segment] !== undefined
        ? targetPercentages[segment] - (totalInvested > 0 ? (values.invested / totalInvested) * 100 : 0)
        : 0,
  }))
}

export function getSegmentAllocation(portfolio: PortfolioData): SegmentAllocation[] {
  return portfolio.segmentAllocation
}