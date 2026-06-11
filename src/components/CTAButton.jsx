import { ArrowRight } from 'lucide-react'

function trackPixel() {
  if (typeof fbq !== 'undefined') {
    // InitiateCheckout: clique no botão de compra (recomendado)
    fbq('track', 'InitiateCheckout', { value: 37.00, currency: 'BRL' })
  }
}

export default function CTAButton({
  label = 'Garantir minha planilha',
  anchor = true,
  className = '',
}) {
  return (
    <a
      href="https://pay.hotmart.com/F106035340P?checkoutMode=10"
      onClick={trackPixel}
      className={`cta-pulse group flex flex-col items-center justify-center w-full min-h-[60px] px-6 py-3
        bg-gold hover:bg-[#E2C478] active:scale-[0.98] text-ink font-bold rounded-md
        shadow-[0_4px_24px_rgba(201,168,76,0.4)] hover:shadow-[0_6px_32px_rgba(201,168,76,0.55)]
        transition-[background-color,box-shadow] duration-200
        touch-action-manipulation select-none
        ${className}`}
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
    </a>
  )
}
