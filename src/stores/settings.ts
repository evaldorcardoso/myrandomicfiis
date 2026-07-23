import { ref } from 'vue'
import { defineStore } from 'pinia'
import allocationProfile from '../config/allocationProfiles'

export const useSettingsStore = defineStore('settings', () => {
  const aporteValue = ref(0)
  const profile = ref(allocationProfile)

  function getTargetWeightForSegment(segment: string): number {
    return profile.value.segments[segment] ?? 0
  }

  function setAporteValue(value: number) {
    aporteValue.value = value
  }

  return {
    aporteValue,
    profile,
    getTargetWeightForSegment,
    setAporteValue,
  }
})
