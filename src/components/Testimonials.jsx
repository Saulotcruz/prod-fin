import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { revealVariants, staggerContainer, viewportOnce } from '../hooks/useReveal'

/*
 * SUBSTITUIR pelos prints reais de WhatsApp.
 * Coloque as imagens em: public/depoimentos/  (ex.: depo-1.png, depo-2.png...)
 * Mantenha proporção parecida e informe width/height reais para evitar layout shift (CLS).
 * O `src` aponta para /depoimentos/arquivo.png (a pasta public é servida na raiz).
 */
const prints = [
  { src: '/depoimentos/depo-1.png', alt: 'Depoimento de cliente no WhatsApp sobre a planilha', w: 800, h: 1200 },
  { src: '/depoimentos/depo-2.png', alt: 'Depoimento de cliente no WhatsApp sobre a planilha', w: 800, h: 1200 },
 /* { src: '/depoimentos/depo-3.png', alt: 'Depoimento de cliente no WhatsApp sobre a planilha', w: 800, h: 1200 },*/
]

export default function Testimonials() {
  return (
    <section className="bg-cream py-20 border-t border-ink/6">
      <div className="wrap">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={revealVariants}
          className="text-center mb-10"
        >
          <p className="section-eyebrow mb-3">Quem já usa</p>
          <h2 className="section-title">Veja o que estão dizendo</h2>
          <div className="flex items-center justify-center gap-1 mt-4" aria-hidden="true">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className="text-gold fill-gold" strokeWidth={0} />
            ))}
          </div>
          <p className="text-muted text-sm mt-3 max-w-xs mx-auto leading-relaxed">
            Mensagens reais de quem já organizou as finanças com a planilha.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col gap-4 max-w-sm mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
        >
          {prints.map((p, i) => (
            <motion.figure
              key={i}
              variants={revealVariants}
              className="rounded-2xl overflow-hidden border border-ink/8 shadow-[0_8px_30px_rgba(10,61,43,0.10)] bg-white"
            >
              <img
                src={p.src}
                alt={p.alt}
                width={p.w}
                height={p.h}
                loading="lazy"
                decoding="async"
                className="w-full h-auto block"
              />
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
