import { assets } from '../lib/assets';
import { useState, type FormEvent } from 'react';

type Campo = 'nome' | 'email' | 'cidade' | 'faixa';
type Erros = Partial<Record<Campo, string>>;

const faixas = [
  'Até R$ 150 mil',
  'De R$ 150 mil a R$ 300 mil',
  'De R$ 300 mil a R$ 500 mil',
  'Acima de R$ 500 mil',
];

const inputCls =
  'mt-2 block min-h-[48px] w-full rounded-2xl bg-creme px-4 py-3 text-base text-vinho placeholder:text-vinho/60 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-coral';

function validar(f: FormData): Erros {
  const e: Erros = {};
  const nome = String(f.get('nome') ?? '').trim();
  const email = String(f.get('email') ?? '').trim();
  const cidade = String(f.get('cidade') ?? '').trim();
  const faixa = String(f.get('faixa') ?? '');
  if (nome.length < 2) e.nome = 'Conta pra gente seu nome.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) e.email = 'Confira o e-mail, parece que falta algo.';
  if (cidade.length < 2) e.cidade = 'Informe sua cidade e UF.';
  if (!faixa) e.faixa = 'Escolha uma faixa de investimento.';
  return e;
}

export default function Franquia() {
  const [erros, setErros] = useState<Erros>({});
  const [enviado, setEnviado] = useState(false);

  const onSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const form = ev.currentTarget;
    const e = validar(new FormData(form));
    setErros(e);
    const first = (Object.keys(e) as Campo[])[0];
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setEnviado(true);
  };

  const err = (c: Campo) =>
    erros[c] ? (
      <p id={`${c}-erro`} className="mt-2 text-sm font-bold text-pessego">
        {erros[c]}
      </p>
    ) : null;
  const aria = (c: Campo) => ({
    'aria-invalid': erros[c] ? (true as const) : undefined,
    'aria-describedby': erros[c] ? `${c}-erro` : undefined,
  });

  return (
    <section id="franquia" aria-labelledby="fr-titulo" className="relative overflow-x-clip bg-vinho-profundo py-20 text-creme sm:py-28">
      <svg aria-hidden="true" viewBox="0 0 400 400" className="pointer-events-none absolute -left-32 -top-20 h-96 w-96 text-vinho">
        <path fill="currentColor" d="M300 50c50 40 60 120 30 180s-100 100-165 85S45 250 55 180 120 50 190 38s60-28 110 12Z" />
      </svg>
      <div className="container-site relative grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div>
          <p className="eyebrow text-pessego">Franquia</p>
          <h2 id="fr-titulo" className="section-title mt-3">
            Leve a Bia <span className="text-pessego">pra sua cidade.</span>
          </h2>
          <p className="mt-5 max-w-md text-lg text-creme">
            Um negócio com cheiro de bairro, receita de família e apoio de ponta a ponta. Deixe seu contato e a gente conversa.
          </p>
          <ul className="mt-8 space-y-3 text-creme">
            {['Treinamento completo da equipe', 'Fornecimento com origem responsável', 'Identidade e marketing prontos'].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span aria-hidden="true" className="flex h-7 w-7 items-center justify-center rounded-full bg-pessego text-vinho">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-10" /></svg>
                </span>
                {t}
              </li>
            ))}
          </ul>
          <div data-photo className="mt-10 aspect-[4/3] overflow-hidden rounded-5xl ring-1 ring-pessego/20">
            <img src={assets.pessoas.equipe} alt="Equipe do Açaí da Bia batendo açaí e montando bowls no balcão" loading="lazy" decoding="async" className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="rounded-5xl bg-vinho p-6 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.7)] ring-1 ring-pessego/20 sm:p-10">
          {enviado ? (
            <div role="status" className="py-8 text-center">
              <p className="font-display text-3xl font-black text-pessego">Recebemos seu interesse!</p>
              <p className="mt-3 text-creme">(O envio ainda não está conectado: nenhum dado foi enviado.)</p>
              <button
                type="button"
                className="btn-outline mt-6"
                onClick={() => {
                  setEnviado(false);
                  setErros({});
                }}
              >
                Voltar ao formulário
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              <div>
                <label htmlFor="f-nome" className="font-bold text-pessego">Nome</label>
                <input id="f-nome" name="nome" type="text" required autoComplete="name" className={inputCls} {...aria('nome')} />
                {err('nome')}
              </div>
              <div>
                <label htmlFor="f-email" className="font-bold text-pessego">E-mail</label>
                <input id="f-email" name="email" type="email" required autoComplete="email" className={inputCls} {...aria('email')} />
                {err('email')}
              </div>
              <div>
                <label htmlFor="f-cidade" className="font-bold text-pessego">Cidade/UF</label>
                <input id="f-cidade" name="cidade" type="text" required placeholder="Ex.: Cidade Exemplo/UF" className={inputCls} {...aria('cidade')} />
                {err('cidade')}
              </div>
              <div>
                <label htmlFor="f-faixa" className="font-bold text-pessego">Faixa de investimento</label>
                <select id="f-faixa" name="faixa" required defaultValue="" className={inputCls} {...aria('faixa')}>
                  <option value="" disabled>Selecione uma faixa</option>
                  {faixas.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
                {err('faixa')}
              </div>
              <div>
                <label htmlFor="f-msg" className="font-bold text-pessego">Mensagem <span className="font-normal">(opcional)</span></label>
                <textarea id="f-msg" name="mensagem" rows={4} className={`${inputCls} min-h-[120px]`} />
              </div>
              <button type="submit" className="btn-primary w-full sm:w-auto">Quero ser Bia na minha cidade</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
