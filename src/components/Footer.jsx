import { motion } from 'framer-motion'
import CTAButton from './CTAButton'
import { revealVariants, viewportOnce } from '../hooks/useReveal'

export default function Footer() {
  return (
    <>
      {/* Final CTA band */}
      <section className="bg-brand py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white" />
        <div className="wrap relative z-10 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={revealVariants}
          >
            <p className="font-serif text-[clamp(1.6rem,6vw,2.4rem)] text-white leading-[1.15] mb-6">
              Pare de descobrir onde foi seu dinheiro{' '}
              <em className="text-gold not-italic">depois que já era tarde.</em>
            </p>
            <div className="max-w-xs mx-auto">
              <CTAButton label="Quero o controle agora — R$ 37" />
            </div>
            <p className="text-white/35 text-xs mt-4">
              Acesso imediato · 7 dias de garantia · Sem mensalidade
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer bar */}
      <footer className="bg-[#050f09] py-6">
        <div className="wrap flex flex-col items-center gap-2 text-center">
          <span className="font-serif text-gold text-sm tracking-wide">
            Para onde foi meu dinheiro
          </span>
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} · Todos os direitos reservados
          </p>
          <p className="text-white/15 text-xs max-w-xs leading-relaxed">
            Este produto é uma planilha digital em formato Excel. Não é um aplicativo
            ou software. Requer Microsoft Excel para Windows ou Mac.
          </p>
        </div>
      </footer>
    </>
  )
}
