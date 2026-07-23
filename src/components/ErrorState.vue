<template>
  <div class="rounded-lg bg-[#0d1b2a] p-6 text-center">
    <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-900/30 mb-3">
      <svg class="w-6 h-6 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>
    <p class="text-[#e0e1dd] text-sm mb-2">Erro ao carregar dados</p>
    <p class="text-[#778da9] text-xs mb-4">{{ message }}</p>
    <button
      @click="$emit('retry')"
      class="px-4 py-2 rounded-lg bg-[#415a77] text-[#e0e1dd] text-sm font-medium transition-colors hover:bg-[#1b263b]"
    >
      Tentar novamente
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string
}>()

defineEmits<{
  retry: []
}>()
</script>
