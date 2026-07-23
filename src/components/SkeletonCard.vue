<template>
  <div v-if="variant === 'stat'" class="rounded-lg bg-[#1b263b] p-4 animate-pulse">
    <div class="flex items-center justify-between mb-3">
      <div class="h-3 w-24 bg-[#415a77] rounded" />
      <div class="h-5 w-5 bg-[#415a77] rounded" />
    </div>
    <div class="h-7 w-32 bg-[#415a77] rounded mb-2" />
    <div class="h-4 w-20 bg-[#415a77] rounded" />
  </div>

  <div v-else-if="variant === 'fii'" class="rounded-lg bg-[#1b263b] p-4 animate-pulse">
    <div class="flex items-start justify-between mb-3">
      <div class="space-y-2">
        <div class="h-5 w-20 bg-[#415a77] rounded" />
        <div class="h-3 w-32 bg-[#415a77] rounded" />
      </div>
      <div class="h-4 w-16 bg-[#415a77] rounded" />
    </div>
    <div class="h-7 w-28 bg-[#415a77] rounded mb-3" />
    <div class="flex gap-2">
      <div class="h-5 w-16 bg-[#415a77] rounded" />
      <div class="h-5 w-14 bg-[#415a77] rounded" />
    </div>
  </div>

  <div v-else class="rounded-lg bg-[#1b263b] p-4 animate-pulse">
    <div class="h-3 w-20 bg-[#415a77] rounded mb-2" />
    <div class="h-4 w-12 bg-[#415a77] rounded" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'stat' | 'fii' | 'badge'
}>()
</script>
