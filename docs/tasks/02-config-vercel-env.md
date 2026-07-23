## Tarefa 02: Configurar Vercel + Variáveis de Ambiente

**Localização:** /
**Pré-requisitos:** Tarefa 01

### Objetivo

Configurar o deploy na Vercel e as variáveis de ambiente necessárias: NOTION_TOKEN, BOLSAI_API_KEY, NOTION_API_VERSION e FII_DATABASE_ID.

### Passo a passo

1. Criar vercel.json:
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "functions": { "api/*.ts": { "memory": 256 } }
}
```
2. Verificar que api/ é o diretório de Serverless.
3. Criar .env.example:
```
NOTION_TOKEN=your-token
BOLSAI_API_KEY=your-key
NOTION_API_VERSION=2022-06-28
FII_DATABASE_ID=your-database-id
```
4. Garantir .gitignore com .env
5. Adicionar pacote dotenv ao package.json se não existir.
6. Modificar o script npm dev para que o Vite carregue .env.

### Critérios de Pronto (DoD)
- [ ] vercel.json criado
- .env.example criada
- [ ] .gitignore contem .env
- [ ] Build local executa sem erros
- [ ] api/ Serverless functions detectáveis localmente
