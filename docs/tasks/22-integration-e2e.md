## 22 - Integração Ponta a Ponta

**Pré-requisitos:** Todas as tarefas anteriores

### Objetivo

Garantir que o fluxo completo funcione: abrir app → Notion → Bolsai → score → ranking → simulador.

### Fluxo

1. App inicia
2. Busca FIIs do Notion (cache ou API)
3. Para cada FII, busca dados de mercado (Bolsai ou mock)
4. Calcula scores
5. Exibe ranking
6. Usuário informa aporte
7. Simulador mostra sugestão

### Implementação

1. Integrar todas as stores
2. Orquestrar chamadas no App.vue ou DashboardView
3. Garantir ordem correta de chamadas
4. Tratar erros em cada etapa
5. Cache funciona em toda a cadeia

### DoD
- [ ] Fluxo completo funciona
- [ ] Erros em uma etapa não derrubam o app
- [ ] Cache funciona
- [ ] Dados mock funcionam para testes
- [ ] Build produção OK
