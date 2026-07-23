## 23 - Testes Unitários

**Pré-requisitos:** Todas as tarefas anteriores

### Objetivo

Escrever testes unitários para as partes críticas do app.

### Ferramentas

- Vitest (já vem com Vite)
- @vue/test-utils

### Testes

1. services/recommendation.test.ts
   - calculateScore retorna valor entre 0 e 100
   - score com PVP baixo é maior que com PVP alto
   - score com DY alto é maior que com DY baixo
   - score com liquidez baixa penaliza
   - rankRecommendations ordena corretamente
   - simulateAporte calcula cotas corretamente
   - simulateAporte minimiza saldo residual

2. services/cache.test.ts
   - set/get funciona
   - TTL expira corretamente
   - invalidate remove item
   - clearAll limpa tudo

3. services/portfolio.test.ts
   - extractFiiList mapeia corretamente
   - calcTotals soma corretamente

4. api/bolsai.test.ts
   - fetchFiiData usa mock quando sem chave
   - fetchMultipleFiis retorna map

### Implementação

1. Instalar vitest e @vue/test-utils
2. Configurar vitest.config.ts
3. Criar arquivos .test.ts
4. Adicionar script "test" no package.json

### DoD
- [ ] Vitest configurado
- [ ] Testes do algoritmo de score
- [ ] Testes do cache
- [ ] Testes do portfolio service
- [ ] Todos passam com npm test
