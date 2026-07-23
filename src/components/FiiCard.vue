<template>
  <div class="rounded-lg bg-[#0d1b2a] p-4 transition-colors hover:bg-[#1b263b]">
    <div class="flex items-start justify-between mb-3">
      <div class="min-w-0">
        <h3 class="text-[#e0e1dd] text-base sm:text-lg font-bold truncate">{{ fii.ticker }}</h3>
        <p v-if="name || segment" class="text-[#778da9] text-xs truncate">{{ name || segment }}</p>
      </div>
      <span
        v-if="change !== undefined"
        class="text-sm font-semibold shrink-0 ml-3"
        :class="changeColor"
      >
        {{ change > 0 ? '+' : '' }}{{ formattedChange }}
      </span>
    </div>

    <p class="text-[#e0e1dd] text-xl sm:text-2xl font-bold mb-3">{{ formattedPrice }}</p>

    <div class="flex gap-2 flex-wrap">
      <MetricBadge label="P/VP" :value="fii.pvp" type="pvp" format="decimal" />
      <MetricBadge label="DY" :value="fii.dy" type="dy" format="percent" />
      <MetricBadge v-if="segment" label="Setor" :value="segment" type="default" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FiiMarketData } from '@/types'
import MetricBadge from '@/components/MetricBadge.vue'

const props = defineProps<{
  fii: FiiMarketData
  name?: string
  segment?: string
  change?: number
}>()

const formattedPrice = computed(() =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(props.fii.price)
)

const formattedChange = computed(() => {
  return new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(props.change ?? 0) / 100)
})

const changeColor = computed(() => {
  if (props.change === undefined || props.change === 0) return 'text-[#778da9]'
  return props.change > 0 ? 'text-green-400' : 'text-red-400'
})
</script>
