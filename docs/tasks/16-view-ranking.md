## 16 - View Ranking/Recomendação

**Pré-requisitos:** Tarefas 09, 10, 11, 12

### Objetivo

Tela que exibe o ranking de recomendações dos FIIs para o próximo aporte.

### Funcionalidades

- Tabela ranqueada: Posição, Ticker, Score, Preço, P/VP, DY, Setor
- Top 1 destacado visualmente
- Ordenação por score decrescente
- Filtros por setor
- Pull-to-refresh

### Implementação

1. src/views/RankingView.vue
2. Usa recommendation service para gerar ranking
3. Exibe tabela responsiva (mobile: cards, desktop: tabela)
4. Top 3 com cores diferentes
5. Click em um FII mostra detalhes (modal ou expand)

### DoD
- [ ] RankingView.vue criado
- [ ] Ranking com score exibido
- [ ] Top destacado
- [ ] Responsivo
- [ ] Filtro por setor
- [ ] Loading state
