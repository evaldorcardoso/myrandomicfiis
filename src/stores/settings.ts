import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import allocationProfile from '../config/allocationProfiles'
import type { UsageData } from '@/types'

export const useSettingsStore = defineStore('settings', () => {
  const aporteValue = ref(0)
  const profile = ref(allocationProfile)
  const usage = ref<UsageData | null>(null)
  const usageLoading = ref(false)
  const usageError = ref<string | null>(null)

  function getTargetWeightForSegment(segment: string): number {
    return profile.value.segments[segment] ?? 0
  }

  function setAporteValue(value: number) {
    aporteValue.value = value
  }

  async function fetchUsage() {
    usageLoading.value = true
    usageError.value = null
    try {
      const { fetchUsage } = await import('@/api/bolsai')
      usage.value = await fetchUsage()
    } catch (e) {
      usageError.value = e instanceof Error ? e.message : 'Erro ao carregar uso da API'
      usage.value = null
    } finally {
      usageLoading.value = false
    }
  }

  const usagePercent = computed(() => {
    if (!usage.value) return 0
    return (usage.value.used_today / usage.value.daily_limit) * 100
  })

  const isUsageWarning = computed(() => usagePercent.value > 75)

  return {
    aporteValue,
    profile,
    usage,
    usageLoading,
    usageError,
    getTargetWeightForSegment,
    setAporteValue,
    fetchUsage,
    usagePercent,
    isUsageWarning,
  }
})