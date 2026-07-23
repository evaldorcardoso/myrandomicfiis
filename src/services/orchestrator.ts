import { usePortfolioStore } from '@/stores/portfolio'
import { useMarketStore } from '@/stores/market'

export interface OrchestratorState {
  step: 'idle' | 'portfolio' | 'market' | 'done' | 'error'
  portfolioError: string | null
  marketError: string | null
  hasMissingTickers: boolean
}

type Listener = (state: OrchestratorState) => void
const listeners = new Set<Listener>()

const _state: OrchestratorState = {
  step: 'idle',
  portfolioError: null,
  marketError: null,
  hasMissingTickers: false,
}

export function getOrchestratorState(): OrchestratorState {
  return { ..._state }
}

function notify() {
  const snapshot = getOrchestratorState()
  listeners.forEach((fn) => fn(snapshot))
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export async function orchestrateFullFlow(forceRefresh = false): Promise<void> {
  const portfolioStore = usePortfolioStore()
  const marketStore = useMarketStore()

  _state.portfolioError = null
  _state.marketError = null
  _state.hasMissingTickers = false

  _state.step = 'portfolio'
  notify()

  try {
    if (forceRefresh) {
      portfolioStore.invalidateCache()
    }
    await portfolioStore.fetchPortfolio()
  } catch (e) {
    _state.portfolioError = e instanceof Error ? e.message : 'Erro ao carregar portfólio'
    _state.step = 'error'
    notify()
    return
  }

  const tickers = portfolioStore.fiis.map((f) => f.nome)
  if (tickers.length === 0) {
    _state.step = 'done'
    notify()
    return
  }

  _state.step = 'market'
  notify()

  try {
    await marketStore.fetchMarket(tickers)
  } catch (e) {
    _state.marketError = e instanceof Error ? e.message : 'Erro ao carregar dados de mercado'
  }

  _state.hasMissingTickers = tickers.some((t) => !marketStore.getMarketData(t))

  _state.step = 'done'
  notify()
}

export function resetOrchestrator(): void {
  _state.step = 'idle'
  _state.portfolioError = null
  _state.marketError = null
  _state.hasMissingTickers = false
}