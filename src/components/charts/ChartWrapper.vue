<template>
  <div class="rounded-lg bg-[#0d1b2a] p-4">
    <h3 class="text-[#e0e1dd] text-base sm:text-lg font-semibold mb-4">{{ title }}</h3>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>
