import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function CTAButton({ label = 'Garantir minha planilha por R$ 37', className = '' }) {
  return (
    <motion.a
      href="#checkout"
      className={`flex items-center justify-center gap-3 w-full min-h-[60px] px-8 py-4
        bg-gold text-ink font-bold text-base rounded-md
        shadow-[0_4px_24px_rgba(201,168,76,0.4)]
        touch-action-manipulation select-none
        ${className}`}
      animate={{ scale: [1, 1.018, 1] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      whileHover={{ backgroundColor: '#E2C478', boxShadow: '0 6px 32px rgba(201,168,76,0.55)' }}
      whileTap={{ scale: 0.97 }}
    >
      {label}
      <ArrowRight size={18} strokeWidth={2.5} />
    </motion.a>
  )
}
