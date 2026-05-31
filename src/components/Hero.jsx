import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import CTAButton from './CTAButton'

const ease = [0.22, 1, 0.36, 1]

function FadeUp({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function Hero() {
  const checks = ['Acesso imediato', 'Sem mensalidade', 'Acesso vitalício']

  return (
    <section className="relative bg-brand overflow-hidden min-h-[90svh] flex flex-col justify-center">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid-white" />

      {/* Radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-brand2/40 blur-[100px] pointer-events-none" />

      <div className="wrap relative z-10 pt-28 pb-20">
        <FadeUp delay={0.05}>
          <p className="section-eyebrow text-gold/60 mb-6">
            Planilha de Finanças Pessoais · Excel
          </p>
        </FadeUp>

        <FadeUp delay={0.15}>
          <h1 className="font-serif text-[clamp(2.5rem,10vw,4rem)] leading-[1.04] text-white mb-8 tracking-[-0.02em]">
            Chega de mês a mês sem saber para onde foi{' '}
            <em className="text-gold not-italic">o seu dinheiro.</em>
          </h1>
        </FadeUp>

        <FadeUp delay={0.28}>
          <p className="text-white/60 text-lg leading-relaxed mb-10 border-l-2 border-gold pl-5 max-w-md">
            Importe seu extrato bancário e veja todas as suas finanças categorizadas
            automaticamente — sem horas de preenchimento, sem app de banco, sem mensalidade.
          </p>
        </FadeUp>
{/*
        <FadeUp delay={0.42}>
          <div className="max-w-xs">
            <CTAButton label="Quero controlar meu dinheiro — R$ 37" />
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6">
            {checks.map((c) => (
              <span key={c} className="flex items-center gap-1.5 text-white/45 text-sm">
                <Check size={13} className="text-gold shrink-0" />
                {c}
              </span>
            ))}
          </div>
        </FadeUp> */}
      </div>

      {/* Diagonal clip into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-14 bg-paper pointer-events-none"
        style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}
      />
    </section>
  )
}
