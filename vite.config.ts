import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// Pré-carrega as fontes principais (latin) para o texto do hero não esperar o CSS.
function preloadFonts(): Plugin {
  return {
    name: 'preload-fonts',
    apply: 'build',
    transformIndexHtml(html, ctx) {
      const files = Object.keys(ctx.bundle ?? {}).filter((f) => /(fraunces-latin-full|dm-sans-latin-opsz)-normal.*\.woff2$/.test(f))
      const base = ctx.server ? '/' : (globalThis as { __viteBase?: string }).__viteBase ?? '/'
      return {
        html,
        tags: files.map((f) => ({
          tag: 'link',
          attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: base + f, crossorigin: '' },
          injectTo: 'head-prepend' as const,
        })),
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), preloadFonts()],
  build: {
    rollupOptions: {
      output: {
        // Bibliotecas separadas: o navegador guarda em cache e baixa em paralelo.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react'
          if (id.includes('/gsap/') || id.includes('@gsap')) return 'gsap'
        },
      },
    },
  },
})
