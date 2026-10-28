# Açaí da Bia

Landing page de portfólio para a marca fictícia **Açaí da Bia**.

> **Projeto de portfólio. Marca e dados fictícios.**

## Stack

- [Vite](https://vite.dev) + React 19 + TypeScript
- Tailwind CSS 3
- GSAP + ScrollTrigger (animações de scroll e parallax)
- Motion (microinterações)
- Lenis (instalado, uso opcional para scroll suave)
- Componentes do [React Bits](https://github.com/DavidHDev/react-bits) (variantes TS + Tailwind) copiados para `src/components/reactbits`. Créditos a David Haz. A licença é MIT + Commons Clause: **verifique a licença do React Bits antes de uso comercial**.
- Fontes: Fraunces (títulos) e DM Sans (texto)

Paleta: vinho `#6B0F32`, vinho escuro `#4A0A22`, ameixa `#8E3B7A`, coral `#E1786E`, pêssego `#F7DEB6`, creme `#FBF6EA`, oliva `#7A7646`.

## Como rodar

```bash
npm i
npm run dev
```

Outros scripts: `npm run build`, `npm run preview`, `npm run lint`.

## Como adicionar os assets reais

Crie a pasta `raw/` na raiz e coloque os arquivos baixados do Google Flow (PNG, JPG, JPEG ou WEBP para imagens; MP4 para vídeos). O nome base é o que importa, a extensão é livre.

| Arquivo em `raw/` | O que é |
| --- | --- |
| `bg-forest` | Fundo bokeh da floresta |
| `mid-layer` | Frutos flutuando, fundo branco (vira transparente) |
| `hero-bowl` | Bowl herói, fundo branco (vira transparente) |
| `fg-splash` | Splash em primeiro plano, fundo branco (vira transparente) |
| `hero-frame` | Frame inicial do vídeo (bowl sobre vinho). Se faltar, usa o frame 0 de `hero-loop.mp4` |
| `hero-loop.mp4` | Vídeo em loop do herói (sem áudio) |
| `classico`, `morango`, `chocolate-avela`, `pacoca`, `gourmet-tropical`, `gourmet-chocolate-ouro` | Fotos dos produtos |
| `origem` | Foto da seção de origem |
| `loja` | Foto da loja |
| `origem-video.mp4` | Vídeo da origem (mantém áudio) |

Depois rode:

```bash
npm run assets
```

O script otimiza tudo para `public/assets/` (WebP redimensionado, vídeos H.264 abaixo de 4 MB com `+faststart`) e remove o fundo branco das camadas com flood fill a partir das bordas, preservando brilhos brancos dentro do sujeito. Arquivos ausentes geram apenas um aviso.

Para o site renderizar sem os arquivos finais, use `npm run assets -- --placeholders`. Placeholders nunca sobrescrevem saídas reais: só são gerados quando não há origem em `raw/` e a saída ainda não existe (ou já é um placeholder, controlado em `public/assets/.placeholders.json`).

## Logo

O logotipo é vetorial (paths, sem dependência de fonte), gerado a partir do Fraunces. Para regenerar:

```bash
npm run logo
```

Gera `public/assets/logo-bia.svg`, `public/assets/logo-bia-creme.svg` (para fundos escuros) e `public/favicon.svg`. Ajustes ficam em `scripts/build-logo.mjs`.

## Acessibilidade

- `prefers-reduced-motion`: desativa parallax, partículas e vídeos (o poster estático é exibido).
- Tokens de cor escolhidos para contraste adequado de texto (creme sobre vinho, vinho sobre creme/pêssego). Revise o contraste de coral e oliva sobre fundos claros antes de usar em texto pequeno.
- Imagens decorativas com `alt=""`; logo com `aria-label`.

## Performance

- Imagens em WebP com largura máxima definida por tipo; vídeos abaixo de 4 MB.
- Posters para os vídeos, evitando layout shift e tela vazia no carregamento.
- Assets em `/assets/*` com cache imutável de 1 ano (`vercel.json`). Ao trocar um arquivo, mude o nome ou aceite o cache antigo.
- Animações usam `transform`/`opacity`; ScrollTrigger e Lenis só rodam quando o usuário não pediu movimento reduzido.

## Deploy na Vercel

Opção 1, via CLI:

```bash
npx vercel
```

Opção 2: importe o repositório do GitHub na Vercel. O `vercel.json` já define o framework (Vite) e os headers de cache. Lembre-se de que `raw/` é só fonte: gere os assets (`npm run assets`) e versione `public/assets/` antes do deploy.
