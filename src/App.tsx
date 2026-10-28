import Header from './sections/Header';
import Hero from './sections/Hero';
import Marquee from './sections/Marquee';
import Historia from './sections/Historia';
import Origem from './sections/Origem';
import Cardapio from './sections/Cardapio';
import Extras from './sections/Extras';
import Delivery from './sections/Delivery';
import Numeros from './sections/Numeros';
import Sustentabilidade from './sections/Sustentabilidade';
import Avaliacoes from './sections/Avaliacoes';
import Lojas from './sections/Lojas';
import Fidelidade from './sections/Fidelidade';
import Franquia from './sections/Franquia';
import Footer from './sections/Footer';
import { useSiteMotion } from './lib/useSiteMotion';
import ClickSpark from './components/reactbits/ClickSpark';
import { useReducedMotion } from './lib/useReducedMotion';

export default function App() {
  const reduced = useReducedMotion();
  useSiteMotion(reduced);
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
      </main>
      <Footer />
    </ClickSpark>
  );
}
