import { motion } from 'framer-motion'
import { Download, Zap, BarChart2 } from 'lucide-react'
import { revealVariants, staggerContainer, viewportOnce, ease } from '../hooks/useReveal'

const steps = [
  {
    number: '01',
    icon: Download,
    title: 'Exporte seu extrato',
    body: 'Acesse o site do seu banco e baixe o extrato no formato TXT — compatível com Itaú, Bradesco, Nubank, Caixa e outros.',
  },
  {
    number: '02',
    icon: Zap,
    title: 'Importe na planilha',
    body: 'Um clique no botão de importação e a planilha lê o arquivo automaticamente. Sem copiar, sem colar, sem digitar.',
  },
  {
    number: '03',
    icon: BarChart2,
    title: 'Veja seu dashboard',
    body: 'Todos os seus gastos já aparecem categorizados, com gráficos e resumo do mês prontos para analisar.',
  },
]

export default function HowItWorks() {
  return (
    <section className="bg-cream py-20">
      <div className="wrap">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={revealVariants}
          className="text-center mb-12"
        >
          <p className="section-eyebrow mb-3">Como Funciona</p>
          <h2 className="section-title">
            Em 3 passos, tudo organizado
          </h2>
          <p className="text-muted mt-4 max-w-xs mx-auto text-sm leading-relaxed">
            Do zero ao dashboard em menos de 5 minutos
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
        >
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                variants={revealVariants}
                className="relative bg-white rounded-xl p-6 shadow-sm border border-ink/6"
              >
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="absolute left-[2.35rem] top-full h-4 w-px bg-gold/30 z-10" />
                )}

                <div className="flex items-start gap-5">
                  {/* Icon bubble */}
                  <div className="shrink-0 w-12 h-12 rounded-full bg-brand flex items-center justify-center">
                    <Icon size={20} className="text-gold" strokeWidth={1.8} />
                  </div>

                  <div className="flex-1 pt-0.5">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="font-serif text-3xl text-brand/15 leading-none">
                        {step.number}
                      </span>
                      <h3 className="font-bold text-ink text-base leading-snug">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-muted text-sm leading-relaxed">{step.body}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
