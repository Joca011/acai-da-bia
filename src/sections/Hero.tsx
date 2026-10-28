import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitText from '../components/reactbits/SplitText';
import BlurText from '../components/reactbits/BlurText';
import ShinyText from '../components/reactbits/ShinyText';
import Magnet from '../components/reactbits/Magnet';
import RotatingText from '../components/reactbits/RotatingText';
import CircularText from '../components/reactbits/CircularText';
import { assets } from '../lib/assets';
import { useReducedMotion } from '../lib/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const H = `${import.meta.env.BASE_URL}assets/hero/`;
const TITLE = 'O açaí mais vivo do Brasil';
const SUBTITLE = 'Batido na hora, cremoso de verdade e com a cara do bairro. Do jeitinho da Bia.';

type Piece = { src: string; x: number; y: number; w: number; rot: number; depth: number; flip?: boolean; front: boolean };

// Posições em % do palco quadrado. depth > 1 = mais perto da câmera.
const PIECES: Piece[] = [
  { src: 's4', x: 14, y: 16, w: 15, rot: -20, depth: 0.35, front: false },
  { src: 's5', x: 86, y: 14, w: 14, rot: 30, depth: 0.4, front: false },
  { src: 's2', x: 92, y: 58, w: 14, rot: 15, depth: 0.45, front: false },
  { src: 's3', x: 12, y: 44, w: 15, rot: -25, depth: 1.0, front: true },
  { src: 's4', x: 72, y: 6, w: 13, rot: 40, depth: 1.1, flip: true, front: true },
  { src: 's0', x: 10, y: 78, w: 27, rot: 10, depth: 1.3, front: true },
  { src: 's5', x: 34, y: 96, w: 14, rot: -60, depth: 1.4, flip: true, front: true },
  { src: 's1', x: 88, y: 86, w: 25, rot: -8, depth: 1.5, front: true },
  { src: 's2', x: 64, y: 100, w: 12, rot: 70, depth: 1.65, front: true },
];

export default function Hero() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || reduced) return;
      const q = gsap.utils.selector(section);
      const desktop = window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches;
      const layers = q<HTMLElement>('[data-layer]');
      layers.forEach((el) => gsap.set(el, { xPercent: -50, yPercent: -50 }));

      // Entrada: bowl gira e cresce, frutas saem de trás dele.
      const intro = gsap.timeline({ delay: 0.15 });
      intro
        .from(q('[data-bowl] img'), { scale: 0.55, rotation: -120, autoAlpha: 0, duration: 1.6, ease: 'expo.out' })
        .from(q('[data-splash] img'), { scale: 0.3, autoAlpha: 0, duration: 1.4, ease: 'expo.out' }, 0.1)
        .from(q('[data-piece] img'), {
          x: (_i, el) => (50 - Number((el as HTMLElement).dataset.x)) * 6,
          y: (_i, el) => (50 - Number((el as HTMLElement).dataset.y)) * 6,
          scale: 0.2, autoAlpha: 0, rotation: -90, duration: 1.4, ease: 'expo.out', stagger: 0.06,
        }, 0.25);

      // Flutuação contínua (cada peça no seu ritmo) e bowl girando devagar.
      if (desktop) q<HTMLElement>('[data-piece] img').forEach((img, i) => {
        gsap.to(img, { y: `+=${10 + (i % 4) * 5}`, rotation: `+=${i % 2 ? 8 : -8}`, duration: 2.6 + (i % 5) * 0.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.6 });
      });
      gsap.to(q('[data-bowl-spin]'), { rotation: 360, duration: 90, ease: 'none', repeat: -1 });

      // Rolagem: hero fixo enquanto a cena "explode" em profundidade.
      const tl = gsap.timeline({
        scrollTrigger: desktop
          ? { trigger: section, start: 'top top', end: '+=100%', scrub: 0.8, pin: true, anticipatePin: 1 }
          : { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
      });
      const stage = q<HTMLElement>('[data-stage]')[0];
      const S = () => stage.offsetWidth;
      q<HTMLElement>('[data-piece]').forEach((el) => {
        const d = Number(el.dataset.depth), dx = (Number(el.dataset.x) - 50) / 50, dy = (Number(el.dataset.y) - 50) / 50;
        tl.to(el, { x: () => dx * S() * 0.55 * d, y: () => dy * S() * 0.55 * d, scale: 1 + 0.45 * d, rotation: Number(el.dataset.rot) * 2.5, ease: 'none' }, 0);
      });
      tl.to(q('[data-bowl]'), { scale: 1.35, rotation: 35, y: () => S() * 0.08, ease: 'none' }, 0)
        .to(q('[data-splash]'), { scale: 1.9, rotation: -30, autoAlpha: 0, ease: 'none' }, 0)
                .to(q('[data-hero-content]'), { y: -120, autoAlpha: 0, ease: 'none' }, 0)
        .to(q('[data-stage]'), { xPercent: desktop ? -28 : 0, ease: 'none' }, 0);

      // Mouse / giroscópio: cada camada desloca proporcional à profundidade.
      const movers = q<HTMLElement>('[data-mouse]').map((el) => ({
        d: Number(el.dataset.mouse),
        x: gsap.quickTo(el, 'x', { duration: 1, ease: 'power3.out' }),
        y: gsap.quickTo(el, 'y', { duration: 1, ease: 'power3.out' }),
      }));
      const apply = (nx: number, ny: number) => movers.forEach((m) => { m.x(-nx * 40 * m.d); m.y(-ny * 40 * m.d); });
      const cleanups: Array<() => void> = [];
      if (!window.matchMedia('(pointer: coarse)').matches) {
        const onMove = (e: PointerEvent) => apply((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
        window.addEventListener('pointermove', onMove);
        cleanups.push(() => window.removeEventListener('pointermove', onMove));
      } else {
        const onOrient = (e: DeviceOrientationEvent) => {
          if (e.gamma == null || e.beta == null) return;
          apply(gsap.utils.clamp(-1, 1, e.gamma / 25), gsap.utils.clamp(-1, 1, (e.beta - 45) / 25));
        };
        window.addEventListener('deviceorientation', onOrient);
        cleanups.push(() => window.removeEventListener('deviceorientation', onOrient));
      }
      return () => cleanups.forEach((f) => f());
    },
    { scope: sectionRef, dependencies: [reduced], revertOnUpdate: true },
  );

  const piece = (p: Piece, i: number) => (
    <div key={i} data-layer data-piece data-depth={p.depth} data-x={p.x} data-y={p.y} data-rot={p.rot}
      className={`absolute will-change-transform ${p.front ? '' : 'hidden lg:block'}`} style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%`, zIndex: p.front ? 30 : 5, opacity: p.front ? 1 : 0.6 }}>
      <div data-mouse={p.depth}>
        <img src={`${H}${p.src}.webp`} alt="" draggable={false} data-x={p.x} data-y={p.y}
          className="block h-auto w-full select-none" loading="eager" decoding="async"
          style={{ transform: `rotate(${p.rot}deg)${p.flip ? ' scaleX(-1)' : ''}` }} />
      </div>
    </div>
  );

  return (
    <section
      id="topo"
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="relative isolate flex h-[100svh] min-h-[640px] flex-col justify-start overflow-hidden bg-vinho-profundo pt-28 text-creme sm:pt-32 lg:justify-center lg:pt-0"
    >
      {/* Fundo: bokeh + degradê */}
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        <div data-bg className="absolute inset-0" data-mouse-wrap>
          <div data-mouse="0.15" className="absolute -inset-[4%]">
            <img src={assets.hero.bgForest} alt="" className="h-full w-full object-cover opacity-60" />
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_72%_50%,rgba(142,59,122,0.45)_0%,rgba(74,10,34,0.85)_55%,rgba(46,6,22,0.98)_100%)]" />
      </div>


      {/* Palco da cena */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div data-stage
          className="absolute bottom-[-14%] left-1/2 aspect-square w-[118vw] max-w-[640px] -translate-x-1/2 sm:bottom-[-18%] lg:bottom-auto lg:left-auto lg:right-[-3%] lg:top-1/2 lg:w-[50vw] lg:max-w-[780px] lg:-translate-y-1/2 lg:translate-x-0">
          <div className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(225,120,110,0.35),transparent_65%)] blur-2xl" />
          <div data-layer data-splash className="absolute will-change-transform" style={{ left: '50%', top: '50%', width: '135%', zIndex: 1 }}>
            <div data-mouse="0.5"><img src={assets.hero.splash} alt="" className="block w-full -rotate-12 opacity-95" /></div>
          </div>
          {PIECES.filter((p) => !p.front).map(piece)}
          <div data-layer data-bowl className="absolute will-change-transform" style={{ left: '50%', top: '52%', width: '64%', zIndex: 20 }}>
            <div data-mouse="0.7">
              <img data-bowl-spin src={`${H}bowl.webp`} srcSet={`${H}bowl-640.webp 640w, ${H}bowl.webp 1100w`} sizes="(min-width: 1024px) 32vw, 76vw" alt="" fetchPriority="high" decoding="async"
                className="block w-full rounded-full shadow-[0_50px_80px_-20px_rgba(10,0,5,0.8)]" />
            </div>
          </div>
          {PIECES.map((p, i) => (p.front ? piece(p, i) : null))}
          {!reduced && (
            <div className="absolute right-[8%] top-[2%] z-40 hidden sm:block">
              <CircularText text="BATIDO NA HORA ✦ AÇAÍ DA BIA ✦ " size={150} fontSize={15} fontWeight={800} letterSpacing={3}
                color="#F7DEB6" spinDuration={18}>
                <span className="grid h-14 w-14 place-items-center rounded-full bg-coral text-vinho"><svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="11" cy="14" r="6.5" /><path d="M12 7.5c1.2-3 3.8-4.4 6.4-4.1-.7 2.7-3 4.4-6.4 4.1z" /></svg></span>
              </CircularText>
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div data-hero-content className="container-site relative">
        <div className="max-w-xl lg:max-w-2xl">
          <p className="eyebrow mb-5 inline-flex items-center gap-2 rounded-full bg-creme/10 px-4 py-2 text-pessego ring-1 ring-pessego/30 backdrop-blur-sm">
            <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-coral" />
            Açaí batido na hora
          </p>

          {reduced ? (
            <h1 id="hero-title" className="text-5xl font-black leading-[0.95] sm:text-7xl lg:text-8xl">
              {TITLE}
            </h1>
          ) : (
            <h1 id="hero-title" className="sr-only">
              {TITLE}
            </h1>
          )}
          {!reduced && (
            <div aria-hidden="true" className="font-display text-5xl font-black leading-[0.95] text-creme [font-variation-settings:'SOFT'_100,'WONK'_1,'opsz'_144] sm:text-7xl lg:text-8xl">
              <SplitText text="O açaí mais" tag="p" textAlign="left" splitType="words, chars" effect="rise" mask delay={28} duration={1.1} trigger="load" className="font-display text-5xl font-black leading-[0.95] text-creme [font-variation-settings:'SOFT'_100,'WONK'_1,'opsz'_144] sm:text-7xl lg:text-8xl" />
              <RotatingText
                texts={['vivo', 'cremoso', 'fresquinho', 'gostoso']}
                mainClassName="inline-flex overflow-hidden rounded-[0.25em] bg-pessego px-[0.18em] pb-[0.08em] text-vinho"
                staggerDuration={0.025} staggerFrom="last" rotationInterval={2400}
                transition={{ type: 'spring', damping: 26, stiffness: 380 }}
              />
              <SplitText text="do Brasil" tag="p" textAlign="left" splitType="words, chars" effect="rise" mask delay={28} duration={1.1} trigger="load" className="font-display text-5xl font-black leading-[0.95] text-creme [font-variation-settings:'SOFT'_100,'WONK'_1,'opsz'_144] sm:text-7xl lg:text-8xl" />
            </div>
          )}

          {reduced ? (
            <p className="mt-6 max-w-md text-lg text-creme/90 sm:text-xl">{SUBTITLE}</p>
          ) : (
            <BlurText
              text={SUBTITLE}
              animateBy="words"
              direction="bottom"
              delay={60}
              trigger="load"
              className="mt-6 max-w-md text-lg text-creme/90 sm:text-xl"
            />
          )}

          <div className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
            <Magnet padding={60} magnetStrength={4} disabled={reduced}>
              <a href="#cardapio" className="btn-outline">
                Ver cardápio
              </a>
            </Magnet>
            <Magnet padding={60} magnetStrength={4} disabled={reduced}>
              <a href="#delivery" className="btn-primary shadow-[0_18px_40px_-14px_rgba(247,222,182,0.55)]">
                <ShinyText
                  text="Peça delivery"
                  color="#6B0F32"
                  shineColor="#B4477F"
                  speed={2.6}
                  disabled={reduced}
                />
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </Magnet>
          </div>
        </div>
      </div>

      {/* Indicador de rolagem */}
      <a
        href="#sobre"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-pessego sm:flex"
      >
        Role
        <span aria-hidden="true" className="h-10 w-[2px] overflow-hidden rounded bg-pessego/30">
          <span className="block h-1/2 w-full animate-[desce_1.6s_ease-in-out_infinite] bg-pessego motion-reduce:animate-none" />
        </span>
      </a>
      <style>{`@keyframes desce{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}`}</style>
    </section>
  );
}
