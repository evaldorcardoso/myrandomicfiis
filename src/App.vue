<template>
  <div class="min-h-screen bg-[#e0e1dd]">
    <OfflineBanner />
    <router-view />
    <NavigationFooter />
  </div>
</template>

<script setup lang="ts">
import OfflineBanner from '@/components/OfflineBanner.vue'
import NavigationFooter from '@/components/NavigationFooter.vue'
</script>
