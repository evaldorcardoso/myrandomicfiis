## 06 - Cliente Bolsai API

**Pré-requisitos:** Tarefas 01, 04

### Objetivo

Criar funções TS para buscar dados de cada FII na API pública Bolsai.

### Considerações

- URL base: https://api.usebolsai.com/api/v1/fiis
- Header: X-API-Key
- Resposta inclui ticker, close_price, pvp, DY, segment
- Cache obrigatório para evitar chamadas repetidas

### Como implementar

1. src/api/bolsai.ts
2. fetchFiiData(ticker) -> Promise<FiiData>
3. fetchMultipleFiis(tickers) -> Map<string, FiiData> (paralelo controlado)
4. Fallback automático para mock, se chave de API estiver ausente
5. Tratamento de erros com retry e timeout

### DoD
- [ ] fetchFiiData funcional
- [ ] fetchMultipleFiis com Promise.allSettled
- [ ] Fallback para mock
- [ ] Timeout e retry
- [ ] Erros consistentes
