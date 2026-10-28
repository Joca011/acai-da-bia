import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Motion global: rolagem suave + revelações em cascata + parallax de fotos. */
export function useSiteMotion(reduced: boolean) {
  useEffect(() => {
    if (reduced) return;
    // Rolagem suave só com mouse/trackpad; no touch a rolagem nativa é mais leve e fluida.
    const fine = window.matchMedia('(pointer: fine)').matches;
    const lenis = fine ? new Lenis({ lerp: 0.1, anchors: { offset: -70 } }) : null;
    const tick = (t: number) => lenis?.raf(t * 1000);
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const ctx = gsap.context(() => {
      const scope = 'main > section:not(#topo)';
      // Títulos e rótulos: sobem em cascata.
      gsap.set(`${scope} :is(h2, .eyebrow)`, { autoAlpha: 0, y: 50 });
      ScrollTrigger.batch(`${scope} :is(h2, .eyebrow)`, {
        start: 'top 88%', once: true,
        onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.12 }),
      });
      // Cards e itens de lista: cascata com leve escala.
      const cards = `${scope} :is(.card, article, dl > div, ol > li)`;
      gsap.set(cards, { autoAlpha: 0, y: 70, scale: 0.94 });
      ScrollTrigger.batch(cards, {
        start: 'top 92%', once: true,
        onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, scale: 1, duration: 1, ease: 'expo.out', stagger: 0.09 }),
      });
      // Fotos grandes: cortina + zoom-out ligado à rolagem.
      gsap.utils.toArray<HTMLElement>(`${scope} [data-photo]`).forEach((el) => {
        gsap.fromTo(el, { clipPath: 'inset(18% 10% 18% 10% round 40px)' }, {
          clipPath: 'inset(0% 0% 0% 0% round 40px)', ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 35%', scrub: 0.6 },
        });
        const media = el.querySelector('img, video');
        if (media) gsap.fromTo(media, { scale: 1.25, yPercent: -6 }, {
          scale: 1, yPercent: 6, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    refresh();
    window.addEventListener('load', refresh);
    const t = setTimeout(refresh, 1200);
    return () => {
      clearTimeout(t);
      window.removeEventListener('load', refresh);
      ctx.revert();
      if (lenis) { gsap.ticker.remove(tick); lenis.destroy(); }
    };
  }, [reduced]);
}
