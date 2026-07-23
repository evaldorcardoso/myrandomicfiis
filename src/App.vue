<template>
  <div class="min-h-screen bg-[#e0e1dd]">
    <router-view />
    <NavigationFooter />
  </div>
</template>

<script setup lang="ts">
import NavigationFooter from '@/components/NavigationFooter.vue'
</script>
