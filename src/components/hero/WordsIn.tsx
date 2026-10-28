import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/** Texto que entra palavra por palavra (substitui o BlurText no hero, sem motion). */
export default function WordsIn({ text, className = '', delay = 0.5 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const els = ref.current?.querySelectorAll('span');
    if (!els) return;
    const tw = gsap.from(els, { y: 18, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.04, delay });
    return () => { tw.kill(); };
  }, [delay]);
  return (
    <p ref={ref} className={className}>
      {text.split(' ').map((w, k) => <span key={k} className="inline-block whitespace-pre">{w + ' '}</span>)}
    </p>
  );
}
