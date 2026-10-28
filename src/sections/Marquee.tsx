import ScrollVelocity from '../components/reactbits/ScrollVelocity';
import { useReducedMotion } from '../lib/useReducedMotion';

const frases = [
  '100% açaí • sem enrolação • feito na hora •',
  'cremoso de verdade • do jeitinho da Bia •',
];

export default function Marquee() {
  const reduced = useReducedMotion();

  return (
    <div className="relative overflow-hidden bg-vinho py-8 text-pessego sm:py-12" role="region" aria-label="Lema da Bia">
      <p className="sr-only">{frases.join(' ')}</p>

      {reduced ? (
        <div aria-hidden="true" className="container-site flex flex-col gap-2 text-center">
          {frases.map((f) => (
            <p key={f} className="font-display text-3xl font-black leading-tight sm:text-5xl">
              {f}
            </p>
          ))}
        </div>
      ) : (
        <div aria-hidden="true">
          <ScrollVelocity
            texts={frases}
            velocity={70}
            numCopies={4}
            gap={24}
            fontSize="clamp(2.25rem, 7vw, 5rem)"
            fontWeight={900}
            color="#F7DEB6"
            scrollerClassName="scroller"
            scrollerStyle={{
              fontFamily: '"Fraunces Variable", Georgia, serif',
              fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 96',
              paddingBlock: '0.12em',
              filter: 'none',
            }}
          />
        </div>
      )}
    </div>
  );
}
