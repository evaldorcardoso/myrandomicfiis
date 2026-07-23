## Tarefa 03: PWA — Service Worker + Manifest

**Localização:** /
**Pré-requisitos:** Tarefa 01
**Prioridade:** Alta

### Objetivo

configurar o aplicativo como PWA (Progressive Web App), com service worker, manifesto e ícones, garantindo que seja instalável e funcione offline parcialmente.

### Passo a passo

1. Instalar vite-plugin-pwa
   ```bash
   npm install -D vite-plugin-pwa
   ```
2. Configurar o plugin na vite.config.ts
3. Criar a configuração do manifesto com nome, short_name, descrição, ícones
4. Gerar os ícones na pasta public/icons/
   - 192x192.png
   - 512x512.png
   - favicon.ico
   - apple-touch-icon.png
5. Definir estratégia de cache:
   - Network first para chamadas de API
   - Cache first para assets estáticos
6. Configurar a página embed offline padrão
   (uma página simples offline informando que o conteúdo não está disponivel)
7. Garantir lazy loading para os ícones web

### Critérios de Pronto (DoD)
- [ ] vite-plugin-pwa instalado e configurado
- [ ] Manifesto com todas as informações obrigatórias
- [ ] todos os ícones criados
- [ ] Service worker funcional caches assets
- [ ] Aplicativo exibe página offline
- [ ] Lighthouse PWA badge
