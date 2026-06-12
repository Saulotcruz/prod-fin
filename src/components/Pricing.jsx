import { Check } from 'lucide-react'
import CTAButton from './CTAButton'
import PaymentBadges from './PaymentBadges'
import Reveal from './Reveal'

const includes = [
  'Planilha completa em Excel (.xlsm)',
  '9 categorias classificadas automaticamente',
  'Importação de extrato via arquivo TXT',
  'Dashboard com gráficos e resumo mensal',
  'Compatível com os principais bancos do Brasil',
  'Funciona no Windows e no Mac',
  '7 dias de garantia incondicional',
]

export default function Pricing() {
  return (
    <section id="checkout" className="bg-paper py-20 border-t border-ink/6">
      <div className="wrap">
        <Reveal className="text-center mb-10">
          <p className="section-eyebrow mb-3">Investimento</p>
          <h2 className="section-title">Por que tão barato?</h2>
          <p className="text-muted mt-4 max-w-md mx-auto text-sm leading-relaxed">
            Apps de finanças cobram R$ 10–20/mês — mais de R$ 120 por ano, pra sempre — e
            ainda exigem conectar sua conta. Eu não quero que o preço seja desculpa pra você
            continuar no escuro.
          </p>
        </Reveal>

        <Reveal className="bg-white rounded-2xl border border-ink/8 shadow-[0_8px_40px_rgba(10,61,43,0.1)] overflow-hidden">
          {/* Price header */}
          <div className="bg-brand px-6 pt-8 pb-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white" />
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-white/70 text-lg font-medium line-through decoration-gold/80 decoration-2">
                  De R$ 97
                </span>
                <span className="text-[0.6rem] font-bold uppercase tracking-wider text-brand bg-gold px-2 py-0.5 rounded-full">
                  Oferta de lançamento
                </span>
              </div>
              <div className="flex items-start justify-center gap-1">
                <span className="font-serif text-gold text-2xl mt-3 font-normal">R$</span>
                <span className="font-serif text-gold text-[5rem] leading-none tracking-tight">37</span>
              </div>
              <p className="text-white/50 text-sm mt-2">pagamento único · sem mensalidade</p>
              <p className="text-gold/80 text-xs mt-3 font-medium">
                Menos do que você gastou em delivery essa semana.
              </p>
            </div>
          </div>

          {/* Includes list */}
          <div className="px-6 py-8">
            <p className="text-xs font-bold tracking-widest uppercase text-muted mb-5">
              O que está incluído
            </p>
            <ul className="space-y-3">
              {includes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                    <Check size={11} className="text-brand" strokeWidth={3} />
                  </div>
                  <span className="text-sm text-ink leading-snug">{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-xs text-muted leading-relaxed text-center italic">
              Criada por quem vive de tecnologia há mais de 10 anos — pra resolver o
              próprio problema antes de virar produto.
            </p>

            <div className="mt-6">
              <CTAButton label="Quero meu painel por R$ 37" />
              <PaymentBadges variant="light" className="mt-5" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
