import { ShieldCheck } from 'lucide-react'
import Reveal from './Reveal'

export default function Guarantee() {
  return (
    <section className="bg-cream py-20 border-t border-ink/6">
      <div className="wrap">
        <Reveal className="flex flex-col items-center text-center gap-6">
          <div className="w-16 h-16 rounded-full bg-brand flex items-center justify-center shadow-[0_8px_24px_rgba(10,61,43,0.25)]">
            <ShieldCheck size={28} className="text-gold" strokeWidth={1.6} />
          </div>

          <div>
            <p className="section-eyebrow mb-2">Garantia Incondicional</p>
            <h2 className="font-serif text-[clamp(1.8rem,6vw,2.6rem)] leading-[1.1] text-ink">
              7 dias de garantia total
            </h2>
          </div>

          <p className="text-muted text-base leading-relaxed max-w-sm">
            Se por qualquer motivo você não gostar da planilha, basta enviar um e-mail
            em até 7 dias após a compra e devolvemos{' '}
            <strong className="text-ink font-semibold">100% do seu dinheiro</strong>.
            Sem perguntas, sem burocracia.
          </p>

          <div className="w-full border-t border-ink/8 pt-6 flex flex-wrap justify-center gap-8">
            {['Sem perguntas', 'Reembolso total', 'Processado em 24h'].map((item) => (
              <span key={item} className="text-sm text-muted font-medium">
                ✓ {item}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
