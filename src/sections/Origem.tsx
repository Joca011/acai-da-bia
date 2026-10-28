import { useCallback, useEffect, useRef, useState } from 'react';
import { assets } from '../lib/assets';
import { useReducedMotion } from '../lib/useReducedMotion';

const FOCUSABLE =
  'button, [href], input, select, textarea, video[controls], [tabindex]:not([tabindex="-1"])';

export default function Origem() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const playRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const trigger = playRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    if (!reduced) videoRef.current?.play().catch(() => undefined);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !dialogRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !dialogRef.current.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      trigger?.focus();
    };
  }, [open, reduced, close]);

  return (
    <section
      id="origem"
      aria-labelledby="origem-titulo"
      className="relative overflow-hidden bg-vinho-escuro py-20 text-creme sm:py-28"
    >
      <div className="container-site grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <p className="eyebrow text-pessego">Nossa origem</p>
          <h2 id="origem-titulo" className="section-title mt-3 text-creme">
            Do rio até a sua tigela.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-creme">
            O açaí que a gente serve vem de comunidades ribeirinhas da Amazônia, onde as famílias sobem nas palmeiras e colhem o fruto no ponto certo, cacho por cacho.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-pessego">
            Da beira do rio à nossa batedeira é um caminho curto, feito com respeito por quem planta, colhe e cuida da floresta em pé.
          </p>
        </div>

        <div className="lg:col-span-7">
          <div data-photo className="relative aspect-video overflow-hidden rounded-5xl bg-vinho-profundo shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)] ring-1 ring-pessego/20">
            <img
              src={assets.origemPoster}
              alt="Margem de um rio amazônico com palmeiras de açaí e um barco ao entardecer"
              width={1600}
              height={900}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-vinho-profundo/60 to-transparent" />
            <button
              ref={playRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Assistir ao vídeo da origem do açaí"
              aria-haspopup="dialog"
              className="group absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-pessego text-vinho shadow-2xl transition-transform duration-300 hover:scale-110 sm:h-28 sm:w-28"
            >
              {!reduced && (
                <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-pessego/40" />
              )}
              <svg aria-hidden="true" viewBox="0 0 24 24" className="relative h-10 w-10 translate-x-0.5 fill-current">
                <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-vinho-profundo/90 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="origem-video-titulo"
            className="relative w-full max-w-4xl rounded-4xl bg-vinho-escuro p-3 shadow-2xl ring-1 ring-pessego/30 sm:p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-4 px-2">
              <h3 id="origem-video-titulo" className="font-display text-xl font-black text-creme">
                A origem do nosso açaí
              </h3>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Fechar vídeo"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pessego text-vinho transition-colors hover:bg-white"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <video
              ref={videoRef}
              controls
              playsInline
              preload="metadata"
              poster={assets.origemPoster}
              src={assets.origemVideo}
              autoPlay={!reduced}
              className="aspect-video w-full rounded-3xl bg-black"
            >
              Seu navegador não suporta vídeo.
            </video>
          </div>
        </div>
      )}
    </section>
  );
}
