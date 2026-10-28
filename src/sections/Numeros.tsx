import CountUp from '../components/reactbits/CountUp';

interface Stat {
  rotulo: string;
  node: (cls: string) => React.ReactNode;
}

const stats: Stat[] = [
  { rotulo: 'unidades', node: (c) => <CountUp to={12} duration={2} className={c} /> },
  {
    rotulo: 'açaís servidos',
    node: (c) => (
      <>
        <CountUp to={180} duration={2.4} className={c} />
        <span className="ml-1 font-display text-2xl font-black text-vinho sm:text-3xl"> mil</span>
      </>
    ),
  },
  {
    rotulo: 'nota média',
    node: (c) => (
      <>
        <span className={c}>4,</span>
        <CountUp to={9} duration={1.8} className={c} />
      </>
    ),
  },
  { rotulo: 'sabores e toppings', node: (c) => <CountUp to={37} duration={2} className={c} /> },
];

const tons = ['bg-white', 'bg-pessego', 'bg-white', 'bg-pessego'];

export default function Numeros() {
  return (
    <section id="numeros" aria-labelledby="numeros-titulo" className="relative overflow-hidden bg-creme py-20 sm:py-28">
      <div className="container-site">
        <div className="max-w-2xl">
          <p className="eyebrow text-oliva-escuro">Em números</p>
          <h2 id="numeros-titulo" className="section-title mt-3 text-vinho">
            A Bia em números.
          </h2>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.rotulo}
              className={`rounded-4xl ${tons[i]} p-5 sm:p-8 shadow-[0_24px_60px_-35px_rgba(107,15,50,0.55)] ring-1 ring-vinho/10 ${
                i % 2 ? 'lg:mt-10' : ''
              }`}
            >
              <div className="flex flex-col-reverse">
                <dt className="mt-2 text-sm font-bold text-oliva-escuro sm:text-base">{s.rotulo}</dt>
                <dd className="font-display text-4xl font-black text-vinho sm:text-7xl">{s.node('font-display')}</dd>
              </div>
            </div>
          ))}
        </dl>

      </div>
    </section>
  );
}
