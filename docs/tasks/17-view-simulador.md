## 17 - View Simulador

**Pré-requisitos:** Tarefas 09, 12, 16

### Objetivo

Tela onde o usuário informa valor do aporte e vê sugestão de compra.

### Funcionalidades

- Input de valor (R$)
- Exibe recomendação de compra: ticker, quantidade de cotas, valor total
- Saldo residual
- Top 5 alternativas
- Botão de confirmar (futuro)

### Implementação

1. src/views/SimulatorView.vue
2. Input com máscara monetária (R$ 0,00)
3. Chama simulateAporte do recommendation service
4. Exibe resultado:
   - Comprar X cotas de TICKER
   - Valor utilizado R$ X.XXX,XX
   - Saldo R$ XX,XX
5. Lista top 5 alternativas abaixo
6. Responsivo e mobile-first

### DoD
- [ ] SimulatorView.vue criado
- [ ] Input de aporte funcional
- [ ] Simulação exibe resultado
- [ ] Saldo residual calculado
- [ ] Top 5 alternativas
- [ ] Máscara monetária
- [ ] Responsivo
