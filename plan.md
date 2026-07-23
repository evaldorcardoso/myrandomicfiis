# MyRandomicFiis

## Objetivo

Desenvolver uma aplicação em Vue 3 hospedada na Vercel para recomendar qual Fundo Imobiliário comprar no próximo aporte.

O aplicativo não possui backend.

Toda a persistência fica em databases do Notion.

O usuário apenas abre o aplicativo e visualiza as recomendações.

---

# Stack

- Vue 3
- Vite
- TypeScript
- Pinia
- Vue Router
- TailwindCSS
- ApexCharts
- Notion API
- API pública de cotações (Brapi ou equivalente)
- Deploy na Vercel

---

# Arquitetura

```

Vue App

↓

Notion API
(Database)

↓

API de Mercado Bolsai (https://usebolsai.com/docs)
(Cotação + PVP + DY + Liquidez + Setor)

↓

Motor de recomendação

↓

Dashboard

```

---

# Databases do Notion - Posição da carteira

## FIIs

Consultar um database Notion (Utilizando a api) para obter os dados da minha carteira e fundos seguidos.

Campos

- Fundo
- Qtd
- Total
- Percentual
- Total Fiis
- Menor preço

Exemplo

|Fundo|Qtd|...
|-------|----|
|HGLG11|15|
|KNRI11|10|
|MXRF11|8|

---

# Rebalanceamento

O usuário poderá definir o perfil:

Exemplo perfil conservador:

```
Logística               15%
Papel                   30%
Shopping                15%
Lajes                   15%
Varejo/renda urbana     15%
Misto                   10%
```

---

# Sugestão de compra (quando não informado aporte)

Tela principal.

Gerar um ranking.

Exemplo

| Fundo | Score |
|--------|------|
| HGLG11 | 94 |
| KNRI11 | 91 |
| XPLG11 | 82 |

---

# Fluxo

Ao abrir o aplicativo:

1 - Obter os fundos seguidos do Notion
2 - Atualizar automaticamente:

- preço
- P/VP
- DY
- setor

Salvar cache local.

Caso a API esteja indisponível utilizar os últimos dados.

3 - Usuário informa o Valor do aporte (opcional).
4 - Aplicativo deve calcular quais os fundos e quais quantidades indicados para aporte hoje ou mostrar a sugestão de compra ranqueada.

---

# Dados obtidos da API (Bolsai)

Para cada FII obter:

- preço atual
- P/VP
- Dividend Yield
- liquidez diária
- setor
- patrimônio
- último dividendo

# Bolsai API

Exemplo de requisição para obter os dados atualizados do fundo:
curl -H "X-API-Key: sua_chave" \
  https://api.usebolsai.com/api/v1/fiis/HGLG11

Resposta
{
  "ticker": "HGLG11",
  "name": "CSHG LOGISTICA FDO INV IMOB - FII",
  "reference_date": "2026-02-28",
  "close_price": 162.45,
  "book_value_per_share": 148.32,
  "pvp": 1.10,
  "dividend_yield_ttm": 8.74,
  "net_asset_value": 4523000000.0,
  "shares_outstanding": 30498200,
  "total_shareholders": 487523,
  "segment": "Logistica",
  "management_type": "Gestao Ativa",
  "administrator": "CREDIT SUISSE HEDGING-GRIFFO CV S.A.",
  "administrator_cnpj": "61809182000130",
  "mandate": "Renda",
  "inception_date": "2010-06-01",
  "duration_type": "Indeterminado",
  "target_investors": "INVESTIDORES EM GERAL",
  "website": "www.cshg.com.br",
  "email": "investidores@cshg.com.br",
  "fund_type": "Tijolo",
  "asset_composition": {
    ...
  },
  "fees_paid_last_month": {
    ...
  },
  "property_count": 28,
  "total_area_sqm": 1595382.91,
  "vacancy_pct": 2.91,
  "delinquency_pct": 0.0,
  "leased_pct": 97.09,
  "top_properties": [],
  "property_reference_date": "2024-12-31"
}

---

# Dashboard

Mostrar

- patrimônio investido
- patrimônio atual
- lucro/prejuízo
- dividend yield médio
- P/VP médio
- quantidade de FIIs
- total investido

---

# Recomendação

Gerar um ranking.

Exemplo

|Posição|Ticker|Score|
|-------|------|-----|
|1|HGLG11|95|
|2|KNRI11|92|
|3|XPLG11|88|

---

# Algoritmo

## 40%

Diferença entre peso atual e peso alvo.

Quanto mais abaixo da meta, maior a nota.

---

## 30%

P/VP.

Quanto menor, melhor.

Normalizar entre:

0.70 e 1.20.

---

## 15%

Dividend Yield.

Maior DY recebe maior nota.

---

## 10%

Diversificação.

Premiar setores pouco representados.

---

## 5%

Liquidez.

Evitar fundos pouco negociados.

---

Score

```
Score =
0.40 * rebalanceamento +
0.30 * PVP +
0.15 * DY +
0.10 * diversificação +
0.05 * liquidez
```

---

# Simulador

Informar

Valor do aporte.

Exemplo

```
R$ 1.500
```

Resultado

```
Comprar

12 cotas de HGLG11

Valor utilizado

R$ 1.458

Saldo

R$ 42
```

Também mostrar

Top 5 alternativas.

---

# Cache

Utilizar cache em memória/localStorage durante a sessão para evitar chamadas repetidas às APIs.

As consultas ao Notion devem ocorrer apenas no carregamento inicial e quando o usuário solicitar atualização manual.

---

# Estrutura do projeto sugerida

```
src/

api/
    ...

services/
    portfolio.ts
    recommendation.ts

stores/
    portfolio.ts
    market.ts
    settings.ts

views/

components/

types/

utils/
```

---

# Configurar as variáveis de ambiente:**
   ```bash
   # Obter em: https://www.notion.so/profile/integrations
   VITE_NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

---

# Objetivo final

O aplicativo deve responder diariamente:

> "Se eu fosse investir hoje, em qual FII devo aportar para manter minha estratégia de longo prazo?"

---

# Requisitos

Código totalmente em TypeScript.

Componentes reutilizáveis.

Sem dependência de backend.

Interface responsiva.

PWA obrigatório.

Lazy Loading nas rotas.

---