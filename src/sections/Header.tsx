import { useEffect, useRef, useState } from 'react';
import { assets } from '../lib/assets';

const links = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#cardapio', label: 'Cardápio' },
  { href: '#fidelidade', label: 'Fidelidade' },
  { href: '#lojas', label: 'Lojas' },
  { href: '#franquia', label: 'Franquia' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fecha o menu mobile com Esc e devolve o foco ao botão.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const solid = scrolled || open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,padding] duration-300 ${
          solid
            ? 'bg-vinho-profundo/95 py-2 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)] backdrop-blur-md'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="container-site flex items-center justify-between gap-4">
          <a href="#topo" className="shrink-0 rounded-lg" aria-label="Açaí da Bia — voltar ao início">
            <img
              src={assets.logoCreme}
              alt=""
              width={132}
              height={60}
              className={`w-auto transition-[height] duration-300 ${solid ? 'h-10' : 'h-12 sm:h-14'}`}
            />
          </a>

          <nav aria-label="Principal" className="hidden md:block">
            <ul className="flex items-center gap-1 lg:gap-2">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="rounded-full px-4 py-2 text-sm font-bold text-creme transition-colors hover:bg-creme/10 hover:text-pessego"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-creme/10 text-creme md:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h10" />
              )}
            </svg>
          </button>
        </div>

        <nav
          id="menu-mobile"
          aria-label="Principal (mobile)"
          hidden={!open}
          className="container-site pb-6 pt-2 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 font-display text-2xl font-bold text-creme hover:bg-creme/10"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Botão flutuante */}
      <a
        href="#franquia"
        className="fixed bottom-4 right-4 z-40 inline-flex min-h-[52px] items-center gap-2 rounded-full bg-pessego px-5 font-bold text-vinho shadow-[0_18px_40px_-12px_rgba(46,6,22,0.65)] ring-2 ring-vinho/10 transition-transform hover:-translate-y-0.5 sm:bottom-6 sm:right-6"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
          <circle cx="12" cy="13" r="7" />
          <path d="M12 6c1-2.6 3.3-3.8 5.6-3.6-.6 2.4-2.6 3.9-5.6 3.6z" />
        </svg>
        Seja franqueado
      </a>
    </>
  );
}
