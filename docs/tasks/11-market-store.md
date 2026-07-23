## 11 - Store market (Pinia)

**Pré-requisitos:** Tarefas 06, 07, 08

### Objetivo

Pinia store para dados de mercado de FIIs (preços, P/VP, DY, liquidez).

### Funcionalidades

- prices: Record<string, FiiMarketData>
- lastUpdate: string | null
- loading: boolean
- error: string | null
- fetchMarket(tickers): action
- getMarketData(ticker): computed

### Como implementar

1. src/stores/market.ts
2. defineStore('market', ...)
3. fetchMarket(tickers): Bolsai API call with cache
4. cachedMarketData getter that returns map ticker -> market data

### DoD
- [ ] Store definida
- [ ] fetchMarket funcional
- [ | cache integrado
- [ ] retry e erros
- [ ] lastUpdate atualizado
