import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { fetchMultipleFiis } from '../api/bolsai'
import type { FiiMarketData } from '../types'

export const useMarketStore = defineStore('market', () => {
  const prices = ref<Record<string, FiiMarketData>>({})
  const lastUpdate = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const cachedMarketData = computed(() => prices.value)

  function getMarketData(ticker: string): FiiMarketData | undefined {
    return prices.value[ticker.toUpperCase()]
  }

  async function fetchMarket(tickers: string[]) {
    loading.value = true
    error.value = null

    try {
      const normalized = [...new Set(tickers.map(t => t.toUpperCase()))]
      const data = await fetchMultipleFiis(normalized)

      const entries: Record<string, FiiMarketData> = {}
      for (const [ticker, fii] of data) {
        entries[ticker] = {
          ticker,
          price: fii.close_price,
          pvp: fii.pvp,
          dy: fii.dividend_yield_ttm,
          liquidity: fii.shares_outstanding,
          lastUpdate: fii.reference_date,
        }
      }
      prices.value = entries
      lastUpdate.value = new Date().toISOString()
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erro ao carregar dados de mercado'
      error.value = message
    } finally {
      loading.value = false
    }
  }

  return {
    prices,
    lastUpdate,
    loading,
    error,
    cachedMarketData,
    getMarketData,
    fetchMarket,
  }
})
