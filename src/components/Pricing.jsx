import { m } from 'framer-motion'
import { Check } from 'lucide-react'
import CTAButton from './CTAButton'
import PaymentBadges from './PaymentBadges'
import { revealVariants, viewportOnce, ease } from '../hooks/useReveal'

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
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={revealVariants}
          className="text-center mb-10"
        >
          <p className="section-eyebrow mb-3">Investimento</p>
          <h2 className="section-title">Tudo isso por apenas</h2>
        </m.div>

        <m.div
          className="bg-white rounded-2xl border border-ink/8 shadow-[0_8px_40px_rgba(10,61,43,0.1)] overflow-hidden"
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.7, ease }}
        >
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

            <div className="mt-8">
              <CTAButton label="Garantir minha planilha" />
              <PaymentBadges variant="light" className="mt-5" />
            </div>
          </div>
        </m.div>
      </div>
    </section>
  )
}
