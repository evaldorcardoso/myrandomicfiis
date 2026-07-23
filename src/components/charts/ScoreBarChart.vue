<template>
  <ChartWrapper title="Top 5 FIIs por Score" :loading="loading">
    <div v-if="hasData">
      <apexchart
        type="bar"
        height="280"
        :options="chartOptions"
        :series="series"
      />
    </div>
    <p v-else class="text-[#778da9] text-center py-8 text-sm">
      Nenhum dado disponível
    </p>
  </ChartWrapper>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RankedFii } from '@/services/recommendation'
import ChartWrapper from './ChartWrapper.vue'

const props = defineProps<{
  data: RankedFii[]
  loading?: boolean
}>()

const hasData = computed(() => props.data.length > 0)

const topFiis = computed(() => [...props.data].sort((a, b) => b.score - a.score).slice(0, 5))

const series = computed(() => [
  {
    name: 'Score',
    data: topFiis.value.map(fii => fii.score),
  },
])

const chartOptions = computed(() => ({
  chart: {
    type: 'bar' as const,
    toolbar: { show: false },
    foreColor: '#778da9',
  },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 4,
      barHeight: '60%',
    },
  },
  colors: ['#415a77'],
  xaxis: {
    categories: topFiis.value.map(fii => fii.ticker),
    max: 100,
    labels: {
      style: { colors: '#e0e1dd' },
    },
  },
  yaxis: {
    labels: {
      style: { colors: '#e0e1dd' },
    },
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${val}`,
    style: { colors: ['#e0e1dd'], fontSize: '12px' },
  },
  grid: {
    borderColor: '#1b263b',
  },
  tooltip: {
    theme: 'dark' as const,
    y: {
      formatter: (val: number) => `${val}/100`,
    },
  },
  responsive: [
    {
      breakpoint: 640,
      options: {
        chart: { height: 240 },
        dataLabels: { style: { fontSize: '10px' } },
      },
    },
  ],
}))
</script>
