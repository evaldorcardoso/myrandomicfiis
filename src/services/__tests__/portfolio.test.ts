import { describe, it, expect, beforeEach } from 'vitest'
import { extractFiiList } from '../../api/notion'
import type { NotionQueryResponse } from '../../api/notion'
import { type FiiHolding } from '../../types'

function createMockPage(ticker: string, qnt: number, total: number, percentual: number, tipo: string) {
  return {
    id: `page-${ticker}`,
    properties: {
      Fundo: { type: 'title', title: [{ plain_text: ticker }] },
      Qtd: { type: 'number', number: qnt },
      Total: { type: 'number', number: total },
      Percentual: { type: 'number', number: percentual },
      'Total Fiis': { type: 'number', number: 5 },
      Tipo: { type: 'select', select: { name: tipo } },
    },
  }
}

function createMockQueryResponse(pages: unknown[]): NotionQueryResponse {
  return { results: pages as NotionQueryResponse['results'], next_cursor: null, has_more: false }
}

describe('portfolio service', () => {
  describe('extractFiiList', () => {
    it('should map Notion response to FiiHolding[]', () => {
      const response = createMockQueryResponse([
        createMockPage('HGLG11', 100, 16245, 20, 'Logística'),
        createMockPage('KNRI11', 50, 6770, 15, 'Papel'),
      ])

      const result = extractFiiList(response)

      expect(result).toHaveLength(2)
      expect(result[0]!.nome).toBe('HGLG11')
      expect(result[0]!.qnt).toBe(100)
      expect(result[0]!.total).toBe(16245)
      expect(result[0]!.percentual).toBe(20)
      expect(result[0]!.tipo).toBe('Logística')
      expect(result[1]!.nome).toBe('KNRI11')
      expect(result[1]!.qnt).toBe(50)
      expect(result[1]!.total).toBe(6770)
      expect(result[1]!.percentual).toBe(15)
      expect(result[1]!.tipo).toBe('Papel')
    })

    it('should return empty array for empty results', () => {
      const response = createMockQueryResponse([])
      const result = extractFiiList(response)
      expect(result).toEqual([])
    })

    it('should handle missing optional properties', () => {
      const page = {
        id: 'page-test',
        properties: {
          Fundo: { type: 'title', title: [{ plain_text: 'TEST11' }] },
        },
      }
      const result = extractFiiList({ results: [page as NotionQueryResponse['results'][number]], next_cursor: null, has_more: false })
      expect(result).toHaveLength(1)
      expect(result[0]!.nome).toBe('TEST11')
      expect(result[0]!.qnt).toBe(0)
      expect(result[0]!.tipo).toBe('')
    })
  })

  let mockHoldings: FiiHolding[]

  beforeEach(() => {
    mockHoldings = [
      { id: '1', nome: 'HGLG11', qnt: 100, total: 16245, percentual: 20, totalFiis: 5, tipo: 'Logística', precoAtual: 165.5 },
      { id: '2', nome: 'KNRI11', qnt: 50, total: 6770, percentual: 15, totalFiis: 5, tipo: 'Papel', precoAtual: 140.2 },
      { id: '3', nome: 'MXRF11', qnt: 500, total: 4900, percentual: 12, totalFiis: 5, tipo: 'Papel', precoAtual: 10.5 },
    ]
  })

  describe('calcTotals', () => {
    it('should calculate totalInvested correctly', async () => {
      const { calcTotals } = await import('../portfolio')
      const result = calcTotals(mockHoldings)
      expect(result.totalInvested).toBe(16245 + 6770 + 4900)
    })

    it('should calculate totalCurrent correctly', async () => {
      const { calcTotals } = await import('../portfolio')
      const result = calcTotals(mockHoldings)
      const expected = 100 * 165.5 + 50 * 140.2 + 500 * 10.5
      expect(result.totalCurrent).toBe(expected)
    })

    it('should calculate totalProfitLoss as difference', async () => {
      const { calcTotals } = await import('../portfolio')
      const result = calcTotals(mockHoldings)
      expect(result.totalProfitLoss).toBe(result.totalCurrent - result.totalInvested)
    })

    it('should calculate fiiCount correctly', async () => {
      const { calcTotals } = await import('../portfolio')
      const result = calcTotals(mockHoldings)
      expect(result.fiiCount).toBe(3)
    })

    it('should return 0 for empty holdings', async () => {
      const { calcTotals } = await import('../portfolio')
      const result = calcTotals([])
      expect(result.totalInvested).toBe(0)
      expect(result.totalCurrent).toBe(0)
      expect(result.totalProfitLoss).toBe(0)
      expect(result.fiiCount).toBe(0)
    })

    it('should handle holdings without precoAtual', async () => {
      const { calcTotals } = await import('../portfolio')
      const noPriceHoldings = [
        { id: '1', nome: 'HGLG11', qnt: 100, total: 16245, percentual: 20, totalFiis: 1, tipo: 'Logística' },
      ]
      const result = calcTotals(noPriceHoldings as FiiHolding[])
      expect(result.totalCurrent).toBe(0)
    })
  })

  describe('getSegmentAllocation', () => {
    it('should return segment allocation from portfolio', async () => {
      const { getSegmentAllocation } = await import('../portfolio')
      const segmentAllocation = [
        { segment: 'Logística', invested: 20000, current: 22000, percentage: 20, targetPercentage: 15, difference: -5 },
        { segment: 'Papel', invested: 15000, current: 16000, percentage: 15, targetPercentage: 30, difference: 15 },
      ]
      const mockPortfolio = {
        holdings: [],
        totals: { totalInvested: 0, totalCurrent: 0, totalProfitLoss: 0, averageDY: 0, averagePVP: 0, fiiCount: 0 },
        fiiAllocation: [],
        segmentAllocation,
      }
      const result = getSegmentAllocation(mockPortfolio)
      expect(result).toEqual(segmentAllocation)
    })
  })
})
