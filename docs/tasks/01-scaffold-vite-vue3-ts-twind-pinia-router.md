## Tarefa 01: Scaffold Vite + Vue 3 + TypeScript + Tailwind + Pinia + Router

**Localização:** /
**Dependências:**
- Nenhuma (é a primeira)

### Objetivo

Inicializar o projeto Vite com Vue 3, TypeScript, Tailwind CSS, Pinia e Vue Router. Configurar a estrutura de diretórios base.

### Passo a passo

1. Criar o Vite projeto:
   ```bash
   npm create vite@latest myrandomicfiis -- --template vue-ts
   cd myrandomicfiis
   ```
2. Remover arquivos default não utilizados.
3. Instalar dependências de produção:
   - `vue-router@4`
   - `pinia`
   - `axios`

4. Instalar dependências de desenvolvimento:
   - `tailwindcss@3` + `postcss` + `autoprefixer` + `@tailwindcss/vite`
5. Configurar `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: { alias: { '@': '/src' } }
})
```
6. Adicionar ao `tsconfig.json`:
   ```json
   "paths": { "@/*": ["./src/*"] }
   ```
7. Configurar `postcss.config.js` (se necessário).
8. Limpar `App.vue` deixando apenas `<router-view />`.
9. Estutura de pastas:
   ```
   src/
   ├─ api/
   ├─ components/
   ├─ config/
   ├─ services/
   ├─ stores/
   ├─ types/
   ├─ utils/
   ├─ views/
   └─ router/
   index.ts
   App.vue
   main.ts
   ```
   Com arquivos `index.ts` vazios ou placeholders.

### Critérios de Pronto (DoD)
- [ ] Projeto inicia sem erros com `npm run dev`
- [ ] TailwindCSS funcionando (testar com classe no App.vue)
- [ ] Vue Router com uma rota placeholder
- [ ] Pinia store dummy
- [ ] Estrutura de pastas completa
- [ ] `npm run build` sem warnings
