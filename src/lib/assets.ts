// Caminhos dos assets otimizados (gerados por `npm run assets` a partir de /raw).
// Tudo fica em /public/assets para ser servido estático.
const base = `${import.meta.env.BASE_URL}assets`;

export const assets = {
  logo: `${base}/logo-bia.svg`,
  logoCreme: `${base}/logo-bia-creme.svg`,
  hero: {
    video: `${base}/hero-loop.mp4`,
    poster: `${base}/hero-poster.webp`,
    bgForest: `${base}/bg-forest.webp`,
    midLayer: `${base}/mid-layer.webp`,
    bowl: `${base}/hero-bowl.webp`,
    splash: `${base}/fg-splash.webp`,
  },
  produtos: {
    classico: `${base}/produtos/classico.webp`,
    morango: `${base}/produtos/morango.webp`,
    chocolateAvela: `${base}/produtos/chocolate-avela.webp`,
    pacoca: `${base}/produtos/pacoca.webp`,
    gourmetTropical: `${base}/produtos/gourmet-tropical.webp`,
    gourmetChocolateOuro: `${base}/produtos/gourmet-chocolate-ouro.webp`,
  },
  origem: `${base}/origem.webp`,
  loja: `${base}/loja.webp`,
  origemVideo: `${base}/origem-video.mp4`,
  origemPoster: `${base}/origem-poster.webp`,
  pessoas: {
    bia: `${base}/pessoas/bia.webp`,
    equipe: `${base}/pessoas/equipe.webp`,
    amigos: `${base}/pessoas/amigos.webp`,
    delivery: { video: `${base}/pessoas/delivery.mp4`, poster: `${base}/pessoas/delivery.webp` },
    atendente: { video: `${base}/pessoas/atendente.mp4`, poster: `${base}/pessoas/atendente.webp` },
    preparo: { video: `${base}/pessoas/preparo.mp4`, poster: `${base}/pessoas/preparo.webp` },
    provando: { video: `${base}/pessoas/provando.mp4`, poster: `${base}/pessoas/provando.webp` },
  },
} as const;
