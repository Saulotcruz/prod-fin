import CTAButton from './CTAButton'
import PaymentBadges from './PaymentBadges'
import Reveal from './Reveal'

export default function Footer() {
  return (
    <>
      {/* Final CTA band */}
      <section className="bg-brand py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white" />
        <div className="wrap relative z-10 text-center">
          <Reveal>
            <p className="font-serif text-[clamp(1.6rem,6vw,2.4rem)] text-white leading-[1.15] mb-6">
              Pare de chegar no fim do mês perguntando:{' '}
              <em className="text-gold not-italic">cadê o dinheiro?</em>
            </p>
            <div className="max-w-xs mx-auto">
              <CTAButton label="Quero meu painel agora — R$ 37" />
            </div>
            <p className="text-white/45 text-xs mt-4">
              Pix, Boleto ou 12x no cartão · acesso imediato · risco zero por 7 dias
            </p>
            <PaymentBadges variant="dark" className="mt-5" />
          </Reveal>
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
