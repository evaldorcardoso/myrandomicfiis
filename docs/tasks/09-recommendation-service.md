## 09 - Recommendation Service

**Pré-requisitos:** Tarefas 06, 07, 08, 21

### Objetivo

Implementar o motor de recomendação. Score = 0.40 * rebalanceamento + 0.30 * PVP + 0.15 * DY + 0.10 * diversificação + 0.05 * liquidez

### Funcionalidades

- calculateScore(fii, portfolio, targetAllocation) -> number (0-100)
- rankRecommendations(fiis, targetAllocation) -> ranked Fiis
- simulateAporte(total, aporte, recomendados) -> best allocation

### Algoritmo

- Rebalance (40%): diff between current% and target% for the segment
- PVP (30%): Normalizado entre 0.70 e 1.20. Quanto menor melhor.
- DY (15%): Quanto maior melhor
- Diversificação (10%): Premiar setores subrepresentados
- Liquidez (5%): Evitar fundos com pouca liquidez

### Simulador

- Recebe aporte, lista de FIIs ranqueados
- Comprar o máximo do top 1
- se sobra dinheiro, ir para o próximo (top 2)
- Saldo residual fica como sobra

### DoD
- [ ] calculateScore implementado
- [ ] rankRecommendations retorna lista ranqueada
- [ ] simulateAporte funcional
- [ ] lida com divisão zero
- [ ] cobertura de testes
