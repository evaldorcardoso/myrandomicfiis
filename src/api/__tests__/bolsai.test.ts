import { describe, it, expect, beforeEach, vi } from 'vitest'
import { fetchFiiData, fetchMultipleFiis } from '../bolsai'

describe('bolsai API', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('fetchFiiData', () => {
    it('should return cached data on second call', async () => {
      const globalFetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          ticker: 'TEST11',
          close_price: 100,
          book_value_per_share: 100,
          pvp: 1.0,
          dividend_yield_ttm: 9.0,
          net_asset_value: 1_000_000_000,
          shares_outstanding: 5_000_000,
          total_shareholders: 75000,
          segment: 'Papel',
          management_type: 'Gestao Ativa',
          administrator: 'Teste S.A.',
          administrator_cnpj: '00000000000191',
          mandate: 'Renda',
          inception_date: '2020-01-01',
          duration_type: 'Indeterminado',
          target_investors: 'INVESTIDORES EM GERAL',
          website: 'www.test11.com.br',
          email: 'ri@test11.com.br',
          fund_type: 'Papel',
          property_count: 0,
          total_area_sqm: 0,
          vacancy_pct: 0,
          delinquency_pct: 0,
          leased_pct: 100,
          top_properties: [],
          property_reference_date: '2026-06-30',
          name: 'TEST11 - Fundo Imobiliario',
          reference_date: '2026-07-22',
        }),
      } as Response)

      const first = await fetchFiiData('TEST11')
      expect(first.ticker).toBe('TEST11')
      expect(globalFetch).toHaveBeenCalledTimes(1)

      const second = await fetchFiiData('TEST11')
      expect(second.ticker).toBe('TEST11')
      expect(globalFetch).toHaveBeenCalledTimes(1)
    })

    it('should fallback to mock when API fails', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'))
      vi.spyOn(globalThis, 'setTimeout').mockImplementation((fn: (...args: unknown[]) => void) => {
        fn()
        return 1 as unknown as ReturnType<typeof setTimeout>
      })

      const result = await fetchFiiData('HGLG11')
      expect(result.ticker).toBe('HGLG11')
      expect(result.close_price).toBeGreaterThan(0)
    })

    it('should throw for unknown ticker when API fails', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'))
      vi.spyOn(globalThis, 'setTimeout').mockImplementation((fn: (...args: unknown[]) => void) => {
        fn()
        return 1 as unknown as ReturnType<typeof setTimeout>
      })

      await expect(fetchFiiData('UNKN00')).rejects.toThrow('FII UNKN00 not found')
    })

    it('should normalize ticker to uppercase', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'))
      vi.spyOn(globalThis, 'setTimeout').mockImplementation((fn: (...args: unknown[]) => void) => {
        fn()
        return 1 as unknown as ReturnType<typeof setTimeout>
      })

      const result = await fetchFiiData('hglg11')
      expect(result.ticker).toBe('HGLG11')
    })
  })

  describe('fetchMultipleFiis', () => {
    it('should return empty map for empty input', async () => {
      const result = await fetchMultipleFiis([])
      expect(result).toBeInstanceOf(Map)
      expect(result.size).toBe(0)
    })

    it('should return map with tickers', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'))
      vi.spyOn(globalThis, 'setTimeout').mockImplementation((fn: (...args: unknown[]) => void) => {
        fn()
        return 1 as unknown as ReturnType<typeof setTimeout>
      })

      const result = await fetchMultipleFiis(['HGLG11', 'KNRI11'])
      expect(result).toBeInstanceOf(Map)
      expect(result.size).toBe(2)
      expect(result.has('HGLG11')).toBe(true)
      expect(result.has('KNRI11')).toBe(true)
    })
  })
})
