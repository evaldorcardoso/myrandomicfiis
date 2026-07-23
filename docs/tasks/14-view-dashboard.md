## 14 - View Dashboard

**Pré-requisitos:** Tarefas 10, 11, 12, 13, 15

### Objetivo

Tela principal que mostra visão geral da carteira de FIIs.

### Métricas exibidas

- Patrimônio investido
- Patrimônio atual
- Lucro/prejuízo (absoluto e %)
- Dividend Yield médio ponderado
- P/VP médio ponderado
- Quantidade de FIIs
- Total investido

### Implementação

1. src/views/DashboardView.vue
2. Composição:
   - Header com titulo "Meus FIIs"
   - Grid de StatCards com cada métrica
   - Gráfico de pizza com alocação por setor (ApexCharts)
   - Lista resumida dos top 5 FIIs
3. Dados vêm do store portfolio e market
4. Loading state com skeleton
5. Pull-to-refresh em mobile

### DoD
- [ ] DashboardView.vue criado
- [ ] Todas as métricas exibidas
- [ ] Gráfico de pizza funcional
- [ ] Responsivo (mobile-first)
- [ ] Loading skeleton
- [ ] Empty state quando sem dados
