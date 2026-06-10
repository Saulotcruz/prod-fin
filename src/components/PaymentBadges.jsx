import { ShieldCheck, CreditCard, Lock } from 'lucide-react'

/*
 * Selos de confiança exibidos perto dos botões de compra.
 * `variant="light"` para fundos claros (paper/cream), `dark` para fundo brand.
 */
export default function PaymentBadges({ variant = 'light', className = '' }) {
  const isDark = variant === 'dark'
  const text = isDark ? 'text-white/55' : 'text-muted'
  const chip = isDark
    ? 'border-white/15 text-white/70'
    : 'border-ink/12 text-ink/70'

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {/* Linha de confiança */}
      <div className={`flex items-center justify-center gap-2 text-xs ${text}`}>
        <ShieldCheck size={14} className="shrink-0" />
        <span>Compra 100% segura · Acesso imediato</span>
      </div>

      {/* Formas de pagamento */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <span className={`flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-wide border rounded-md px-2 py-1 ${chip}`}>
          <CreditCard size={13} className="shrink-0" />
          Cartão · até 12x
        </span>
        <span className={`flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-wide border rounded-md px-2 py-1 ${chip}`}>
          Pix
        </span>
        <span className={`flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-wide border rounded-md px-2 py-1 ${chip}`}>
          Boleto
        </span>
      </div>

      {/* Plataforma */}
      <div className={`flex items-center justify-center gap-1.5 text-[0.68rem] ${text}`}>
        <Lock size={11} className="shrink-0" />
        <span>Pagamento processado pela Hotmart</span>
      </div>
    </div>
  )
}
