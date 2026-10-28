import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../lib/useReducedMotion';

interface Props { src: string; poster: string; alt: string; className?: string }

/** Vídeo em loop, mudo, que só toca quando está visível (economiza CPU e bateria no celular). */
export default function LoopVideo({ src, poster, alt, className = '' }: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || reduced) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, [reduced]);
  if (reduced) return <img src={poster} alt={alt} className={className} loading="lazy" />;
  return <video ref={ref} src={src} poster={poster} muted loop playsInline preload="none" aria-label={alt} className={className} />;
}
