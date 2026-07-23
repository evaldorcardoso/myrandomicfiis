<template>
  <span class="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-medium" :class="badgeClass">
    <span class="opacity-70">{{ label }}</span>
    <span>{{ displayValue }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  value: number | string
  type?: 'dy' | 'pvp' | 'default'
  format?: 'percent' | 'decimal' | 'currency'
}>()

const displayValue = computed(() => {
  if (typeof props.value === 'string') return props.value
  if (props.format === 'percent') return `${props.value.toFixed(2)}%`
  if (props.format === 'decimal') return props.value.toFixed(2)
  if (props.format === 'currency') {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(props.value)
  }
  return props.value.toLocaleString('pt-BR')
})

const badgeClass = computed(() => {
  switch (props.type) {
    case 'dy': return 'bg-green-900/30 text-green-400'
    case 'pvp': return 'bg-blue-900/30 text-blue-400'
    default: return 'bg-[#415a77]/20 text-[#778da9]'
  }
})
</script>
