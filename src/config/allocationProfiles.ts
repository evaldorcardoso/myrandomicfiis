import profile from './allocationProfile.json'

export interface AllocationProfile {
  name: string
  segments: Record<string, number>
  total: number
}

function computeTotal(segments: Record<string, number>): number {
  return Object.values(segments).reduce((sum, v) => sum + v, 0)
}

const conservador: AllocationProfile = {
  ...profile,
  total: computeTotal(profile.segments),
}

export default conservador

const profiles: AllocationProfile[] = [conservador]

export function getProfile(name: string): AllocationProfile | undefined {
  return profiles.find((p) => p.name === name)
}
