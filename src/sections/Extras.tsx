import { assets } from '../lib/assets';
import LoopVideo from '../components/LoopVideo';
import { useId, useState } from 'react';

const adocantes = ['Açúcar', 'Stevia', 'Xilitol', 'Sem açúcar'];
const toppings = [
  'Granola',
  'Banana',
  'Morango',
  'Leite em pó',
  'Leite condensado',
  'Paçoca',
  'Kiwi',
  'Coco ralado',
  'Mel',
  'Creme de avelã',
];

const BASE = 18;
const POR_TOPPING = 2.5;

const brl = (v: number) => 'R$ ' + v.toFixed(2).replace('.', ',');

function Check() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m4 10.5 4 4 8-9" />
    </svg>
  );
}

const chipBase =
  'inline-flex min-h-[44px] cursor-pointer select-none items-center gap-2 rounded-full px-5 py-2 text-base font-bold transition-colors peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-vinho';
const chipOn = 'bg-vinho text-creme';
const chipOff = 'bg-white text-vinho ring-1 ring-vinho/20 hover:bg-pessego';

export default function Extras() {
  const uid = useId();
  const [adocante, setAdocante] = useState(adocantes[0]);
  const [sel, setSel] = useState<string[]>(['Granola', 'Banana']);

  const toggle = (t: string) => setSel((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));
  const total = BASE + sel.length * POR_TOPPING;

  return (
    <section id="monte" aria-labelledby="extras-titulo" className="relative overflow-hidden bg-creme py-20 sm:py-28">
      <svg aria-hidden="true" viewBox="0 0 120 40" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-8 w-full text-pessego sm:h-12">
        <path fill="currentColor" d="M0 0h120v10c-10 12-20 12-30 0S70 -2 60 10 40 22 30 10 10-2 0 10Z" />
      </svg>

      <div className="container-site grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="eyebrow text-oliva-escuro">Adoçantes e extras</p>
          <h2 id="extras-titulo" className="section-title mt-3 text-vinho">
            Monte do seu jeito.
          </h2>

          <fieldset className="mt-10 border-0 p-0">
            <legend className="font-display text-2xl font-black text-vinho">Adoçante</legend>
            <div className="mt-4 flex flex-wrap gap-3">
              {adocantes.map((a) => {
                const on = a === adocante;
                return (
                  <label key={a} className="relative">
                    <input
                      type="radio"
                      name={`${uid}-adocante`}
                      value={a}
                      checked={on}
                      onChange={() => setAdocante(a)}
                      className="peer sr-only"
                    />
                    <span className={`${chipBase} ${on ? chipOn : chipOff}`}>
                      {on && <Check />}
                      {a}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="mt-10 border-0 p-0">
            <legend className="font-display text-2xl font-black text-vinho">Toppings</legend>
            <p className="mt-1 text-sm text-oliva-escuro">+ R$ 2,50 cada. Escolha quantos quiser.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {toppings.map((t) => {
                const on = sel.includes(t);
                return (
                  <label key={t} className="relative">
                    <input type="checkbox" checked={on} onChange={() => toggle(t)} className="peer sr-only" />
                    <span className={`${chipBase} ${on ? chipOn : chipOff}`}>
                      {on && <Check />}
                      {t}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        <div className="lg:col-span-5">
          <div data-photo className="mb-6 aspect-video overflow-hidden rounded-5xl shadow-[0_30px_70px_-35px_rgba(107,15,50,0.6)]">
            <LoopVideo src={assets.pessoas.preparo.video} poster={assets.pessoas.preparo.poster}
              alt="Açaí sendo servido no bowl e coberto com banana, morango, granola e mel" className="h-full w-full object-cover" />
          </div>
          <div className="relative rounded-5xl bg-vinho p-8 text-creme shadow-[0_30px_80px_-30px_rgba(107,15,50,0.7)] lg:sticky lg:top-28">
            <span aria-hidden="true" className="absolute -right-3 -top-3 h-14 w-14 rounded-full bg-coral" />
            <p className="eyebrow text-pessego">Seu açaí</p>
            <div aria-live="polite" aria-atomic="true" className="mt-4">
              <p className="font-display text-2xl font-black leading-snug sm:text-3xl">
                {sel.length ? sel.join(', ') : 'Puro, só o açaí'}
                <span className="text-pessego"> · adoçante: {adocante.toLowerCase()}</span>
              </p>
              <p className="mt-6 text-sm text-pessego">
                Base {brl(BASE)} + {sel.length} {sel.length === 1 ? 'topping' : 'toppings'}
              </p>
              <p className="font-display text-5xl font-black text-creme">{brl(total)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
