import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

/** Palavra que troca em loop (estilo RotatingText do React Bits, feito com GSAP para não carregar o motion no hero). */
export default function HeroWords({ words, interval = 2400, className = '' }: { words: string[]; interval?: number; className?: string }) {
  const [i, setI] = useState(0);
  const box = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const t = setInterval(() => {
      const chars = box.current?.querySelectorAll('span');
      if (!chars) return;
      gsap.to(chars, { yPercent: -110, opacity: 0, duration: 0.35, ease: 'power3.in', stagger: { each: 0.02, from: 'end' },
        onComplete: () => setI((n) => (n + 1) % words.length) });
    }, interval);
    return () => clearInterval(t);
  }, [interval, words.length]);
  useEffect(() => {
    const chars = box.current?.querySelectorAll('span');
    if (chars) gsap.fromTo(chars, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.8)', stagger: { each: 0.025, from: 'end' } });
  }, [i]);
  return (
    <span ref={box} className={`inline-flex overflow-hidden ${className}`}>
      {[...words[i]].map((c, k) => <span key={`${i}-${k}`} className="inline-block">{c}</span>)}
    </span>
  );
}
