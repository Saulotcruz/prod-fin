import { m } from 'framer-motion'
import { Check } from 'lucide-react'
import { revealVariants, staggerContainer, viewportOnce } from '../hooks/useReveal'

const rows = [
  {
    alt: 'Consultor financeiro',
    cost: 'R$300–R$800/hora',
    problem: 'Você depende de terceiros',
    highlight: false,
  },
  {
    alt: 'Apps (Guiabolso, Mobills Pro)',
    cost: 'R$20–R$40/mês\n= R$240–R$480/ano',
    problem: 'Mensalidade para sempre',
    highlight: false,
  },
  {
    alt: 'Planilha do zero',
    cost: '0 reais + 8–12 horas\ndo seu tempo',
    problem: 'Tempo que você não tem',
    highlight: false,
  },
  {
    alt: 'Para Onde Foi Meu Dinheiro',
    cost: 'R$37 — pagamento único',
    problem: 'Pronto em minutos',
    highlight: true,
  },
]

function MobileCard({ row }) {
  if (row.highlight) {
    return (
      <div className="rounded-xl bg-brand border-2 border-gold overflow-hidden">
        <div className="px-4 py-3 border-b border-gold/20">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
              <Check size={11} className="text-gold" strokeWidth={3} />
            </div>
            <p className="font-bold text-gold text-sm">{row.alt}</p>
          </div>
        </div>
        <div className="px-4 py-3 grid grid-cols-2 gap-3">
          <div>
            <p className="text-[0.6rem] font-bold tracking-widest uppercase text-gold/40 mb-1">Custo</p>
            <p className="text-gold font-bold text-sm whitespace-pre-line">{row.cost}</p>
          </div>
          <div>
            <p className="text-[0.6rem] font-bold tracking-widest uppercase text-gold/40 mb-1">Resultado</p>
            <p className="text-white font-semibold text-sm">{row.problem}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-white border border-ink/8 overflow-hidden">
      <div className="px-4 py-3 border-b border-ink/6">
        <p className="font-semibold text-ink text-sm">{row.alt}</p>
      </div>
      <div className="px-4 py-3 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[0.6rem] font-bold tracking-widest uppercase text-muted/60 mb-1">Custo</p>
          <p className="text-ink text-sm whitespace-pre-line">{row.cost}</p>
        </div>
        <div>
          <p className="text-[0.6rem] font-bold tracking-widest uppercase text-muted/60 mb-1">Problema</p>
          <p className="text-muted text-sm">{row.problem}</p>
        </div>
      </div>
    </div>
  )
}

export default function ValueAnchoring() {
  return (
    <section className="bg-paper py-20 border-t border-ink/6">
      <div className="wrap">
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={revealVariants}
          className="mb-10"
        >
          <p className="section-eyebrow mb-3">Ancoragem de Valor</p>
          <h2 className="section-title max-w-xs">
            Quanto custaria resolver isso de outro jeito?
          </h2>
        </m.div>

        {/* Cards mobile */}
        <m.div
          className="flex flex-col gap-3"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
        >
          {rows.map((row) => (
            <m.div key={row.alt} variants={revealVariants}>
              <MobileCard row={row} />
            </m.div>
          ))}
        </m.div>

        <m.p
          className="mt-8 text-center text-sm text-muted font-medium"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={revealVariants}
        >
          Sem mensalidade. Sem dependência.{' '}
          <span className="text-ink font-semibold">Uma vez, seu para sempre.</span>
        </m.p>
      </div>
    </section>
  )
}
