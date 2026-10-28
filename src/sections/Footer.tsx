import { assets } from '../lib/assets';

const links = [
  ['#sobre', 'Sobre'],
  ['#cardapio', 'Cardápio'],
  ['#fidelidade', 'Fidelidade'],
  ['#lojas', 'Lojas'],
  ['#franquia', 'Franquia'],
] as const;

const ico = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true, className: 'h-6 w-6' };

const socials = [
  {
    label: 'Instagram',
    svg: (
      <svg {...ico}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    svg: (
      <svg {...ico}>
        <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
        <path d="M14 3c.4 2.6 2 4.2 5 4.5" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    svg: (
      <svg {...ico}>
        <path d="M4 20l1.3-4.2A8 8 0 1 1 8.4 18.8L4 20Z" />
        <path d="M9 9c.3 2.5 2.5 4.7 6 6l1-1.5-2-1-1 .6c-.8-.4-1.600-1.200-2-2l.6-1-1-2L9 9Z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-vinho-profundo pb-28 pt-16 sm:pb-12 text-creme">
      <div className="container-site">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_auto] md:items-start">
          <div>
            <img src={assets.logoCreme} alt="Açaí da Bia" width={160} height={64} loading="lazy" decoding="async" className="h-14 w-auto" />
            <p className="mt-4 max-w-xs font-display text-xl text-pessego">Açaí de bairro, feito com carinho.</p>
          </div>
          <nav aria-label="Rodapé">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
              {links.map(([href, t]) => (
                <li key={href}>
                  <a href={href} className="inline-flex min-h-[44px] items-center font-bold text-creme underline-offset-4 hover:text-pessego hover:underline">
                    {t}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <ul className="flex gap-3">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href="#"
                  aria-label={s.label}
                  onClick={(e) => e.preventDefault()}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-vinho text-pessego transition-colors hover:bg-pessego hover:text-vinho"
                >
                  {s.svg}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-pessego/25 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-creme">© 2026 Açaí da Bia</p>
          <p className="inline-block rounded-full bg-pessego px-4 py-2 font-bold text-vinho">Feito com carinho em Natal/RN.</p>
        </div>
      </div>
    </footer>
  );
}
