import { motion } from 'framer-motion'
import { revealVariants, viewportOnce } from '../hooks/useReveal'

export default function AboutSection() {
  return (
    <section className="bg-cream py-20 border-t border-ink/6">
      <div className="wrap">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={revealVariants}
        >
          <p className="section-eyebrow mb-8">Quem está por trás disso</p>

          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="shrink-0 w-16 h-16 rounded-full bg-brand flex items-center justify-center shadow-[0_4px_16px_rgba(10,61,43,0.2)]">
                <img 
                  src="/Foto-Saulo2.jpeg" 
                  alt="Logo" 
                  className="w-full h-full object-cover"
                  </img>  
             {/* <span className="font-serif text-gold text-xl tracking-wide">SC</span>   */}
            </div>

            <div>
              <p className="font-bold text-ink text-base leading-none mb-0.5">Saulo Cruz</p>
              <p className="text-muted text-xs">Empreendedor · Tecnologia</p>
            </div>
          </div>

          <p className="mt-6 text-ink/80 text-sm leading-[1.75]">
            Saulo Cruz é empreendedor na área de tecnologia há mais de 10 anos, com experiência
            na gestão financeira de empresas — incluindo controle de fluxo de caixa, planejamento
            tributário e tomada de decisão com base em dados.
          </p>
          <p className="mt-4 text-ink/80 text-sm leading-[1.75]">
            Foi justamente essa visão de negócios aplicada às finanças pessoais que deu origem à
            planilha. Não é teoria de livro — é o que funciona na prática, simplificado para o
            dia a dia de qualquer pessoa.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
