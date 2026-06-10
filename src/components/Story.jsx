import { m } from 'framer-motion'
import { revealVariants, viewportOnce } from '../hooks/useReveal'

export default function Story() {
  return (
    <section className="bg-brand py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white opacity-40" />
      <div
        className="absolute top-0 left-0 right-0 h-14 bg-paper pointer-events-none"
        style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
      />

      <div className="wrap relative z-10">
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={revealVariants}
        >
          <p className="section-eyebrow text-gold/60 mb-6">Por que eu criei isso</p>

          <blockquote className="font-serif text-white text-[clamp(1.35rem,5.5vw,1.9rem)] leading-[1.3] tracking-[-0.01em] mb-8">
            “Eu ganhava bem e mesmo assim chegava no dia 25 no vermelho.
            Não fazia ideia de <em className="text-gold not-italic">para onde meu dinheiro ia</em>.”
          </blockquote>

          <div className="space-y-4 text-white/70 text-[0.95rem] leading-[1.75] max-w-md border-l-2 border-gold/40 pl-5">
            <p>
              Eu vivia no limite do cheque especial. Todo mês prometia que ia me organizar —
              e todo mês o salário sumia antes de eu entender como.
            </p>
            <p>
              Quando sentei e finalmente categorizei tudo, levei um susto: descobri mais de
              <strong className="text-white font-semibold"> R$ 400 por mês</strong> em assinaturas
              e gastos invisíveis que eu nem lembrava que tinha. Em coisas que eu nem usava.
            </p>
            <p>
              Cansei de perder horas digitando planilha à mão, então montei um sistema que lê o
              extrato e organiza tudo sozinho. Hoje sei exatamente onde estou pisando — e sobra
              dinheiro. <strong className="text-white font-semibold">É esse mesmo sistema que está
              aqui dentro</strong>, pronto para você usar hoje.
            </p>
          </div>

          <p className="mt-8 font-serif text-gold text-lg">— Saulo Cruz</p>
        </m.div>
      </div>
    </section>
  )
}
