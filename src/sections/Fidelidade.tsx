import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { useReducedMotion } from '../lib/useReducedMotion';

const TOTAL = 10;
const DEMO = 7;

function Berry({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="h-full w-full">
      <circle cx="32" cy="36" r="22" fill={filled ? '#6B0F32' : 'none'} stroke="#6B0F32" strokeWidth="2.5" strokeDasharray={filled ? undefined : '4 5'} />
      {filled && (
        <>
          <ellipse cx="24" cy="28" rx="6" ry="4" fill="#8E3B7A" transform="rotate(-30 24 28)" />
          <path d="M32 14c1-6 6-9 12-9-1 6-5 9-12 9Z" fill="#7A7646" />
          <path d="M32 14c-1-4-4-6-8-6 1 4 4 6 8 6Z" fill="#4F4C2C" />
        </>
      )}
    </svg>
  );
}

export default function Fidelidade() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [count, setCount] = useState(reduced ? DEMO : 0);
  const [interacted, setInteracted] = useState(false);

  useEffect(() => {
    if (reduced) {
      if (!interacted) setCount(DEMO);
      return;
    }
    if (!inView || interacted) return;
    let n = 0;
    const t = window.setInterval(() => {
      n += 1;
      setCount(n);
      if (n >= DEMO) window.clearInterval(t);
    }, 260);
    return () => window.clearInterval(t);
  }, [inView, reduced, interacted]);

  const faltam = TOTAL - count;
  const done = count >= TOTAL;

  return (
    <section id="fidelidade" aria-labelledby="fid-titulo" className="relative overflow-x-clip bg-creme py-20 sm:py-28">
      <div className="container-site grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow text-oliva-escuro">Fidelidade</p>
          <h2 id="fid-titulo" className="section-title mt-3">
            Junte 10 selos, ganhe <span className="text-ameixa">um açaí.</span>
          </h2>
          <p className="mt-5 max-w-md text-lg text-oliva-escuro">
            A cada copo, um carimbo no cartão. Juntou dez? O próximo é por nossa conta.
          </p>
        </div>

        <div ref={ref} className="relative rotate-0 lg:-rotate-2">
          <div className="relative rounded-5xl bg-pessego p-6 text-vinho shadow-[0_30px_70px_-30px_rgba(107,15,50,0.6)] sm:p-10">
            {/* furos de cartão perfurado */}
            <span aria-hidden="true" className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-creme" />
            <span aria-hidden="true" className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-creme" />
            <div className="flex items-center justify-between gap-4 border-b-2 border-dashed border-vinho/40 pb-4">
              <p className="font-display text-2xl font-black sm:text-3xl">Cartão Bia</p>
              <p className="text-sm font-bold uppercase tracking-widest">
                {Math.min(count, TOTAL)}/{TOTAL} selos
              </p>
            </div>

            <ul className="mt-6 grid grid-cols-5 gap-3 sm:gap-4">
              {Array.from({ length: TOTAL }, (_, i) => {
                const filled = i < count;
                return (
                  <li key={i} className="aspect-square rounded-full bg-creme p-1.5 sm:p-2">
                    <motion.div
                      className="h-full w-full"
                      initial={false}
                      animate={filled ? { scale: 1, rotate: 0 } : { scale: 0.92, rotate: 0 }}
                      transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 14 }}
                      key={filled ? 'on' : 'off'}
                      {...(!reduced && filled ? { initial: { scale: 0.2, rotate: -40 } } : {})}
                    >
                      <Berry filled={filled} />
                    </motion.div>
                    <span className="sr-only">{filled ? `Selo ${i + 1} carimbado` : `Selo ${i + 1} vazio`}</span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-lg font-bold" aria-live="polite">
                {done ? 'Parabéns! Seu açaí é por nossa conta. 🎉' : `Faltam ${faltam} pra você ganhar um açaí`}
              </p>
              {done ? (
                <button
                  type="button"
                  className="btn-vinho"
                  onClick={() => {
                    setInteracted(true);
                    setCount(0);
                  }}
                >
                  Recomeçar
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-vinho"
                  onClick={() => {
                    setInteracted(true);
                    setCount((c) => Math.min(TOTAL, c + 1));
                  }}
                >
                  Carimbar mais um
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
