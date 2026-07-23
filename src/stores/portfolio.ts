import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { loadPortfolio } from '../services/portfolio'
import { fetchMultipleFiis } from '../api/bolsai'
import type { FiiHolding } from '../types'
import type { PortfolioData } from '../services/portfolio'

export const usePortfolioStore = defineStore('portfolio', () => {
  const raw = ref<PortfolioData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fiis = computed<FiiHolding[]>(() => raw.value?.holdings ?? [])
  const totalInvested = computed(() => raw.value?.totals.totalInvested ?? 0)
  const totalCurrent = computed(() => raw.value?.totals.totalCurrent ?? 0)
  const totalProfitLoss = computed(() => raw.value?.totals.totalProfitLoss ?? 0)
  const averageDY = computed(() => raw.value?.totals.averageDY ?? 0)
  const averagePVP = computed(() => raw.value?.totals.averagePVP ?? 0)
  const fiiCount = computed(() => raw.value?.totals.fiiCount ?? 0)
  const fiiAllocation = computed(() => raw.value?.fiiAllocation ?? [])
  const segmentAllocation = computed(() => raw.value?.segmentAllocation ?? [])

  async function fetchPortfolio() {
    loading.value = true
    error.value = null

    try {
      const data = await loadPortfolio()
      raw.value = data
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erro ao carregar portfólio'
      error.value = message
    } finally {
      loading.value = false
    }
  }

  async function refreshPrices() {
    if (!raw.value) return

    loading.value = true
    error.value = null

    try {
      const tickers = raw.value.holdings.map((h) => h.nome)
      const marketData = await fetchMultipleFiis(tickers)

      for (const holding of raw.value.holdings) {
        const data = marketData.get(holding.nome.toUpperCase())
        if (data) {
          holding.precoAtual = data.close_price
        }
      }
      raw.value = { ...raw.value }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erro ao atualizar preços'
      error.value = message
    } finally {
      loading.value = false
    }
  }

  return {
    raw,
    loading,
    error,
    fiis,
    totalInvested,
    totalCurrent,
    totalProfitLoss,
    averageDY,
    averagePVP,
    fiiCount,
    fiiAllocation,
    segmentAllocation,
    fetchPortfolio,
    refreshPrices,
  }
})