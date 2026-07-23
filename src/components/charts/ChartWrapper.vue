<template>
  <div class="rounded-lg bg-[#0d1b2a] p-4 h-full flex flex-col min-h-0">
    <h3 class="text-[#e0e1dd] text-base sm:text-lg font-semibold mb-4 shrink-0">{{ title }}</h3>
    <div v-if="loading" class="animate-pulse flex-1 min-h-0">
      <div class="h-full bg-[#1b263b] rounded" />
    </div>
    <div v-else class="flex-1 min-h-0 flex flex-col">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  loading?: boolean
}>()
</script>
