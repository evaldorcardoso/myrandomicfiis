<template>
  <main class="min-h-screen bg-[#e0e1dd] pb-24 pt-4 sm:pt-6 px-4 sm:px-6">
    <div class="max-w-5xl mx-auto">
      <h1 class="text-2xl sm:text-3xl font-bold text-[#0d1b2a] mb-6">Configurações</h1>

      <section class="bg-[#0d1b2a] rounded-lg p-4 sm:p-6 mb-4">
        <h2 class="text-[#778da9] text-sm font-medium uppercase tracking-wider mb-4">Perfil de Alocação</h2>
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-[#415a77]/20 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 text-[#415a77]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <div>
            <p class="text-[#e0e1dd] font-semibold">{{ settingsStore.profile.name }}</p>
            <p class="text-[#778da9] text-xs">{{ profileSegments.length }} segmentos</p>
          </div>
        </div>
        <div class="space-y-2">
          <div v-for="seg in profileSegments" :key="seg.name" class="flex items-center gap-3">
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <span class="text-[#e0e1dd] text-sm">{{ seg.name }}</span>
                <span class="text-[#778da9] text-xs font-mono">{{ seg.weight }}%</span>
              </div>
              <div class="w-full h-1.5 rounded-full bg-[#1b263b] overflow-hidden">
                <div class="h-full rounded-full bg-[#415a77]" :style="{ width: seg.weight + '%' }" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-[#0d1b2a] rounded-lg p-4 sm:p-6 mb-4">
        <h2 class="text-[#778da9] text-sm font-medium uppercase tracking-wider mb-4">Cache</h2>
        <div class="flex items-center justify-between mb-3">
          <span class="text-[#e0e1dd] text-sm">Itens em cache</span>
          <span class="text-[#778da9] font-mono text-sm">{{ cacheStats.count }}</span>
        </div>
        <div class="flex items-center justify-between mb-4">
          <span class="text-[#e0e1dd] text-sm">Tamanho total</span>
          <span class="text-[#778da9] font-mono text-sm">{{ cacheStats.size }}</span>
        </div>
        <button
          @click="requestConfirm('clearCache')"
          class="w-full py-2.5 rounded-lg bg-red-900/20 text-red-400 text-sm font-medium transition-colors hover:bg-red-900/30"
        >
          Limpar Cache
        </button>
      </section>

      <section class="bg-[#0d1b2a] rounded-lg p-4 sm:p-6 mb-4">
        <h2 class="text-[#778da9] text-sm font-medium uppercase tracking-wider mb-4">Ações</h2>
        <div class="space-y-3">
          <button
            @click="requestConfirm('forceRefresh')"
            :disabled="portfolioLoading"
            class="w-full py-2.5 rounded-lg bg-[#415a77]/20 text-[#e0e1dd] text-sm font-medium transition-colors hover:bg-[#415a77]/30 disabled:opacity-50"
          >
            {{ portfolioLoading ? 'Atualizando...' : 'Forçar Atualização do Notion' }}
          </button>
          <button
            @click="requestConfirm('updateMarket')"
            :disabled="marketLoading"
            class="w-full py-2.5 rounded-lg bg-[#415a77]/20 text-[#e0e1dd] text-sm font-medium transition-colors hover:bg-[#415a77]/30 disabled:opacity-50"
          >
            {{ marketLoading ? 'Atualizando...' : 'Atualizar Dados de Mercado' }}
          </button>
        </div>
      </section>

      <section class="bg-[#0d1b2a] rounded-lg p-4 sm:p-6 mb-4">
        <h2 class="text-[#778da9] text-sm font-medium uppercase tracking-wider mb-4">Informações</h2>
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-[#e0e1dd] text-sm">Versão</span>
            <span class="text-[#778da9] font-mono text-sm">{{ appVersion }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[#e0e1dd] text-sm">Última atualização de mercado</span>
            <span class="text-[#778da9] font-mono text-sm">{{ lastUpdateFormatted }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[#e0e1dd] text-sm">Última atualização da carteira</span>
            <span class="text-[#778da9] font-mono text-sm">{{ portfolioLastUpdate }}</span>
          </div>
        </div>
      </section>

      <div v-if="confirmingAction" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div class="bg-[#0d1b2a] rounded-lg p-6 max-w-sm w-full">
          <h3 class="text-[#e0e1dd] font-semibold mb-2">{{ confirmTitle }}</h3>
          <p class="text-[#778da9] text-sm mb-6">{{ confirmMessage }}</p>
          <div class="flex gap-3">
            <button
              @click="executeConfirmed"
              class="flex-1 py-2.5 rounded-lg bg-[#415a77] text-[#e0e1dd] text-sm font-medium transition-colors hover:bg-[#415a77]/80"
            >
              Confirmar
            </button>
            <button
              @click="cancelConfirm"
              class="flex-1 py-2.5 rounded-lg bg-[#1b263b] text-[#778da9] text-sm font-medium transition-colors hover:bg-[#1b263b]/80"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { usePortfolioStore } from '@/stores/portfolio'
import { useMarketStore } from '@/stores/market'
import { invalidate, clearAll } from '@/services/cache'
import pkg from '../../package.json'

const settingsStore = useSettingsStore()
const portfolioStore = usePortfolioStore()
const marketStore = useMarketStore()

const appVersion = pkg.version

const portfolioLoading = ref(false)
const marketLoading = ref(false)
const confirmingAction = ref<string | null>(null)
const cacheStats = ref({ count: 0, size: '0 B' })

const profileSegments = computed(() => {
  const segments = settingsStore.profile.segments
  return Object.entries(segments).map(([name, weight]) => ({ name, weight }))
})

const lastUpdateFormatted = computed(() => {
  if (!marketStore.lastUpdate) return 'Nunca'
  return new Date(marketStore.lastUpdate).toLocaleString('pt-BR')
})

const portfolioLastUpdate = computed(() => {
  if (!portfolioStore.raw) return 'Nunca'
  return new Date().toLocaleString('pt-BR')
})

const confirmTitle = computed(() => {
  const titles: Record<string, string> = {
    clearCache: 'Limpar Cache',
    forceRefresh: 'Forçar Atualização',
    updateMarket: 'Atualizar Mercado',
  }
  return titles[confirmingAction.value ?? ''] ?? ''
})

const confirmMessage = computed(() => {
  const messages: Record<string, string> = {
    clearCache: 'Tem certeza? Os dados em cache serão removidos e precisarão ser recarregados.',
    forceRefresh: 'Tem certeza? Os dados do Notion serão recarregados da fonte original.',
    updateMarket: 'Tem certeza? Os preços de mercado serão reobtidos da API.',
  }
  return messages[confirmingAction.value ?? ''] ?? ''
})

function getCacheStats() {
  let count = 0
  let totalBytes = 0
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && (key.startsWith('myrandomicfiis_') || key.startsWith('notion:'))) {
      count++
      const value = localStorage.getItem(key)
      if (value) {
        totalBytes += key.length + value.length
      }
    }
  }
  const size = totalBytes < 1024
    ? `${totalBytes} B`
    : totalBytes < 1024 * 1024
      ? `${(totalBytes / 1024).toFixed(1)} KB`
      : `${(totalBytes / (1024 * 1024)).toFixed(1)} MB`
  return { count, size }
}

function refreshCacheStats() {
  cacheStats.value = getCacheStats()
}

function requestConfirm(action: string) {
  confirmingAction.value = action
}

function cancelConfirm() {
  confirmingAction.value = null
}

async function executeConfirmed() {
  const action = confirmingAction.value
  confirmingAction.value = null
  switch (action) {
    case 'clearCache':
      clearAll()
      refreshCacheStats()
      break
    case 'forceRefresh':
      await forceRefresh()
      break
    case 'updateMarket':
      await updateMarketData()
      break
  }
}

async function forceRefresh() {
  portfolioLoading.value = true
  try {
    invalidate('portfolio:holdings')
    invalidate('portfolio:enriched')
    await portfolioStore.fetchPortfolio()
    refreshCacheStats()
  } finally {
    portfolioLoading.value = false
  }
}

async function updateMarketData() {
  marketLoading.value = true
  try {
    if (portfolioStore.raw) {
      const tickers = portfolioStore.raw.holdings.map((h) => h.nome)
      if (tickers.length > 0) {
        await marketStore.fetchMarket(tickers)
      }
    }
  } finally {
    marketLoading.value = false
  }
}

onMounted(refreshCacheStats)
</script>
