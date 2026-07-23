import { describe, it, expect, beforeEach } from 'vitest'
import {
  calculateScore,
  rankRecommendations,
  simulateAporte,
  TARGET_ALLOCATIONS,
} from '../recommendation'
import type { FiiData } from '../../types'
import type { PortfolioData, PortfolioTotals, FiiAllocation, SegmentAllocation } from '../portfolio'

const createMockFii = (overrides: Partial<FiiData> = {}): FiiData => ({
  ticker: 'HGLG11',
  name: 'CSHG LOGISTICA FDO INV IMOB - FII',
  reference_date: '2026-02-28',
  close_price: 162.45,
  book_value_per_share: 148.32,
  pvp: 1.1,
  dividend_yield_ttm: 8.74,
  net_asset_value: 4523000000,
  shares_outstanding: 30498200,
  total_shareholders: 487523,
  segment: 'Logística',
  management_type: 'Gestao Ativa',
  administrator: 'CREDIT SUISSE HEDGING-GRIFFO CV S.A.',
  administrator_cnpj: '61809182000130',
  mandate: 'Renda',
  inception_date: '2010-06-01',
  duration_type: 'Indeterminado',
  target_investors: 'INVESTIDORES EM GERAL',
  website: 'www.cshg.com.br',
  email: 'investidores@cshg.com.br',
  fund_type: 'Tijolo',
  property_count: 28,
  total_area_sqm: 1595382.91,
  vacancy_pct: 2.91,
  delinquency_pct: 0.0,
  leased_pct: 97.09,
  top_properties: [],
  property_reference_date: '2024-12-31',
  ...overrides,
})

const createMockPortfolio = (overrides: Partial<PortfolioData> = {}): PortfolioData => {
  const totals: PortfolioTotals = {
    totalInvested: 100000,
    totalCurrent: 110000,
    totalProfitLoss: 10000,
    averageDY: 8.5,
    averagePVP: 1.1,
    fiiCount: 5,
  }

  const fiiAllocation: FiiAllocation[] = [
    { ticker: 'HGLG11', name: 'HGLG11', invested: 20000, current: 22000, percentage: 20, segment: 'Logística' },
    { ticker: 'KNRI11', name: 'KNRI11', invested: 15000, current: 16000, percentage: 15, segment: 'Papel' },
    { ticker: 'XPLG11', name: 'XPLG11', invested: 15000, current: 15500, percentage: 15, segment: 'Lajes' },
    { ticker: 'HGRE11', name: 'HGRE11', invested: 25000, current: 27000, percentage: 25, segment: 'Shopping' },
    { ticker: 'RBRP11', name: 'RBRP11', invested: 25000, current: 26500, percentage: 25, segment: 'Varejo/renda urbana' },
  ]

  const segmentAllocation: SegmentAllocation[] = [
    { segment: 'Logística', invested: 20000, current: 22000, percentage: 20, targetPercentage: 15, difference: -5 },
    { segment: 'Papel', invested: 15000, current: 16000, percentage: 15, targetPercentage: 30, difference: 15 },
    { segment: 'Lajes', invested: 15000, current: 15500, percentage: 15, targetPercentage: 15, difference: 0 },
    { segment: 'Shopping', invested: 25000, current: 27000, percentage: 25, targetPercentage: 15, difference: -10 },
    { segment: 'Varejo/renda urbana', invested: 25000, current: 26500, percentage: 25, targetPercentage: 15, difference: -10 },
  ]

  return {
    holdings: [],
    totals,
    fiiAllocation,
    segmentAllocation,
    ...overrides,
  }
}

describe('recommendation service', () => {
  let portfolio: PortfolioData
  let fiis: FiiData[]

  beforeEach(() => {
    portfolio = createMockPortfolio()
    fiis = [
      createMockFii({ ticker: 'HGLG11', name: 'HGLG11', segment: 'Logística', pvp: 1.1, dividend_yield_ttm: 8.74, net_asset_value: 4523000000 }),
      createMockFii({ ticker: 'KNRI11', name: 'KNRI11', segment: 'Papel', pvp: 0.95, dividend_yield_ttm: 9.5, net_asset_value: 3000000000 }),
      createMockFii({ ticker: 'XPLG11', name: 'XPLG11', segment: 'Lajes', pvp: 1.05, dividend_yield_ttm: 7.8, net_asset_value: 2000000000 }),
      createMockFii({ ticker: 'HGRE11', name: 'HGRE11', segment: 'Shopping', pvp: 1.2, dividend_yield_ttm: 6.5, net_asset_value: 1500000000 }),
      createMockFii({ ticker: 'RBRP11', name: 'RBRP11', segment: 'Varejo/renda urbana', pvp: 0.85, dividend_yield_ttm: 10.2, net_asset_value: 1000000000 }),
    ]
  })

  describe('calculateScore', () => {
    it('should return score between 0 and 100', () => {
      const fii = fiis[0]!
      const score = calculateScore(fii, portfolio)
      expect(score.score).toBeGreaterThanOrEqual(0)
      expect(score.score).toBeLessThanOrEqual(100)
    })

    it('should calculate rebalance score correctly for underweight sector', () => {
      const fii = fiis.find(f => f.segment === 'Papel')!
      const score = calculateScore(fii, portfolio)
      expect(score.rebalanceScore).toBeGreaterThan(0)
    })

    it('should calculate rebalance score as 0 for overweight sector', () => {
      const fii = fiis.find(f => f.segment === 'Logística')!
      const score = calculateScore(fii, portfolio)
      expect(score.rebalanceScore).toBe(0)
    })

    it('should calculate PVP score correctly - lower PVP = higher score', () => {
      const lowPvpFii = createMockFii({ pvp: 0.8 })
      const highPvpFii = createMockFii({ pvp: 1.3 })

      const lowScore = calculateScore(lowPvpFii, portfolio).pvpScore
      const highScore = calculateScore(highPvpFii, portfolio).pvpScore

      expect(lowScore).toBeGreaterThan(highScore)
    })

    it('should handle zero PVP', () => {
      const fii = createMockFii({ pvp: 0 })
      const score = calculateScore(fii, portfolio)
      expect(score.pvpScore).toBe(0)
    })

    it('should handle negative PVP', () => {
      const fii = createMockFii({ pvp: -1 })
      const score = calculateScore(fii, portfolio)
      expect(score.pvpScore).toBe(0)
    })

    it('should calculate DY score - higher DY = higher score', () => {
      const lowDyFii = createMockFii({ dividend_yield_ttm: 5 })
      const highDyFii = createMockFii({ dividend_yield_ttm: 10 })

      const lowScore = calculateScore(lowDyFii, portfolio, TARGET_ALLOCATIONS, fiis).dyScore
      const highScore = calculateScore(highDyFii, portfolio, TARGET_ALLOCATIONS, fiis).dyScore

      expect(highScore).toBeGreaterThan(lowScore)
    })

    it('should handle zero DY', () => {
      const fii = createMockFii({ dividend_yield_ttm: 0 })
      const score = calculateScore(fii, portfolio)
      expect(score.dyScore).toBe(0)
    })

    it('should calculate diversification score for underrepresented sector', () => {
      const fii = fiis.find(f => f.segment === 'Papel')!
      const score = calculateScore(fii, portfolio)
      expect(score.diversificationScore).toBeGreaterThan(0)
    })

    it('should calculate diversification score as 0 for overrepresented sector', () => {
      const fii = fiis.find(f => f.segment === 'Logística')!
      const score = calculateScore(fii, portfolio)
      expect(score.diversificationScore).toBe(0)
    })

    it('should calculate liquidity score based on net asset value', () => {
      const highLiquidityFii = createMockFii({ net_asset_value: 10000000000 })
      const lowLiquidityFii = createMockFii({ net_asset_value: 50000 })

      const highScore = calculateScore(highLiquidityFii, portfolio).liquidityScore
      const lowScore = calculateScore(lowLiquidityFii, portfolio).liquidityScore

      expect(highScore).toBeGreaterThan(lowScore)
    })

    it('should handle zero liquidity', () => {
      const fii = createMockFii({ net_asset_value: 0 })
      const score = calculateScore(fii, portfolio)
      expect(score.liquidityScore).toBe(0)
    })

    it('should return all score components', () => {
      const fii = fiis[0]!
      const score = calculateScore(fii, portfolio)

      expect(score).toHaveProperty('rebalanceScore')
      expect(score).toHaveProperty('pvpScore')
      expect(score).toHaveProperty('dyScore')
      expect(score).toHaveProperty('diversificationScore')
      expect(score).toHaveProperty('liquidityScore')
      expect(score).toHaveProperty('currentAllocation')
      expect(score).toHaveProperty('targetAllocation')
    })
  })

  describe('rankRecommendations', () => {
    it('should return ranked list sorted by score descending', () => {
      const ranked = rankRecommendations(fiis, portfolio)

      expect(ranked.length).toBe(fiis.length)
      for (let i = 1; i < ranked.length; i++) {
        expect(ranked[i - 1]!.score).toBeGreaterThanOrEqual(ranked[i]!.score)
      }
    })

    it('should assign rank starting from 1', () => {
      const ranked = rankRecommendations(fiis, portfolio)

      expect(ranked[0]!.rank).toBe(1)
      expect(ranked[1]!.rank).toBe(2)
      expect(ranked[2]!.rank).toBe(3)
    })

    it('should return empty array for empty fiis', () => {
      const ranked = rankRecommendations([], portfolio)
      expect(ranked).toEqual([])
    })

    it('should include all score components in ranked items', () => {
      const ranked = rankRecommendations(fiis, portfolio)

      ranked.forEach(item => {
        expect(item).toHaveProperty('rebalanceScore')
        expect(item).toHaveProperty('pvpScore')
        expect(item).toHaveProperty('dyScore')
        expect(item).toHaveProperty('diversificationScore')
        expect(item).toHaveProperty('liquidityScore')
      })
    })
  })

  describe('simulateAporte', () => {
    it('should return empty purchases for zero aporte', () => {
      const ranked = rankRecommendations(fiis, portfolio)
      const result = simulateAporte(100000, 0, ranked)

      expect(result.purchases).toEqual([])
      expect(result.totalUsed).toBe(0)
      expect(result.remaining).toBe(0)
    })

    it('should return empty purchases for negative aporte', () => {
      const ranked = rankRecommendations(fiis, portfolio)
      const result = simulateAporte(100000, -100, ranked)

      expect(result.purchases).toEqual([])
      expect(result.totalUsed).toBe(0)
      expect(result.remaining).toBe(-100)
    })

    it('should buy maximum quantity of top ranked FII', () => {
      const ranked = rankRecommendations(fiis, portfolio)
      const result = simulateAporte(100000, 1000, ranked)

      expect(result.purchases.length).toBeGreaterThan(0)
      expect(result.purchases[0]!.quantity).toBeGreaterThan(0)
      expect(result.totalUsed).toBeLessThanOrEqual(1000)
    })

    it('should buy from next ranked if money remains', () => {
      const ranked = rankRecommendations(fiis, portfolio)
      const result = simulateAporte(100000, 50000, ranked)

      expect(result.purchases.length).toBeGreaterThan(0)
      expect(result.totalUsed).toBeLessThanOrEqual(50000)
    })

    it('should calculate remaining correctly', () => {
      const ranked = rankRecommendations(fiis, portfolio)
      const aporte = 1000
      const result = simulateAporte(100000, aporte, ranked)

      expect(result.remaining).toBe(aporte - result.totalUsed)
    })

    it('should return top 5 alternatives', () => {
      const ranked = rankRecommendations(fiis, portfolio)
      const result = simulateAporte(100000, 1000, ranked)

      expect(result.top5Alternatives.length).toBeLessThanOrEqual(5)
      expect(result.top5Alternatives.length).toBeLessThanOrEqual(ranked.length)
    })

    it('should handle empty ranked list', () => {
      const result = simulateAporte(100000, 1000, [])

      expect(result.purchases).toEqual([])
      expect(result.totalUsed).toBe(0)
      expect(result.remaining).toBe(1000)
      expect(result.top5Alternatives).toEqual([])
    })

    it('should handle FII with zero price', () => {
      const zeroPriceFii = createMockFii({ close_price: 0 })
      const ranked = rankRecommendations([zeroPriceFii], portfolio)
      const result = simulateAporte(100000, 1000, ranked)

      expect(result.purchases).toEqual([])
      expect(result.remaining).toBe(1000)
    })

    it('should not exceed aporte value', () => {
      const ranked = rankRecommendations(fiis, portfolio)
      const aporte = 5000
      const result = simulateAporte(100000, aporte, ranked)

      expect(result.totalUsed).toBeLessThanOrEqual(aporte)
    })
  })

  describe('edge cases', () => {
    it('should handle division by zero in portfolio totals', () => {
      const emptyPortfolio = createMockPortfolio({
        totals: {
          totalInvested: 0,
          totalCurrent: 0,
          totalProfitLoss: 0,
          averageDY: 0,
          averagePVP: 0,
          fiiCount: 0,
        },
        fiiAllocation: [],
        segmentAllocation: [],
      })

      const fii = fiis[0]!
      const score = calculateScore(fii, emptyPortfolio)
      expect(score.score).toBeGreaterThanOrEqual(0)
      expect(score.score).toBeLessThanOrEqual(100)
    })

    it('should handle missing segment in target allocation', () => {
      const fii = createMockFii({ segment: 'Setor Inexistente' })
      const score = calculateScore(fii, portfolio)

      expect(score.targetAllocation).toBe(0)
      expect(score.score).toBeGreaterThanOrEqual(0)
    })

    it('should handle NaN values gracefully', () => {
      const fii = createMockFii({
        pvp: NaN,
        dividend_yield_ttm: NaN,
        net_asset_value: NaN,
      })
      const score = calculateScore(fii, portfolio)

      expect(score.score).toBeGreaterThanOrEqual(0)
      expect(score.score).toBeLessThanOrEqual(100)
    })
  })
})