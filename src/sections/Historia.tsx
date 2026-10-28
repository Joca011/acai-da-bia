import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ScrollReveal from '../components/reactbits/ScrollReveal';
import { assets } from '../lib/assets';
import { useReducedMotion } from '../lib/useReducedMotion';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Historia() {
  const reduced = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      if (reduced || !frameRef.current || !imgRef.current) return;
      gsap.fromTo(
        imgRef.current,
        { yPercent: -12 },
        {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: frameRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    },
    { dependencies: [reduced], scope: frameRef },
  );

  return (
    <section id="sobre" aria-labelledby="historia-titulo" className="relative overflow-hidden bg-creme py-20 sm:py-28">
      {/* formas orgânicas decorativas */}
      <svg aria-hidden="true" viewBox="0 0 200 200" className="absolute -left-16 top-10 h-48 w-48 text-pessego">
        <path fill="currentColor" d="M45 20c40-25 100-10 120 30s5 90-35 115-95 20-115-25S5 45 45 20Z" />
      </svg>

      <div className="container-site relative grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <p className="eyebrow text-oliva-escuro">Nossa história</p>
          <h2 id="historia-titulo" className="section-title mt-3 text-vinho">
            Tudo começou numa esquina.
          </h2>

          <div className="mt-8">
            <ScrollReveal
              baseRotation={0}
              enableBlur={false}
              baseOpacity={0.2}
              containerClassName="!my-0"
              textClassName="!font-display !text-[clamp(1.4rem,3.2vw,2.25rem)] !font-bold !leading-snug text-vinho"
            >
              Bia começou vendendo açaí na esquina da rua onde cresceu, com a receita da família e um freezer emprestado. Até hoje é açaí batido na hora, sem pressa e sem atalho.
            </ScrollReveal>
          </div>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-oliva-escuro">
            A fila foi crescendo, os vizinhos viraram clientes e a esquina virou ponto de encontro. A gente só mudou o endereço do sorriso: o resto continua do jeitinho que a Bia aprendeu com a avó.
          </p>

          <p className="mt-8 inline-flex items-center gap-3 rounded-full bg-pessego px-5 py-3 font-bold text-vinho">
            <span aria-hidden="true" className="h-3 w-3 rounded-full bg-coral" />
            Receita de família desde sempre
          </p>
        </div>

        <div className="relative lg:col-span-5">
          <span aria-hidden="true" className="absolute -right-4 -top-6 z-10 h-20 w-20 rounded-full bg-coral sm:h-24 sm:w-24" />
          <span aria-hidden="true" className="absolute -bottom-6 -left-5 z-10 h-16 w-28 rounded-full bg-ameixa" />
          <div
            ref={frameRef}
            className="relative aspect-[4/5] overflow-hidden rounded-5xl bg-pessego shadow-[0_30px_80px_-30px_rgba(107,15,50,0.55)]"
          >
            <img
              ref={imgRef}
              src={assets.pessoas.bia}
              alt="A Bia sorrindo atrás do balcão de madeira, com um bowl de açaí à frente"
              width={1200}
              height={1500}
              loading="lazy"
              decoding="async"
              className="absolute left-0 top-[-20%] h-[140%] w-full max-w-none object-cover will-change-transform"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
