import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { revealVariants, staggerContainer, viewportOnce } from '../hooks/useReveal'

const forItems = [
  'Quer saber para onde está indo cada centavo do salário',
  'Consegue parar 10 minutos por mês para importar o extrato',
  'Quer que sobre dinheiro no fim do mês',
]

const notForItems = [
  'Já sabe exatamente com o que gasta todo mês',
  'Não quer parar 10 minutos por mês para organizar a vida financeira',
]

function ItemRow({ icon: Icon, iconClass, bgClass, text, delay }) {
  return (
    <motion.li
      variants={revealVariants}
      className="flex items-start gap-3 py-3.5 border-b border-ink/6 last:border-0"
    >
      <div className={`mt-0.5 w-6 h-6 rounded-full ${bgClass} flex items-center justify-center shrink-0`}>
        <Icon size={12} className={iconClass} strokeWidth={3} />
      </div>
      <span className="text-sm text-ink leading-snug">{text}</span>
    </motion.li>
  )
}

export default function ForWho() {
  return (
    <section className="bg-cream py-20 border-t border-ink/6">
      <div className="wrap">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={revealVariants}
          className="mb-10"
        >
          <p className="section-eyebrow mb-3">Seja Honesto Consigo</p>
          <h2 className="section-title max-w-xs">
            Essa planilha é para você?
          </h2>
        </motion.div>

        <div className="flex flex-col gap-4">
          {/* Para quem É */}
          <motion.div
            className="bg-white rounded-xl border border-ink/6 shadow-sm overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
          >
            <div className="flex items-center gap-2.5 px-5 py-3.5 bg-brand border-b border-white/10">
              <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                <Check size={11} className="text-gold" strokeWidth={3} />
              </div>
              <span className="text-xs font-bold tracking-widest uppercase text-gold/90">
                É para você se…
              </span>
            </div>
            <ul className="px-5 py-1">
              {forItems.map((text) => (
                <ItemRow
                  key={text}
                  icon={Check}
                  iconClass="text-emerald-600"
                  bgClass="bg-emerald-100"
                  text={text}
                />
              ))}
            </ul>
          </motion.div>

          {/* Para quem NÃO É */}
          <motion.div
            className="bg-white rounded-xl border border-ink/6 shadow-sm overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
          >
            <div className="flex items-center gap-2.5 px-5 py-3.5 bg-ink/4 border-b border-ink/6">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <X size={11} className="text-red-500" strokeWidth={3} />
              </div>
              <span className="text-xs font-bold tracking-widest uppercase text-muted">
                Não é para você se…
              </span>
            </div>
            <ul className="px-5 py-1">
              {notForItems.map((text) => (
                <ItemRow
                  key={text}
                  icon={X}
                  iconClass="text-red-500"
                  bgClass="bg-red-50"
                  text={text}
                />
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
