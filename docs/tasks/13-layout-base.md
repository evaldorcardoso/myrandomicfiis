## 13 - Layout base + Navegação

**Pré-requisitos:** Tareas 01, 12, 10, 11

### Objetivo

Layout responsivo base, com navegação inferior e menu lateral.

### Funcionalidades

- App.vue with navigation (no router-view only)
- NavigationFooter.vue: Home (dashboard), Ranking, Simulador icons
- Sidebar/mobile navigation
- Lazy loading routes

### Como implementar

1. src/router/index.ts
   - / -> Dashboard (lazy)
   - /ranking -> Ranking view (lazy)
   - /simulador -> Simulador view (lazy)
   - constant
2. define navigation bar component
3. App.vue includes NavigationBar + router-view

### DoD
- [ ] router, lazy routing
- Navigation bar functional
- responsive (mobile-first)
- App.vue renders navigation and route
- npm build OK
