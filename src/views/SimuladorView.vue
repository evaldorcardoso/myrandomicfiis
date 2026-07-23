<template>
  <main class="min-h-screen bg-[#e0e1dd] pb-24 pt-4 sm:pt-6 px-4 sm:px-6">
    <div class="max-w-5xl mx-auto">
      <h1 class="text-2xl sm:text-3xl font-bold text-[#0d1b2a] mb-6">Simulador de Aporte</h1>

      <div v-if="error" class="mb-6">
        <ErrorState :message="error" @retry="loadData" />
      </div>

      <SimuladorSkeleton v-if="loading && rankedFiis.length === 0 && !error" />

      <template v-if="!loading && showEmpty && !error">
        <EmptyState
          title="Nenhum FII disponível"
          message="Carregue sua carteira para usar o simulador de aporte."
        />
      </template>

      <template v-if="rankedFiis.length > 0 || (loading && rankedFiis.length > 0)">
        <div class="bg-[#0d1b2a] rounded-lg p-4 sm:p-6 mb-6">
          <label class="block text-[#778da9] text-sm font-medium mb-2" for="aporte-input">
            Valor do aporte
          </label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#778da9] text-xl sm:text-2xl font-bold font-mono">R$</span>
            <input
              id="aporte-input"
              v-model="displayValue"
              type="text"
              inputmode="numeric"
              class="w-full bg-[#1b263b] text-[#e0e1dd] text-2xl sm:text-3xl font-bold font-mono rounded-lg pl-14 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#415a77] placeholder:text-[#415a77] transition-shadow"
              placeholder="0,00"
            />
          </div>
        </div>

        <template v-if="result && aporteCents > 0">
          <div class="bg-[#0d1b2a] rounded-lg p-4 sm:p-6 mb-6">
            <h2 class="text-[#778da9] text-sm font-medium uppercase tracking-wider mb-4">Recomendação</h2>

            <div v-if="result.purchases.length > 0">
              <div v-for="(p, idx) in result.purchases" :key="p.ticker">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#415a77] text-[#e0e1dd] text-xs font-mono">{{ idx + 1 }}</span>
                    <span class="text-[#e0e1dd] text-lg sm:text-xl font-bold">{{ p.ticker }}</span>
                  </div>
                  <span class="text-green-400 font-mono font-bold text-base sm:text-lg">{{ p.quantity }} cotas</span>
                </div>
                <div class="ml-8 grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-[#1b263b] last:border-0 last:pb-0 last:mb-0">
                  <div>
                    <p class="text-[#778da9] text-xs">Preço unitário</p>
                    <p class="text-[#e0e1dd] font-mono text-sm">{{ formatCurrency(p.unitPrice) }}</p>
                  </div>
                  <div>
                    <p class="text-[#778da9] text-xs">Valor total</p>
                    <p class="text-[#e0e1dd] font-mono text-sm">{{ formatCurrency(p.total) }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <p class="text-[#778da9]">Nenhuma cota inteira pode ser comprada com este valor.</p>
            </div>

            <div class="mt-4 pt-4 border-t border-[#1b263b] space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-[#778da9] text-sm">Valor utilizado</span>
                <span class="text-[#e0e1dd] font-mono font-medium">{{ formatCurrency(result.totalUsed) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-[#778da9] text-sm">Saldo residual</span>
                <span class="text-[#e0e1dd] font-mono font-medium" :class="result.remaining > 0 ? 'text-green-400' : ''">{{ formatCurrency(result.remaining) }}</span>
              </div>
            </div>
          </div>

          <div class="bg-[#0d1b2a] rounded-lg p-4 sm:p-6 mb-6">
            <h2 class="text-[#778da9] text-sm font-medium uppercase tracking-wider mb-4">Top 5 Alternativas</h2>
            <div class="space-y-2">
              <div
                v-for="fii in result.top5Alternatives"
                :key="fii.ticker"
                class="flex items-center justify-between p-3 rounded-lg bg-[#1b263b]/50 transition-colors hover:bg-[#1b263b]"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <RankBadge :rank="fii.rank" />
                  <div class="min-w-0">
                    <p class="text-[#e0e1dd] font-medium truncate">{{ fii.ticker }}</p>
                    <p class="text-[#778da9] text-xs truncate">{{ fii.segment }}</p>
                  </div>
                </div>
                <div class="text-right shrink-0 ml-3">
                  <p class="text-[#e0e1dd] font-mono text-sm">{{ formatCurrency(fii.currentPrice) }}</p>
                  <p class="font-mono text-xs" :class="scoreColorClass(fii.score)">{{ fii.score }} pts</p>
                </div>
              </div>
            </div>
          </div>
        </template>

        <div v-if="aporteCents === 0" class="text-center py-12">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0d1b2a]/50 mb-4">
            <svg class="w-8 h-8 text-[#415a77]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <p class="text-[#778da9] text-sm">Informe o valor do aporte para simular</p>
        </div>
      </template>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, onBeforeUnmount, watchEffect, h, defineComponent } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'
import { fetchMultipleFiis } from '@/api/bolsai'
import { rankRecommendations, simulateAporte } from '@/services/recommendation'
import type { RankedFii, SimulateAporteResult } from '@/services/recommendation'
import ErrorState from '@/components/ErrorState.vue'
import EmptyState from '@/components/EmptyState.vue'
import SimuladorSkeleton from '@/components/skeletons/SimuladorSkeleton.vue'

const portfolioStore = usePortfolioStore()

const rankedFiis = ref<RankedFii[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const result = ref<SimulateAporteResult | null>(null)
const aporteCents = ref(0)

const showEmpty = computed(() => rankedFiis.value.length === 0 && !error.value && !loading.value)

const displayValue = computed({
  get: () => {
    if (aporteCents.value === 0) return ''
    return (aporteCents.value / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  },
  set: (val: string) => {
    const digits = val.replace(/\D/g, '')
    aporteCents.value = parseInt(digits || '0', 10)
  },
})

watchEffect(() => {
  if (aporteCents.value <= 0 || rankedFiis.value.length === 0) {
    if (aporteCents.value <= 0) {
      const rem = aporteCents.value / 100
      result.value = {
        purchases: [],
        totalUsed: 0,
        remaining: rem,
        top5Alternatives: rankedFiis.value.slice(0, 5),
      }
    }
    return
  }

  const totalPortfolio = portfolioStore.totalInvested || 100000
  result.value = simulateAporte(totalPortfolio, aporteCents.value / 100, rankedFiis.value)
})

function isAtTop(): boolean {
  return window.scrollY <= 0
}

const pullDistance = ref(0)
let startY = 0
let pulling = false

function onTouchStart(e: TouchEvent) {
  if (!isAtTop()) return
  const touch = e.touches.item(0)
  if (!touch) return
  startY = touch.clientY
  pulling = true
}

function onTouchMove(e: TouchEvent) {
  if (!pulling) return
  const touch = e.touches.item(0)
  if (!touch) return
  const diff = touch.clientY - startY
  if (diff > 0) {
    pullDistance.value = Math.min(diff * 0.5, 120)
  }
}

function onTouchEnd() {
  if (pullDistance.value > 60) {
    loadData()
  }
  pullDistance.value = 0
  pulling = false
}

async function loadData() {
  if (!portfolioStore.raw) {
    await portfolioStore.fetchPortfolio()
  }
  if (!portfolioStore.raw) return

  loading.value = true
  error.value = null

  try {
    const tickers = portfolioStore.raw.holdings.map((h) => h.nome)
    if (tickers.length === 0) {
      rankedFiis.value = []
      return
    }
    const fiisMap = await fetchMultipleFiis(tickers)
    const fiisData = Array.from(fiisMap.values())
    rankedFiis.value = rankRecommendations(fiisData, portfolioStore.raw)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Erro ao carregar dados'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchmove', onTouchMove, { passive: true })
  window.addEventListener('touchend', onTouchEnd)
})

onBeforeUnmount(() => {
  window.removeEventListener('touchstart', onTouchStart)
  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('touchend', onTouchEnd)
})

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function scoreColorClass(score: number): string {
  if (score >= 70) return 'text-green-400'
  if (score >= 40) return 'text-yellow-400'
  return 'text-red-400'
}

const RankBadge = defineComponent({
  props: { rank: { type: Number, required: true } },
  setup(props) {
    const rankClasses: Record<number, string> = {
      1: 'bg-yellow-500 text-[#0d1b2a] font-bold',
      2: 'bg-gray-400 text-[#0d1b2a] font-bold',
      3: 'bg-amber-600 text-[#0d1b2a] font-bold',
    }
    return () => h('span', {
      class: `inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-mono ${rankClasses[props.rank] ?? 'bg-[#415a77] text-[#e0e1dd]'}`,
    }, String(props.rank))
  },
})
</script>
