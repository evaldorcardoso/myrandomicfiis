<template>
  <div class="rounded-lg bg-[#0d1b2a] p-4 text-[#e0e1dd] transition-colors hover:bg-[#1b263b]">
    <div class="flex items-center justify-between mb-2">
      <span class="text-xs sm:text-sm text-[#778da9] truncate">{{ title }}</span>
      <component :is="icon" class="w-5 h-5 text-[#415a77] shrink-0 ml-2" />
    </div>
    <p class="text-xl sm:text-2xl font-bold truncate">{{ formattedValue }}</p>
    <p v-if="showChange" :class="changeColor" class="text-xs sm:text-sm mt-1">
      {{ prefix }}{{ formattedChange }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'

const props = defineProps<{
  title: string
  value: number
  icon: Component
  change?: number
  changeLabel?: string
  format?: 'currency' | 'percent' | 'decimal' | 'number'
}>()

const formattedValue = computed(() => {
  if (props.format === 'currency') {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(props.value)
  }
  if (props.format === 'percent') {
    return `${props.value.toFixed(2)}%`
  }
  if (props.format === 'decimal') {
    return props.value.toFixed(2)
  }
  return props.value.toLocaleString('pt-BR')
})

const formattedChange = computed(() => {
  if (props.changeLabel) return props.changeLabel
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(props.change ?? 0)
})

const showChange = computed(() => props.change !== undefined)
const prefix = computed(() => {
  if (props.change === undefined || props.change === 0) return ''
  return props.change > 0 ? '+' : ''
})
const changeColor = computed(() => {
  if (props.change === undefined || props.change === 0) return 'text-[#778da9]'
  return props.change > 0 ? 'text-green-400' : 'text-red-400'
})
</script>
