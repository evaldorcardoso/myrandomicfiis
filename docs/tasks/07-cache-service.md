## 07 - Cache Service

**Pré-requisitos:** Tarefa 01

### Objetivo

wrapper de localStorage para cache com validade (TTL). Único lugar onde cache é controlado.

### Funcionalidades

- set(key, value, ttl) ttl em minutos
- get(key) -> value | null
- has(key) -> booleano
- invalidate(key)
- clearAll()

### Como implementar

1. src/services/cache.ts
2. prefix keys with something like 'myrandomicfiis_'
3. TTL armazenado com timestamp de expiração
4. TTL padrão de 5 minutos para dados de mercado
5. TTL de 10 minutos para dados de Notion
6. get() verifica expiração e remove se expirado

### DoD
- [ ] src/services/cache.ts criado
- [ ] set/get/has/invalidate/clearAll funcionais

- [ ] TTL respeitado
- [ ] itens expirados são removidos
