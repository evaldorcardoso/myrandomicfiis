## 15 - Componentes de Card

**Pré-requisitos:** Tarefa 01

### Objetivo

Criar componentes reutilizáveis de exibição de dados.

### Componentes

1. FiiCard.vue
   - Ticker, nome, preço, variação
   - P/VP, DY, setor
   - Indicador visual (verde/vermelho)
   - Recebe props: fii (FiiMarketData)

2. StatCard.vue
   - Titulo, valor, icone
   - Variação percentual (opcional)
   - Recebe props: title, value, icon, change?

3. MetricBadge.vue
   - Badge pequeno com label e valor
   - Cores diferentes por tipo (DY=verde, P/VP=azul)

4. SkeletonCard.vue
   - Placeholder de loading para cada tipo de card

### Implementação

1. src/components/FiiCard.vue
2. src/components/StatCard.vue
3. src/components/MetricBadge.vue
4. src/components/SkeletonCard.vue
5. Todos com Tailwind, flat design, sem border-radius exagerado

### DoD
- [ ] 4 componentes criados
- [ ] Props tipadas com TS
- [ ] Responsivos
- [ ] Flat design seguindo padrão do projeto
- [ ] Reutilizáveis
