## 19 - Loading e Tratamento de Erros

**Pré-requisitos:** Tarefas 14, 15, 16, 17

### Objetivo

Estados de loading, erro e fallback em todas as views.

### Funcionalidades

1. Skeleton loaders para cada view
   - DashboardSkeleton.vue
   - RankingSkeleton.vue
   - SimuladorSkeleton.vue

2. Componente ErrorState.vue
   - Mensagem amigável
   - Botão retry
   - Ícone ilustrativo

3. Componente OfflineBanner.vue
   - Banner quando offline
   - Informa dados do cache

4. Empty state para quando sem dados

### Implementação

1. src/components/skeletons/*.vue
2. src/components/ErrorState.vue
3. src/components/OfflineBanner.vue
4. Integrar com stores (loading/error state)
5. navigator.onLine listener

### DoD
- [ ] Skeletons para todas as views
- [ ] ErrorState reutilizável
- [ ] OfflineBanner funcional
- [ ] Empty states
- [ ] Todas as views usam loading/error states
