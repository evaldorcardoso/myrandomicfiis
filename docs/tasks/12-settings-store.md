## 12 - Simple Store settings

**Pré-requisitos:** Tarefa 21

### Objetivo

Guardar as preferencias do usuario, como valor de aporte e perfil de alocação.

### Funcionalidades

- aporteValue: number (entered by user)
- allocationProfile: AllocationProfile (from config)
- getTargetWeightForSegment(string): number
- setAporteValue(number): action

### Como implementar

1. src/stores/settings.ts
2. define store('settings', ...)
3. import allocationProfile from config json
4. store aporte
5. getters for returning target weight by segment

### DoD
- [ ] Store Settings definida
- [ ] allocationProfile importada
- [ ] set/target numeric exposure
- [ ] aporte defaults to 0
- [ ] getTarget Weight per segment
