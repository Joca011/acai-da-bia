import LoopVideo from '../components/LoopVideo';
import { useState } from 'react';
import { assets } from '../lib/assets';

const lojas = [
  { id: 1, nome: 'Bia Ponta Negra', end: 'Av. Engenheiro Roberto Freire — Ponta Negra, Natal/RN', lat: -5.8747662, lon: -35.1786945 },
  { id: 2, nome: 'Bia Petrópolis', end: 'Av. Afonso Pena — Petrópolis, Natal/RN', lat: -5.7864758, lon: -35.1965899 },
  { id: 3, nome: 'Bia Lagoa Nova', end: 'Av. Prudente de Morais — Lagoa Nova, Natal/RN', lat: -5.8214932, lon: -35.2134902 },
];

const embed = (lat: number, lon: number) =>
  `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.012}%2C${lat - 0.008}%2C${lon + 0.012}%2C${lat + 0.008}&layer=mapnik&marker=${lat}%2C${lon}`;

export default function Lojas() {
  const [sel, setSel] = useState(1);
  const atual = lojas.find((l) => l.id === sel)!;


  return (
    <section id="lojas" aria-labelledby="lojas-titulo" className="relative overflow-x-clip bg-pessego py-20 sm:py-28">
      <div className="container-site">
        <div className="max-w-2xl">
          <p className="eyebrow text-vinho">Nossas lojas</p>
          <h2 id="lojas-titulo" className="section-title mt-3">
            Sempre tem uma Bia <span className="text-ameixa">pertinho.</span>
          </h2>
        </div>

        <div data-photo className="mt-10 overflow-hidden rounded-5xl shadow-[0_30px_70px_-35px_rgba(107,15,50,0.6)]">
          <LoopVideo src={assets.pessoas.atendente.video} poster={assets.pessoas.atendente.poster}
            alt="Atendente sorrindo atrás do balcão de uma loja do Açaí da Bia" className="h-56 w-full object-cover sm:h-80 lg:h-[26rem]" />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.15fr]">
          <ul className="space-y-4">
            {lojas.map((l) => {
              const ativo = l.id === sel;
              return (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => setSel(l.id)}
                    aria-pressed={ativo}
                    className={`flex w-full items-start gap-4 rounded-4xl p-5 text-left transition-all ${
                      ativo ? 'bg-vinho text-creme shadow-[0_20px_40px_-20px_rgba(46,6,22,0.7)]' : 'bg-creme text-vinho hover:bg-white'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-xl font-black ${
                        ativo ? 'bg-pessego text-vinho' : 'bg-vinho text-creme'
                      }`}
                    >
                      {l.id}
                    </span>
                    <span>
                      <span className="block font-display text-2xl font-black">{l.nome}</span>
                      <span className="mt-1 block text-base">{l.end}</span>
                      <span className="mt-1 block text-base font-bold">Seg a dom · 10h às 22h</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="rounded-5xl bg-creme p-3 shadow-[0_24px_60px_-30px_rgba(107,15,50,0.5)] sm:p-4">
            <iframe
              key={atual.id}
              title={`Mapa: ${atual.nome}, ${atual.end}`}
              src={embed(atual.lat, atual.lon)}
              loading="lazy"
              className="aspect-[4/3] w-full rounded-4xl border-0 lg:aspect-auto lg:h-[26rem]"
            />
            <p className="flex flex-wrap items-center justify-center gap-x-3 px-3 pb-2 pt-3 text-center text-sm font-semibold text-vinho" aria-live="polite">
              <span>{atual.nome} · {atual.end}</span>
              <a className="underline decoration-2 underline-offset-4 hover:text-ameixa" target="_blank" rel="noopener noreferrer"
                href={`https://www.google.com/maps/search/?api=1&query=${atual.lat},${atual.lon}`}>Como chegar</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
