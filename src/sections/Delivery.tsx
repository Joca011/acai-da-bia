import { assets } from '../lib/assets';
import LoopVideo from '../components/LoopVideo';
import { useReducedMotion } from '../lib/useReducedMotion';

export default function Delivery() {
  const reduced = useReducedMotion();

  return (
    <section id="delivery" aria-labelledby="delivery-titulo" className="relative overflow-hidden bg-ameixa py-20 text-creme sm:py-28">
      <div aria-hidden="true" className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-vinho/60" />
      <div aria-hidden="true" className="absolute -bottom-32 right-1/3 h-80 w-80 rounded-full bg-coral/30" />
      <div aria-hidden="true" className="absolute right-[-6rem] top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-vinho-escuro/70" />

      <div className="container-site relative grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="eyebrow text-pessego">Delivery</p>
          <h2 id="delivery-titulo" className="mt-3 font-display text-5xl font-black leading-[0.98] text-creme sm:text-7xl lg:text-8xl">
            Bateu a vontade?
            <br />
            <span className="italic text-pessego">A Bia leva.</span>
          </h2>
          <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <a href="#" aria-label="Peça no app" onClick={(e) => e.preventDefault()} className="btn btn-primary px-8 text-lg">
              Peça no app
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </a>
            <p className="max-w-xs text-sm text-creme">Entrega em até 40 min nas unidades participantes.</p>
          </div>
        </div>

        <div className="relative lg:col-span-5">
          <div data-photo className="relative aspect-[4/3] overflow-hidden rounded-5xl shadow-[0_40px_90px_-30px_rgba(0,0,0,0.6)] ring-1 ring-pessego/30">
            <LoopVideo src={assets.pessoas.delivery.video} poster={assets.pessoas.delivery.poster}
              alt="Cliente sorrindo ao receber a sacola do Açaí da Bia na porta de casa" className="h-full w-full object-cover" />
          </div>
          <div aria-hidden="true" className="absolute -bottom-8 -left-6 flex h-28 w-28 items-center justify-center sm:-left-10 sm:h-36 sm:w-36">
            <svg viewBox="0 0 200 200" className={`absolute inset-0 h-full w-full ${reduced ? '' : 'animate-[spin_24s_linear_infinite]'}`}>
              <defs><path id="delivery-circulo" d="M100 100m-80 0a80 80 0 1 1 160 0a80 80 0 1 1-160 0" /></defs>
              <circle cx="100" cy="100" r="98" className="fill-vinho" />
              <text className="fill-pessego font-display" style={{ fontSize: 19, fontWeight: 900, letterSpacing: 3 }}>
                <textPath href="#delivery-circulo">delivery • delivery • delivery • delivery •</textPath>
              </text>
            </svg>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pessego text-vinho sm:h-16 sm:w-16">
              <svg viewBox="0 0 64 64" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="14" cy="44" r="8" /><circle cx="50" cy="44" r="8" /><path d="M14 44h8l8-16h10l10 16M30 28l-3-6h-6M40 28V18h8" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
