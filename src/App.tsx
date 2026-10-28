import { Suspense, lazy } from 'react';
import SiteMotion from './lib/SiteMotion';
import Header from './sections/Header';
import Hero from './sections/Hero';
import ClickSpark from './components/reactbits/ClickSpark';
import { useReducedMotion } from './lib/useReducedMotion';

const Marquee = lazy(() => import('./sections/Marquee'));
const Historia = lazy(() => import('./sections/Historia'));
const Origem = lazy(() => import('./sections/Origem'));
const Cardapio = lazy(() => import('./sections/Cardapio'));
const Extras = lazy(() => import('./sections/Extras'));
const Delivery = lazy(() => import('./sections/Delivery'));
const Numeros = lazy(() => import('./sections/Numeros'));
const Sustentabilidade = lazy(() => import('./sections/Sustentabilidade'));
const Avaliacoes = lazy(() => import('./sections/Avaliacoes'));
const Lojas = lazy(() => import('./sections/Lojas'));
const Fidelidade = lazy(() => import('./sections/Fidelidade'));
const Franquia = lazy(() => import('./sections/Franquia'));
const Footer = lazy(() => import('./sections/Footer'));

export default function App() {
  const reduced = useReducedMotion();
  const coarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  return (
    <ClickSpark
      sparkColor={['#F7DEB6', '#E1786E', '#8E3B7A']}
      sparkCount={9}
      sparkRadius={22}
      shape="dot"
      disabled={reduced || coarse}
    >
      <a
        href="#conteudo"
        className="sr-only-focusable fixed left-4 top-4 z-[100] rounded-full bg-pessego px-5 py-3 font-bold text-vinho"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <Suspense fallback={<div className="min-h-[100svh] bg-creme" />}>
          <Marquee />
          <Historia />
          <Origem />
          <Cardapio />
          <Extras />
          <Delivery />
          <Numeros />
          <Sustentabilidade />
          <Avaliacoes />
          <Lojas />
          <Fidelidade />
          <Franquia />
          <SiteMotion reduced={reduced} />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </ClickSpark>
  );
}
