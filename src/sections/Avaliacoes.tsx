import { assets } from '../lib/assets';
import LoopVideo from '../components/LoopVideo';
import { useCallback, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useReducedMotion } from '../lib/useReducedMotion';

interface Depoimento {
  nome: string;
  label: string;
  nota: number;
  texto: string;
}

const depoimentos: Depoimento[] = [
  { nome: 'Larissa M.', label: 'cliente desde 2023', nota: 5, texto: 'O açaí mais cremoso que já tomei. Virou ritual de sexta depois do trabalho, com a turma toda.' },
  { nome: 'Carlos E.', label: 'vizinho da Bia Centro', nota: 5, texto: 'Trago meu potinho de casa e ainda ganho desconto. Sabor de infância, sem culpa nenhuma.' },
  { nome: 'Marina T.', label: 'cliente desde 2022', nota: 4.5, texto: 'O de paçoca é perfeito. Só queria que a fila andasse mais rápido no domingo, mas vale a espera.' },
  { nome: 'Rafael S.', label: 'passa sempre na Bia Praia', nota: 5, texto: 'Depois do banho de mar, nada supera um copo gelado olhando o fim de tarde. Atendimento é nota dez.' },
  { nome: 'Beatriz L.', label: 'cliente desde 2024', nota: 4.5, texto: 'Já tenho três cartões de selo completos. Minha filha não aceita outro açaí, vive pedindo o da Bia.' },
];

function Stars({ nota }: { nota: number }) {
  const uid = useId().replace(/:/g, '');
  return (
    <div className="flex items-center gap-1">
      <span className="sr-only">Nota {String(nota).replace('.', ',')} de 5</span>
      <div aria-hidden="true" className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, nota - i));
          const id = `${uid}-${i}`;
          return (
            <svg key={i} viewBox="0 0 24 24" className="h-6 w-6">
              <defs>
                <linearGradient id={id}>
                  <stop offset={`${fill * 100}%`} stopColor="#6B0F32" />
                  <stop offset={`${fill * 100}%`} stopColor="#F7DEB6" />
                </linearGradient>
              </defs>
              <path
                fill={`url(#${id})`}
                stroke="#6B0F32"
                strokeWidth="1.2"
                strokeLinejoin="round"
                d="m12 2.8 2.8 5.9 6.4.9-4.7 4.5 1.2 6.4L12 17.3l-5.7 3.2 1.2-6.4L2.8 9.6l6.4-.9L12 2.8Z"
              />
            </svg>
          );
        })}
      </div>
    </div>
  );
}

export default function Avaliacoes() {
  const reduced = useReducedMotion();
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const startX = useRef<number | null>(null);
  const total = depoimentos.length;

  const go = useCallback(
    (to: number, d?: number) => {
      const next = (to + total) % total;
      setState(([cur]) => [next, d ?? (next >= cur ? 1 : -1)]);
    },
    [total],
  );

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(index + 1, 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(index - 1, -1);
    }
  };

  const onPointerDown = (e: PointerEvent) => {
    startX.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  };

  const d = depoimentos[index];
  const dur = reduced ? 0 : 0.4;

  return (
    <section id="avaliacoes" aria-labelledby="aval-titulo" className="relative overflow-x-clip bg-creme py-20 sm:py-28">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-oliva-escuro">Avaliações</p>
          <h2 id="aval-titulo" className="section-title mt-3">
            Quem prova, <span className="text-ameixa">volta.</span>
          </h2>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-[1.5fr_1fr] sm:gap-6">
          <div data-photo className="aspect-[16/10] overflow-hidden rounded-5xl sm:aspect-auto">
            <img src={assets.pessoas.amigos} alt="Três amigos rindo numa mesa de calçada, cada um com seu bowl de açaí" loading="lazy" decoding="async" className="h-full w-full object-cover" />
          </div>
          <div data-photo className="hidden aspect-[4/5] overflow-hidden rounded-5xl sm:block">
            <LoopVideo src={assets.pessoas.provando.video} poster={assets.pessoas.provando.poster}
              alt="Moça provando uma colherada de açaí e sorrindo de olhos fechados" className="h-full w-full object-cover" />
          </div>
        </div>

        <div
          role="region"
          aria-roledescription="carrossel"
          aria-label="Depoimentos de clientes"
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="mx-auto mt-12 max-w-3xl rounded-5xl"
        >
          <div
            className="relative touch-pan-y select-none"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (startX.current = null)}
          >
            <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute -left-4 -top-6 h-24 w-24 text-pessego sm:-left-8 sm:h-32 sm:w-32">
              <path fill="currentColor" d="M50 6c20 0 40 10 44 30s-6 44-26 54-46 4-58-14S-2 38 14 22 34 6 50 6Z" />
            </svg>
            <AnimatePresence mode="wait" initial={false} custom={dir}>
              <motion.figure
                key={index}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} de ${total}`}
                aria-live="polite"
                custom={dir}
                initial={{ opacity: 0, x: reduced ? 0 : dir * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: reduced ? 0 : dir * -60 }}
                transition={{ duration: dur, ease: 'easeOut' }}
                className="relative rounded-5xl bg-white p-8 shadow-[0_30px_70px_-35px_rgba(107,15,50,0.55)] ring-1 ring-vinho/10 sm:p-12"
              >
                <svg aria-hidden="true" viewBox="0 0 48 36" className="h-10 w-12 text-vinho">
                  <path fill="currentColor" d="M0 36V20C0 8 6 1 18 0v7c-5 1-7 4-7 8h7v21H0Zm27 0V20C27 8 33 1 45 0v7c-5 1-7 4-7 8h7v21H27Z" />
                </svg>
                <blockquote className="mt-5 font-display text-2xl font-semibold leading-snug text-vinho sm:text-3xl">
                  {d.texto}
                </blockquote>
                <figcaption className="mt-8 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-bold text-vinho">{d.nome}</p>
                    <p className="text-sm text-oliva-escuro">{d.label}</p>
                  </div>
                  <Stars nota={d.nota} />
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-between gap-4">
            <button type="button" className="btn-vinho !px-4" aria-label="Depoimento anterior" onClick={() => go(index - 1, -1)}>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 5-7 7 7 7" /></svg>
            </button>
            <div className="flex items-center">
              {depoimentos.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Ir para o depoimento ${i + 1} de ${total}`}
                  aria-current={i === index ? 'true' : undefined}
                  onClick={() => go(i)}
                  className="flex h-11 w-8 items-center justify-center"
                >
                  <span className={`block rounded-full transition-all ${i === index ? 'h-3 w-8 bg-vinho' : 'h-3 w-3 bg-vinho/30'}`} />
                </button>
              ))}
            </div>
            <button type="button" className="btn-vinho !px-4" aria-label="Próximo depoimento" onClick={() => go(index + 1, 1)}>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 5 7 7-7 7" /></svg>
            </button>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-oliva-escuro/80">Depoimentos ilustrativos.</p>
      </div>
    </section>
  );
}
