# AGENTS.md - My Randomic Fiis (Índice Global)

## Manutenção do AGENTS.md

Sempre que implementar uma nova funcionalidade, alterar fluxos existentes ou mudar algo importante no projeto, atualize o AGENTS.md mais próximo do arquivo alterado. Mantenha cada AGENTS.md como fonte de verdade para o seu domínio.

Se uma nova seção grande fizer sentido como um AGENTS.md próprio em um diretório, crie-o. Atualize este índice para referenciá-lo.

## Build & Test Verification

Always run `npm run build` and `npx vitest run` after finishing each implementation.

## Commit Instructions

When asked to commit: (1) run `git add` with all modified/untracked files (check `git status` first), (2) generate a short conventional-commits message (max 1 line, ~50 chars), (3) run `git commit -m "<message>"`. Never commit `.env` files or secrets.

## Convenções de Código

- Componentes: **PascalCase** (MyComponent.vue)
- Arquivos utilitários: **camelCase** (imageUtils.ts)
- Types/Interfaces: **PascalCase** (PersonaGame)
- Enums: **PascalCase** com valores **PascalCase**
- CSS: Classes Tailwind (kebab-case)
- **NUNCA commitar** `.env` ou credenciais
- **NUNCA usar else**
- Usar **TypeScript** para tudo (sem `any` desnecessário)
- Preferir **Composition API** do Vue 3
- Testar em **mobile-first** (responsivo)
- Respeitar estilo de código existente

## Color System

https://coolors.co/palette/0d1b2a-1b263b-415a77-778da9-e0e1dd
Deep Sea
Midnight navy, foggy teal, and arctic white channel oceanic depths and serene power for mystery.

Colors
~Ink Black
#0d1b2a
Ultra-dark with a hint of blue, reminiscent of deep inkwells and infinite space, sparks drama and imagination in design.
~Prussian Blue
#1b263b
Inky, profound blue filled with gravitas and mystery, conjures historical intrigue and academic tradition.
~Dusk Blue
#415a77
Elegant blend of twilight blues, reminiscent of clear evening skies fading into the calm promise of nightfall.
~Lavender Grey
#778da9
Muted, elegant blend of purple and grey, gently infusing subtle sophistication and creative intrigue.
~Alabaster Grey
#e0e1dd
Pale, misty grey that whispers of modern elegance and refined calm, imparting balance and understated chic.

## Flat Style Design System

Global style flattening applied across all components.
Border-radius Reduction
Shadow Reduction

## Stack Tecnológica

- **Vue 3** (Composition API) | **TypeScript** | **Vite** | **Tailwind CSS** | **Axios** | **Vercel**
