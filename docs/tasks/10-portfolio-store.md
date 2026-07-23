## 10 - Store portfolio (Pinia)

**Pré-requisitos:** Tarefas 05, 07, 08

### Objetivo

Pinia store central para dados do portfólio.

### Funcionalidades

- fiis: FiiHolding[]
- totalInvested: number
- totalCurrent: number
- loading: boolean
- error: string | null
- fetchPortfolio(): action
- refreshPrices(): action

### Como implementar

1. src/stores/portfolio.ts
2. defineStore('portfolio', ...)
3. fetchPortfolio: load from portfolio service, then fetch market data for each FII
4. store calculates totals and percent in getters
5. refreshPrices: re-fetch all prices

### DoD
- [ ] Store definida e exportada
- [ ] fetchPortfolio funcional
- [ ] refreshPrices funcional
- [ ] loading e erros tratados
