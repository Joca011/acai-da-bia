import type { ReactNode } from 'react';

interface Card {
  num: string;
  title: string;
  text: string;
  bg: string;
  fg: string;
  accent: string;
  icon: ReactNode;
}

const iconProps = {
  viewBox: '0 0 64 64',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 3,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  className: 'h-16 w-16 sm:h-20 sm:w-20',
};

const cards: Card[] = [
  {
    num: '01',
    title: 'Embalagem que volta',
    text: 'Copos e potes compostáveis. Trouxe o seu próprio pote? Você ganha desconto no açaí.',
    bg: '#6B0F32',
    fg: '#FBF6EA',
    accent: '#F7DEB6',
    icon: (
      <svg {...iconProps}>
        <path d="M14 18h36l-4 36a4 4 0 0 1-4 3H22a4 4 0 0 1-4-3L14 18Z" />
        <path d="M12 18h40M24 10h16l2 8H22l2-8Z" />
        <path d="M24 36c4-5 12-5 16 0M32 31l-3 3m3-3 3 3" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Origem que respeita',
    text: 'Compramos de comunidades ribeirinhas com preço justo, de quem colhe a fruta com carinho.',
    bg: '#8E3B7A',
    fg: '#FBF6EA',
    accent: '#F7DEB6',
    icon: (
      <svg {...iconProps}>
        <path d="M6 44c8-6 14 6 22 0s14 6 22 0 8-2 8-2" />
        <path d="M6 54c8-6 14 6 22 0s14 6 22 0 8-2 8-2" />
        <path d="M32 40V16M32 24c-8 0-12-5-12-11 8 0 12 5 12 11Zm0 6c7 0 11-4 11-10-7 0-11 4-11 10Z" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Nada se perde',
    text: 'O caroço do açaí vira adubo para a horta e artesanato feito por gente da vizinhança.',
    bg: '#F7DEB6',
    fg: '#6B0F32',
    accent: '#6B0F32',
    icon: (
      <svg {...iconProps}>
        <circle cx="32" cy="38" r="15" />
        <path d="M26 33c2-3 6-4 9-3" />
        <path d="M32 23c0-8 5-13 14-14 0 9-5 14-14 14Z" />
        <path d="M32 23c-1-5-5-8-10-8" />
      </svg>
    ),
  },
];

function CardBody({ c }: { c: Card }) {
  return (
    <div className="flex h-full flex-col justify-between gap-8">
      <div className="flex items-start justify-between gap-4">
        <span
          className="font-display text-6xl font-black leading-none"
          style={{ color: c.accent, opacity: 0.95 }}
          aria-hidden="true"
        >
          {c.num}
        </span>
        <span style={{ color: c.accent }}>{c.icon}</span>
      </div>
      <div>
        <h3 className="text-2xl font-black leading-tight sm:text-3xl">{c.title}</h3>
        <p className="mt-3 max-w-md text-base leading-relaxed sm:text-lg">{c.text}</p>
      </div>
    </div>
  );
}

export default function Sustentabilidade() {
  return (
    <section
      id="sustentabilidade"
      aria-labelledby="sust-titulo"
      className="relative overflow-x-clip bg-creme py-20 sm:py-28"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 400 400"
        className="pointer-events-none absolute -right-24 top-10 h-72 w-72 text-pessego sm:h-96 sm:w-96"
      >
        <path
          fill="currentColor"
          d="M312 62c52 38 62 118 34 176s-98 96-164 90S58 276 52 204 106 62 176 48s84-24 136 14Z"
        />
      </svg>
      <div className="container-site relative">
        <div className="max-w-2xl">
          <p className="eyebrow text-oliva-escuro">Sustentabilidade</p>
          <h2 id="sust-titulo" className="section-title mt-3">
            Bom pra você, <span className="text-ameixa">bom pro rio.</span>
          </h2>
          <p className="mt-5 max-w-xl text-lg text-oliva-escuro">
            Cada copo carrega um cuidado a mais. Três jeitos simples de fazer a conta fechar com a natureza.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {cards.map((c) => (
            <li key={c.num} className="card rounded-5xl p-7 shadow-[0_24px_60px_-30px_rgba(46,6,22,0.6)] sm:p-8" style={{ background: c.bg, color: c.fg }}>
              <CardBody c={c} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
