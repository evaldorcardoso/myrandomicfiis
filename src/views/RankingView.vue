<template>
  <main class="min-h-screen bg-[#e0e1dd] pb-24 pt-4 sm:pt-6 px-4 sm:px-6">
    <div ref="pullRef" class="max-w-5xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-[#0d1b2a]">Recomendações</h1>
        <button
          @click="loadRanking"
          :disabled="loading"
          class="p-2 rounded-lg bg-[#0d1b2a] text-[#e0e1dd] transition-colors hover:bg-[#1b263b] disabled:opacity-50"
          :class="{ 'animate-spin': loading }"
          aria-label="Atualizar ranking"
        >
          <RefreshIcon class="w-5 h-5" />
        </button>
      </div>

      <p
        v-if="pullDistance > 0"
        class="text-center text-[#778da9] text-sm mb-2 transition-opacity"
        :style="{ opacity: Math.min(pullDistance / 80, 1) }"
      >
        Solte para atualizar
      </p>

      <div v-if="error" class="mb-6">
        <ErrorState :message="error" @retry="loadRanking" />
      </div>

      <RankingSkeleton v-if="loading && rankedFiis.length === 0" />

      <template v-if="!loading && showEmpty">
        <EmptyState
          title="Nenhum FII disponível"
          message="Carregue sua carteira para ver as recomendações de ranking."
        />
      </template>

      <template v-if="rankedFiis.length > 0 && !error">
        <div class="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          <button
            v-for="s in segments"
            :key="s.value"
            @click="selectedSegment = s.value"
            class="whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
            :class="selectedSegment === s.value
              ? 'bg-[#0d1b2a] text-[#e0e1dd]'
              : 'bg-[#0d1b2a]/10 text-[#415a77] hover:bg-[#0d1b2a]/20'"
          >
            {{ s.label }}
          </button>
        </div>

        <div class="hidden md:block">
          <table class="w-full rounded-lg bg-[#0d1b2a] overflow-hidden">
            <thead>
              <tr class="border-b border-[#1b263b]">
                <th class="text-left text-[#778da9] text-xs font-medium uppercase tracking-wider px-4 py-3 w-12">#</th>
                <th class="text-left text-[#778da9] text-xs font-medium uppercase tracking-wider px-4 py-3">Ticker</th>
                <th class="text-center text-[#778da9] text-xs font-medium uppercase tracking-wider px-4 py-3">Score</th>
                <th class="text-right text-[#778da9] text-xs font-medium uppercase tracking-wider px-4 py-3">Preço</th>
                <th class="text-right text-[#778da9] text-xs font-medium uppercase tracking-wider px-4 py-3">P/VP</th>
                <th class="text-right text-[#778da9] text-xs font-medium uppercase tracking-wider px-4 py-3">DY</th>
                <th class="text-left text-[#778da9] text-xs font-medium uppercase tracking-wider px-4 py-3">Setor</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="fii in filteredFiis" :key="fii.ticker">
                <tr
                  @click="toggleExpand(fii.ticker)"
                  class="cursor-pointer transition-colors hover:bg-[#1b263b]"
                  :class="[isExpanded(fii.ticker) ? 'bg-[#1b263b]' : '', rankBgClass(fii.rank)]"
                >
                  <td class="px-4 py-3">
                    <RankBadge :rank="fii.rank" />
                  </td>
                  <td class="px-4 py-3">
                    <span class="text-[#e0e1dd] font-medium">{{ fii.ticker }}</span>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center justify-center gap-2">
                      <span class="text-[#e0e1dd] font-mono font-bold text-base" :class="scoreColorClass(fii.score)">{{ fii.score }}</span>
                      <div class="w-16 h-1.5 rounded-full bg-[#1b263b] overflow-hidden">
                        <div
                          class="h-full rounded-full transition-all"
                          :class="scoreBarClass(fii.score)"
                          :style="{ width: fii.score + '%' }"
                        />
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-right text-[#e0e1dd] font-mono text-sm">{{ formatCurrency(fii.currentPrice) }}</td>
                  <td class="px-4 py-3 text-right">
                    <span class="font-mono text-sm" :class="pvpColorClass(fii.pvp)">{{ formatDecimal(fii.pvp) }}</span>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <span class="font-mono text-sm text-green-400">{{ formatPercent(fii.dividendYield) }}</span>
                  </td>
                  <td class="px-4 py-3">
                    <span class="text-[#778da9] text-sm">{{ fii.segment }}</span>
                  </td>
                </tr>
                <tr v-if="isExpanded(fii.ticker)">
                  <td colspan="7" class="px-4 pb-4">
                    <ExpandedDetail :fii="fii" />
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <div class="md:hidden space-y-3">
          <div
            v-for="fii in filteredFiis"
            :key="fii.ticker"
            @click="toggleExpand(fii.ticker)"
            class="rounded-lg transition-colors cursor-pointer"
            :class="[isExpanded(fii.ticker) ? 'bg-[#1b263b]' : 'bg-[#0d1b2a]', rankBgClass(fii.rank)]"
          >
            <div class="p-4">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-3">
                  <RankBadge :rank="fii.rank" />
                  <div>
                    <p class="text-[#e0e1dd] font-semibold">{{ fii.ticker }}</p>
                    <p class="text-[#778da9] text-xs">{{ fii.segment }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-[#e0e1dd] font-mono font-bold text-lg" :class="scoreColorClass(fii.score)">{{ fii.score }}</p>
                  <p class="text-[#778da9] text-xs">/ 100</p>
                </div>
              </div>

              <div class="w-full h-1.5 rounded-full bg-[#1b263b] overflow-hidden mb-3">
                <div
                  class="h-full rounded-full transition-all"
                  :class="scoreBarClass(fii.score)"
                  :style="{ width: fii.score + '%' }"
                />
              </div>

              <div class="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p class="text-[#778da9] text-xs mb-0.5">Preço</p>
                  <p class="text-[#e0e1dd] font-mono text-sm">{{ formatCurrency(fii.currentPrice) }}</p>
                </div>
                <div>
                  <p class="text-[#778da9] text-xs mb-0.5">P/VP</p>
                  <p class="font-mono text-sm" :class="pvpColorClass(fii.pvp)">{{ formatDecimal(fii.pvp) }}</p>
                </div>
                <div>
                  <p class="text-[#778da9] text-xs mb-0.5">DY</p>
                  <p class="font-mono text-sm text-green-400">{{ formatPercent(fii.dividendYield) }}</p>
                </div>
              </div>
            </div>

            <div v-if="isExpanded(fii.ticker)" class="px-4 pb-4">
              <ExpandedDetail :fii="fii" />
            </div>
          </div>
        </div>

        <div v-if="hasActiveFilter" class="mt-4 text-center">
          <p class="text-[#778da9] text-sm">
            Exibindo {{ filteredFiis.length }} de {{ rankedFiis.length }} FIIs
          </p>
        </div>
      </template>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, onBeforeUnmount, h, defineComponent } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'
import { fetchMultipleFiis } from '@/api/bolsai'
import { rankRecommendations } from '@/services/recommendation'
import type { RankedFii } from '@/services/recommendation'
import ErrorState from '@/components/ErrorState.vue'
import EmptyState from '@/components/EmptyState.vue'
import RankingSkeleton from '@/components/skeletons/RankingSkeleton.vue'

const portfolioStore = usePortfolioStore()

const rankedFiis = ref<RankedFii[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const selectedSegment = ref('')
const expandedTicker = ref<string | null>(null)
const pullDistance = ref(0)
let startY = 0
let pulling = false

const segments = computed(() => {
  const set = new Set(rankedFiis.value.map((f) => f.segment))
  return [{ value: '', label: 'Todos' }, ...Array.from(set).sort().map((s) => ({ value: s, label: s }))]
})

const hasActiveFilter = computed(() => selectedSegment.value !== '')

const filteredFiis = computed(() => {
  if (!hasActiveFilter.value) return rankedFiis.value
  return rankedFiis.value.filter((f) => f.segment === selectedSegment.value)
})

const showEmpty = computed(() => rankedFiis.value.length === 0 && !error.value && !loading.value)

function isExpanded(ticker: string): boolean {
  return expandedTicker.value === ticker
}

function toggleExpand(ticker: string) {
  expandedTicker.value = expandedTicker.value === ticker ? null : ticker
}

function isAtTop(): boolean {
  return window.scrollY <= 0
}

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
    loadRanking()
  }
  pullDistance.value = 0
  pulling = false
}

async function loadRanking() {
  if (!portfolioStore.raw) {
    await portfolioStore.fetchPortfolio()
  }
  if (!portfolioStore.raw) return

  loading.value = true
  error.value = null
  expandedTicker.value = null

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
    error.value = e instanceof Error ? e.message : 'Erro ao carregar ranking'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadRanking()
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

function formatDecimal(value: number): string {
  return value.toFixed(2)
}

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`
}

function rankBgClass(rank: number): string {
  if (rank === 1) return 'bg-yellow-900/5'
  if (rank === 2) return 'bg-gray-400/5'
  if (rank === 3) return 'bg-amber-900/5'
  return ''
}

function scoreColorClass(score: number): string {
  if (score >= 70) return 'text-green-400'
  if (score >= 40) return 'text-yellow-400'
  return 'text-red-400'
}

function scoreBarClass(score: number): string {
  if (score >= 70) return 'bg-green-500'
  if (score >= 40) return 'bg-yellow-500'
  return 'bg-red-500'
}

function pvpColorClass(pvp: number): string {
  if (pvp <= 0 || pvp > 5) return 'text-[#e0e1dd]'
  if (pvp <= 1.0) return 'text-green-400'
  if (pvp <= 1.2) return 'text-yellow-400'
  return 'text-red-400'
}

const RefreshIcon = defineComponent({
  setup() {
    return () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('polyline', { points: '23 4 23 10 17 10' }),
      h('polyline', { points: '1 20 1 14 7 14' }),
      h('path', { d: 'M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15' }),
    ])
  },
})

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

const ExpandedDetail = defineComponent({
  props: { fii: { type: Object as () => RankedFii, required: true } },
  setup(props) {
    const breakdowns = [
      { label: 'Rebalanceamento', score: props.fii.rebalanceScore, weight: 40, icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
      { label: 'P/VP', score: props.fii.pvpScore, weight: 30, icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
      { label: 'Dividend Yield', score: props.fii.dyScore, weight: 15, icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3' },
      { label: 'Diversificação', score: props.fii.diversificationScore, weight: 10, icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
      { label: 'Liquidez', score: props.fii.liquidityScore, weight: 5, icon: 'M3 3v18h18M7 16l4-4 4 4 5-5' },
    ]

    return () => {
      const fii = props.fii
      return h('div', { class: 'bg-[#0d1b2a] rounded-lg p-4 space-y-3' }, [
        h('div', { class: 'grid grid-cols-2 gap-4 mb-3' }, [
          h('div', [
            h('p', { class: 'text-[#778da9] text-xs mb-1' }, 'Alocação Atual'),
            h('p', { class: 'text-[#e0e1dd] font-mono text-sm' }, `${fii.currentAllocation.toFixed(1)}%`),
          ]),
          h('div', [
            h('p', { class: 'text-[#778da9] text-xs mb-1' }, 'Alocação Alvo'),
            h('p', { class: 'text-[#e0e1dd] font-mono text-sm' }, `${fii.targetAllocation.toFixed(1)}%`),
          ]),
        ]),
        h('div', { class: 'w-full h-2 rounded-full bg-[#1b263b] overflow-hidden mb-3' }, [
          fii.targetAllocation > 0
            ? h('div', {
                class: 'h-full rounded-full bg-[#415a77] transition-all',
                style: { width: Math.min(100, (fii.currentAllocation / fii.targetAllocation) * 100) + '%' },
              })
            : null,
        ]),
        h('div', { class: 'space-y-2' }, [
          ...breakdowns.map((b) => {
            const contribution = Math.round(b.score * b.weight / 100)
            return h('div', { class: 'flex items-center gap-3' }, [
              h('svg', { class: 'w-3.5 h-3.5 text-[#415a77] shrink-0', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
                h('path', { d: b.icon }),
              ]),
              h('div', { class: 'flex-1 min-w-0' }, [
                h('div', { class: 'flex items-center justify-between mb-1' }, [
                  h('span', { class: 'text-[#778da9] text-xs' }, b.label),
                  h('span', { class: 'text-[#e0e1dd] text-xs font-mono' }, `${contribution}/${b.weight}`),
                ]),
                h('div', { class: 'w-full h-1 rounded-full bg-[#1b263b] overflow-hidden' }, [
                  h('div', {
                    class: `h-full rounded-full ${scoreBarClass(b.score)}`,
                    style: { width: b.score + '%' },
                  }),
                ]),
              ]),
            ])
          }),
        ]),
      ])
    }
  },
})
</script>
