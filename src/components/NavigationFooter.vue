<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 bg-[#0d1b2a] border-t border-[#1b263b] pb-safe">
    <div class="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center justify-center gap-0.5 flex-1 h-full rounded-lg transition-colors"
        :class="isActive(item.path) ? 'text-[#e0e1dd]' : 'text-[#778da9]'"
      >
        <component :is="item.icon" class="w-6 h-6" />
        <span class="text-[10px] font-medium leading-none">{{ item.label }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { h, defineComponent } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const DashboardIcon = defineComponent({
  setup() {
    return () =>
      h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
        h('rect', { x: '3', y: '3', width: '7', height: '7', rx: '1' }),
        h('rect', { x: '14', y: '3', width: '7', height: '7', rx: '1' }),
        h('rect', { x: '14', y: '14', width: '7', height: '7', rx: '1' }),
        h('rect', { x: '3', y: '14', width: '7', height: '7', rx: '1' }),
      ])
  },
})

const RankingIcon = defineComponent({
  setup() {
    return () =>
      h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
        h('line', { x1: '4', y1: '21', x2: '4', y2: '14' }),
        h('line', { x1: '9', y1: '21', x2: '9', y2: '10' }),
        h('line', { x1: '14', y1: '21', x2: '14', y2: '6' }),
        h('line', { x1: '19', y1: '21', x2: '19', y2: '2' }),
      ])
  },
})

const SimuladorIcon = defineComponent({
  setup() {
    return () =>
      h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
        h('rect', { x: '4', y: '2', width: '16', height: '20', rx: '2' }),
        h('line', { x1: '8', y1: '6', x2: '16', y2: '6' }),
        h('line', { x1: '8', y1: '10', x2: '14', y2: '10' }),
      ])
  },
})

const navItems = [
  { path: '/', label: 'Dashboard', icon: DashboardIcon },
  { path: '/ranking', label: 'Ranking', icon: RankingIcon },
  { path: '/simulador', label: 'Simulador', icon: SimuladorIcon },
]

function isActive(path: string): boolean {
  return route.path === path
}
</script>
