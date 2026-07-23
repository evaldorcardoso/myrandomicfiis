<template>
  <main class="min-h-screen bg-[#e0e1dd] pb-24 pt-4 sm:pt-6 px-4 sm:px-6 flex flex-col">
    <div ref="pullRef" class="max-w-5xl mx-auto w-full flex flex-col flex-1">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-[#0d1b2a]">Meus FIIs</h1>
        <button
          @click="handleRefresh"
          :disabled="portfolioStore.loading || state.step === 'portfolio' || state.step === 'market'"
          class="p-2 rounded-lg bg-[#0d1b2a] text-[#e0e1dd] transition-colors hover:bg-[#1b263b] disabled:opacity-50"
          :class="{ 'animate-spin': portfolioStore.loading }"
          aria-label="Atualizar dados"
        >
          <RefreshIcon class="w-5 h-5" />
        </button>
      </div>

      <p v-if="pullDistance > 0" class="text-center text-[#778da9] text-sm mb-2 transition-opacity" :style="{ opacity: Math.min(pullDistance / 80, 1) }">
        Solte para atualizar
      </p>

      <div v-if="orchestrationError" class="mb-6">
        <ErrorState :message="orchestrationError" @retry="handleRefresh" />
      </div>

      <DashboardSkeleton v-if="(state.step === 'portfolio' || state.step === 'market') && !portfolioStore.raw" />

      <template v-if="!portfolioStore.loading && portfolioStore.raw && isEmpty">
        <EmptyState />
      </template>

      <template v-if="portfolioStore.raw && !isEmpty">
        <section class="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
          <StatCard
            title="Patrimônio Investido"
            :value="portfolioStore.totalInvested"
            :icon="InvestedIcon"
            format="currency"
          />
          <StatCard
            title="Patrimônio Atual"
            :value="portfolioStore.totalCurrent"
            :icon="CurrentIcon"
            format="currency"
          />
          <StatCard
            title="Lucro / Prejuízo"
            :value="portfolioStore.totalProfitLoss"
            :icon="ProfitIcon"
            format="currency"
            :change="profitLossPercent"
            :changeLabel="profitLossLabel"
          />
          <StatCard
            title="Dividend Yield"
            :value="portfolioStore.averageDY"
            :icon="DYIcon"
            format="percent"
          />
          <StatCard
            title="P / VP Médio"
            :value="portfolioStore.averagePVP"
            :icon="PVPIcon"
            format="decimal"
          />
          <StatCard
            title="Quantidade de FIIs"
            :value="portfolioStore.fiiCount"
            :icon="CountIcon"
            format="number"
          />
        </section>

        <section class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 flex-1 auto-rows-fr">
          <AllocationPieChart class="h-full" :data="portfolioStore.segmentAllocation" />
          <TopFiisList class="h-full" :fiis="portfolioStore.fiiAllocation" />
        </section>
      </template>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, onBeforeUnmount, defineAsyncComponent, h, defineComponent } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'
import { orchestrateFullFlow, subscribe, resetOrchestrator, getOrchestratorState } from '@/services/orchestrator'
import StatCard from '@/components/StatCard.vue'
import DashboardSkeleton from '@/components/skeletons/DashboardSkeleton.vue'
import TopFiisList from '@/components/TopFiisList.vue'
import ErrorState from '@/components/ErrorState.vue'
import EmptyState from '@/components/EmptyState.vue'

const AllocationPieChart = defineAsyncComponent(() => import('@/components/charts/AllocationPieChart.vue'))

const portfolioStore = usePortfolioStore()

const state = ref(getOrchestratorState())
const orchestrationError = computed(() => state.value.portfolioError || state.value.marketError)

const pullRef = ref<HTMLElement | null>(null)
const pullDistance = ref(0)
let startY = 0
let pulling = false

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
    handleRefresh()
  }
  pullDistance.value = 0
  pulling = false
}

onMounted(async () => {
  const unsub = subscribe((s) => { state.value = s })
  await orchestrateFullFlow()
  unsub()
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchmove', onTouchMove, { passive: true })
  window.addEventListener('touchend', onTouchEnd)
})

onBeforeUnmount(() => {
  window.removeEventListener('touchstart', onTouchStart)
  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('touchend', onTouchEnd)
  resetOrchestrator()
})

const isEmpty = computed(() => portfolioStore.fiiCount === 0)

const profitLossPercent = computed(() => {
  if (portfolioStore.totalInvested === 0) return 0
  return (portfolioStore.totalProfitLoss / portfolioStore.totalInvested) * 100
})

const profitLossLabel = computed(() => {
  const pct = profitLossPercent.value
  const prefix = pct >= 0 ? '+' : ''
  return `${prefix}${pct.toFixed(2)}%`
})

async function handleRefresh() {
  const unsub = subscribe((s) => { state.value = s })
  await orchestrateFullFlow(true)
  unsub()
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

const InvestedIcon = defineComponent({
  setup() {
    return () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('path', { d: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' }),
    ])
  },
})

const CurrentIcon = defineComponent({
  setup() {
    return () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('line', { x1: '12', y1: '1', x2: '12', y2: '23' }),
      h('path', { d: 'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' }),
    ])
  },
})

const ProfitIcon = defineComponent({
  setup() {
    return () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('line', { x1: '12', y1: '20', x2: '12', y2: '10' }),
      h('line', { x1: '18', y1: '20', x2: '18', y2: '4' }),
      h('line', { x1: '6', y1: '20', x2: '6', y2: '16' }),
    ])
  },
})

const DYIcon = defineComponent({
  setup() {
    return () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
      h('polyline', { points: '7 10 12 15 17 10' }),
      h('line', { x1: '12', y1: '15', x2: '12', y2: '3' }),
    ])
  },
})

const PVPIcon = defineComponent({
  setup() {
    return () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('rect', { x: '2', y: '3', width: '20', height: '14', rx: '2' }),
      h('line', { x1: '8', y1: '21', x2: '16', y2: '21' }),
      h('line', { x1: '12', y1: '17', x2: '12', y2: '21' }),
    ])
  },
})

const CountIcon = defineComponent({
  setup() {
    return () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }),
      h('circle', { cx: '9', cy: '7', r: '4' }),
      h('path', { d: 'M22 21v-2a4 4 0 0 0-3-3.87' }),
      h('path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' }),
    ])
  },
})
</script>
