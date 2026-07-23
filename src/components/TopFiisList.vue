<template>
  <div class="rounded-lg bg-[#0d1b2a] p-4 h-full flex flex-col min-h-0">
    <h3 class="text-[#e0e1dd] text-base sm:text-lg font-semibold mb-4 shrink-0">Top FIIs</h3>
    <ul v-if="topFiis.length" class="space-y-3 flex-1 min-h-0">
      <li
        v-for="(fii, index) in topFiis"
        :key="fii.ticker"
        class="flex items-center justify-between text-sm"
      >
        <div class="flex items-center gap-3 min-w-0">
          <span class="text-[#415a77] font-mono w-5 text-right shrink-0">{{ index + 1 }}</span>
          <div class="min-w-0">
            <p class="text-[#e0e1dd] font-medium truncate">{{ fii.ticker }}</p>
            <p class="text-[#778da9] text-xs truncate">{{ fii.segment }}</p>
          </div>
        </div>
        <div class="text-right shrink-0 ml-4">
          <p class="text-[#e0e1dd] font-medium">{{ fii.percentage.toFixed(1) }}%</p>
          <p class="text-[#778da9] text-xs">
            {{ formatCurrency(fii.current) }}
          </p>
        </div>
      </li>
    </ul>
    <p v-else class="text-[#778da9] text-center py-8 text-sm">
      Nenhum FII na carteira
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FiiAllocation } from '@/services/portfolio'

const props = defineProps<{
  fiis: FiiAllocation[]
}>()

const topFiis = computed(() =>
  [...props.fiis]
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5)
)

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}
</script>
