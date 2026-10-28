import { useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import TiltedCard from '../components/reactbits/TiltedCard';
import { assets } from '../lib/assets';
import { useReducedMotion } from '../lib/useReducedMotion';

interface Produto {
  nome: string;
  desc: string;
  preco: string;
  img: string;
  alt: string;
}

interface Categoria {
  id: string;
  rotulo: string;
  produtos: Produto[];
}

const tamanhos = '300 ml · 500 ml';

const categorias: Categoria[] = [
  {
    id: 'classicos',
    rotulo: 'Clássicos',
    produtos: [
      { nome: 'Clássico da Bia', desc: 'Açaí cremoso com granola crocante e banana.', preco: 'R$ 22,90', img: assets.produtos.classico, alt: 'Copo de açaí com granola e rodelas de banana' },
      { nome: 'Morango do Amor', desc: 'Açaí com morangos frescos e leite condensado.', preco: 'R$ 24,90', img: assets.produtos.morango, alt: 'Copo de açaí coberto de morangos frescos' },
    ],
  },
  {
    id: 'gourmet',
    rotulo: 'Gourmet',
    produtos: [
      { nome: 'Tropical Dourado', desc: 'Manga, kiwi e coco ralado sobre açaí gelado.', preco: 'R$ 29,90', img: assets.produtos.gourmetTropical, alt: 'Açaí gourmet com manga, kiwi e coco' },
      { nome: 'Noite de Gala', desc: 'Chocolate amargo, framboesa e folha de ouro comestível.', preco: 'R$ 34,90', img: assets.produtos.gourmetChocolateOuro, alt: 'Açaí gourmet com chocolate, framboesas e folha de ouro' },
    ],
  },
  {
    id: 'especiais',
    rotulo: 'Especiais',
    produtos: [
      { nome: 'Avelã Cremosa', desc: 'Creme de avelã, chocolate e um toque de banana.', preco: 'R$ 27,90', img: assets.produtos.chocolateAvela, alt: 'Açaí com creme de avelã e chocolate' },
      { nome: 'Paçoca da Vó', desc: 'Paçoca esfarelada, leite em pó e mel por cima.', preco: 'R$ 25,90', img: assets.produtos.pacoca, alt: 'Açaí coberto de paçoca esfarelada' },
    ],
  },
];

function Foto({ p, reduced }: { p: Produto; reduced: boolean }) {
  if (reduced) {
    return (
      <img
        src={p.img}
        alt={p.alt}
        width={800}
        height={800}
        loading="lazy"
        decoding="async"
        className="aspect-square w-full rounded-4xl object-cover"
      />
    );
  }
  return (
    <div className="aspect-square w-full">
      <TiltedCard
        imageSrc={p.img}
        altText={p.alt}
        containerWidth="100%"
        containerHeight="100%"
        imageWidth="100%"
        imageHeight="100%"
        radius={32}
        rotateAmplitude={10}
        scaleOnHover={1.04}
        glare={0.25}
        shadow={0.25}
        showTooltip={false}
        gyroscope={false}
        intro={false}
      />
    </div>
  );
}

export default function Cardapio() {
  const reduced = useReducedMotion();
  const [ativa, setAtiva] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const ir = (i: number) => {
    const n = (i + categorias.length) % categorias.length;
    setAtiva(n);
    tabRefs.current[n]?.focus();
  };

  const onKey = (e: KeyboardEvent, i: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') ir(i + 1);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ir(i - 1);
    else if (e.key === 'Home') ir(0);
    else if (e.key === 'End') ir(categorias.length - 1);
    else return;
    e.preventDefault();
  };

  const cat = categorias[ativa];

  return (
    <section id="cardapio" aria-labelledby="cardapio-titulo" className="relative overflow-hidden bg-creme py-20 sm:py-28">
      <div aria-hidden="true" className="absolute inset-x-0 top-1/3 h-2/3 bg-pessego/50" style={{ clipPath: 'ellipse(75% 60% at 50% 55%)' }} />

      <div className="container-site relative">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-oliva-escuro">Cardápio</p>
            <h2 id="cardapio-titulo" className="section-title mt-3 text-vinho">
              Escolhe o <span className="italic">seu</span> copo.
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Categorias do cardápio"
            className="inline-flex self-start rounded-full bg-white p-1.5 shadow-[0_12px_40px_-20px_rgba(107,15,50,0.5)] ring-1 ring-vinho/10"
          >
            {categorias.map((c, i) => {
              const sel = i === ativa;
              return (
                <button
                  key={c.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  type="button"
                  id={`tab-${c.id}`}
                  aria-selected={sel}
                  aria-controls={`painel-${c.id}`}
                  tabIndex={sel ? 0 : -1}
                  onClick={() => setAtiva(i)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={`min-h-[44px] rounded-full px-4 text-sm font-bold transition-colors sm:px-6 sm:text-base ${
                    sel ? 'bg-vinho text-creme' : 'text-vinho hover:bg-pessego'
                  }`}
                >
                  {c.rotulo}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-12">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={cat.id}
              role="tabpanel"
              id={`painel-${cat.id}`}
              aria-labelledby={`tab-${cat.id}`}
              tabIndex={0}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -16 }}
              transition={{ duration: reduced ? 0 : 0.35, ease: 'easeOut' }}
              className="grid gap-8 sm:grid-cols-2 lg:gap-12"
            >
              {cat.produtos.map((p, i) => (
                <article
                  key={p.nome}
                  className={`rounded-5xl bg-creme p-4 shadow-[0_30px_70px_-35px_rgba(107,15,50,0.55)] ring-1 ring-vinho/10 sm:p-5 ${
                    i === 1 ? 'sm:mt-12' : ''
                  }`}
                >
                  <Foto p={p} reduced={reduced} />
                  <div className="px-2 pb-2 pt-5">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-2xl font-black text-vinho sm:text-3xl">{p.nome}</h3>
                      <p className="shrink-0 rounded-full bg-vinho px-3 py-1 text-sm font-bold text-creme">{p.preco}</p>
                    </div>
                    <p className="mt-2 text-base text-vinho">{p.desc}</p>
                    <p className="mt-3 text-sm font-bold uppercase tracking-widest text-oliva-escuro">{tamanhos}</p>
                  </div>
                </article>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
