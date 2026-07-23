## 08 - Portfolio Service

**Pré-requisitos:** Tarefas 05, 07

### Objetivo

Serviço que orquestra a identificação de FIIs da carteira. Carrega dados do Notion, mapea para modelo uniforme.

### Funcionalidades

- loadPortfolio(): Notion -> FiiHolding[]
- calcTotals(fiis): Total Invested, Total Current
- calcAllocation(fiis): Percentual por FII e setor

### Como implementar

1. src/services/portfolio.ts
2. Chama queryDatabase do Cliente Notion
3. Mapea reultados Notion → FiiHolding[]
4. Calcula totais
5. Implementa cache do portfolio (TTL 10 min)
6. função refreshPorfolio() ignora cache

### DoD
- [ ] load e refresh Portfolio funcionais
- [ ] Total investido, corrente e percentuais
- [ ] Cache integrado
- [ ] getSegmentAllocation
- [ ] Erros tratados
