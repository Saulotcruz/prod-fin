import { m } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

function trackPixel() {
  if (typeof fbq !== 'undefined') {
    // InitiateCheckout: clique no botão de compra (recomendado)
    fbq('track', 'InitiateCheckout', { value: 37.00, currency: 'BRL' })

    // Purchase: descomente abaixo se preferir rastrear como compra no clique
    // fbq('track', 'Purchase', { value: 37.00, currency: 'BRL' })
  }
}

export default function CTAButton({
  label = 'Garantir minha planilha',
  anchor = true,
  className = '',
}) {
  return (
    <m.a
      href="https://pay.hotmart.com/F106035340P?checkoutMode=10"
      onClick={trackPixel}
      className={`flex flex-col items-center justify-center w-full min-h-[60px] px-6 py-3
        bg-gold text-ink font-bold rounded-md
        shadow-[0_4px_24px_rgba(201,168,76,0.4)]
        touch-action-manipulation select-none
        ${className}`}
      animate={{ scale: [1, 1.018, 1] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      whileHover={{ backgroundColor: '#E2C478', boxShadow: '0 6px 32px rgba(201,168,76,0.55)' }}
      whileTap={{ scale: 0.97 }}
    >
      <span className="flex items-center gap-2 text-base leading-tight text-center">
        {label}
        <ArrowRight size={18} strokeWidth={2.5} className="shrink-0" />
      </span>
      {anchor && (
        <span className="text-[0.72rem] font-semibold text-ink/65 mt-0.5">
          <span className="line-through decoration-ink/40">De R$ 97</span> por R$ 37
        </span>
      )}
    </m.a>
  )
}
