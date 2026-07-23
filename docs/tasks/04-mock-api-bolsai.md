## 04 - Mock da Bolsai API

**Pré-requisitos:** Tarefa 01

### Objetivo

Criar mocks com dados de 10 FIIs (HGLG11, KNRI11, MXRF11, etc) com preços, P/VP, DY, liquidez, setor, patrimônio, para testes offline.

### Passo a passo

1. src/api/__mocks__/BolsaiMock.ts
   - Mock FiiData: ticker, name, reference_date, close_price, pvp, dividend_yield_ttm, net_asset_value, segment, liquidity etc
   - Lista de 10+ FIIs com dados ficticios, proximos da realidade
   - Função factory que gera dados consistentes com fórmula PVP * book_value = close_price

2. Criar src/api/__mocks__/index.ts
   - Função getMockFii(ticker): retorna mock de um FII
   - Função getAllMockFiis(): retorna array de mocks
   - Util para gerar pequenas variacoes nos precos

3. src/api/bolsai.ts deve importar mocks como fallback caso a chave de API não exista

### DoD
- [ ] 10+ FIIs mock criados
- [ ] Factory function gera dados consistentes
- [ ] Mocks importáveis e testáveis
- [ ] src/api/bolsai.ts usa mocks como fallback
