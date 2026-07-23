<template>
  <ChartWrapper title="Alocação por Setor" :loading="loading">
    <div v-if="hasData" class="flex flex-col sm:flex-row items-center gap-4">
      <apexchart
        type="donut"
        height="260"
        width="100%"
        :options="chartOptions"
        :series="series"
      />
    </div>
    <p v-else class="text-[#778da9] text-center py-8 text-sm">
      Nenhum dado de alocação disponível
    </p>
  </ChartWrapper>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SegmentAllocation } from '@/services/portfolio'
import ChartWrapper from './ChartWrapper.vue'

const props = defineProps<{
  data: SegmentAllocation[]
  loading?: boolean
}>()

const hasData = computed(() => props.data.length > 0 && props.data.some(d => d.percentage > 0))

const colors = ['#415a77', '#778da9', '#0d1b2a', '#1b263b', '#e0e1dd', '#5a7a9e', '#2a3f5a', '#3d5670']

const series = computed(() => props.data.map(d => Number(d.percentage.toFixed(1))))

const chartOptions = computed(() => ({
  chart: {
    type: 'donut' as const,
    toolbar: { show: false },
    foreColor: '#778da9',
  },
  labels: props.data.map(d => d.segment),
  colors,
  plotOptions: {
    pie: {
      donut: {
        size: '55%',
        labels: {
          show: true,
          name: { color: '#e0e1dd', fontSize: '12px' },
          value: { color: '#e0e1dd', fontSize: '14px', fontWeight: 'bold' },
          total: {
            show: true,
            label: 'Total',
            color: '#e0e1dd',
            fontSize: '14px',
            formatter: () => '100%',
          },
        },
      },
    },
  },
  dataLabels: {
    enabled: true,
    style: { fontSize: '11px', colors: ['#e0e1dd'] },
    dropShadow: { enabled: false },
  },
  legend: {
    position: 'bottom' as const,
    labels: { colors: '#e0e1dd' },
    itemMargin: { horizontal: 8, vertical: 4 },
  },
  tooltip: {
    theme: 'dark' as const,
    y: {
      formatter: (_val: number, { seriesIndex }: { seriesIndex: number }) => {
        const d = props.data[seriesIndex]
        if (!d) return ''
        const diff = d.targetPercentage - d.percentage
        const signal = diff > 0 ? '+' : ''
        return `<span class="text-[#e0e1dd]">${d.percentage.toFixed(1)}%</span><br/>
                <span class="text-[#778da9] text-xs">Alvo: ${d.targetPercentage.toFixed(1)}%</span><br/>
                <span class="${diff >= 0 ? 'text-green-400' : 'text-red-400'} text-xs">${signal}${diff.toFixed(1)}%</span>`
      },
    },
  },
  responsive: [
    {
      breakpoint: 640,
      options: {
        chart: { height: 220 },
        legend: { position: 'bottom', fontSize: '11px' },
      },
    },
  ],
}))
</script>
