## 21 - Perfil de Alocação (JSON)

**Pré-requisitos:** Nenhuma (pode ser feito em paralelo)

### Objetivo

Criar o arquivo JSON com o perfil conservador hardcoded conforme plan.md.

### Implementação

1. src/config/allocationProfile.json
```json
{
  "name": "Conservador",
  "segments": {
    "Logística": 15,
    "Papel": 30,
    "Shopping": 15,
    "Lajes": 15,
    "Varejo/renda urbana": 15,
    "Misto": 10
  }
}
```

2. src/config/allocationProfiles.ts
   - Tipo AllocationProfile
   - Export default do profile conservador
   - Função getProfile(name)

### DoD
- [ ] JSON criado com valores do plan.md
- [ ] Tipos TS definidos
- [ ] Importável pelo settings store
- [ ] Valores somam 100%
