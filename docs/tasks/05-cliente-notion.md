## 05 - Cliente Notion

**Pré-requisitos:** Tarefa 02

### Objetivo

Criar funções TS que encapsulam a comunicaçao com as Vercel functions (api/notion-porxy).

### Funcionalidades

- queryDatabase(databaseId, filter, sorts): retorna os dados formatados da pesquisa Notion
- fetchPage(pageId): retorna uma página de Notion
- extractFiiList(NotionResponse response): extrai array de FIIs das properties Notion

### Como implementar

1. src/api/notion.ts
2. onSubmit função postToNotion(endpoint, body) reutilizável
3. extractFiiList converte Notion Page -> FiiHolding type
4. Mapear properties do Notion: Nome -> string, Qnt -> number, Preço -> number, Categoria -> string

### DoD
- [ ] src/api/notion.ts criado
- [ ] queryDatabase funcionando com proxy
- [ ] extractFiiList funcional
- [ ] tratativa de erros e timeout
- [ ] fallback para cache
