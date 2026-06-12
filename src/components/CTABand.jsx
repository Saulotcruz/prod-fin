import { useEffect } from 'react'
import CTAButton from './CTAButton'
import Reveal from './Reveal'

/*
 * Faixa de CTA "cedo" — captura quem já se convenceu pelo mecanismo,
 * antes de rolar o resto da página.
 */
export default function CTABand({
  heading = 'Pronto pra ver a verdade do seu mês?',
  label = 'Quero ver pra onde foi meu dinheiro',
}) {
  // Dispara ViewContent (Meta Pixel) quando 70% desta faixa de CTA fica visível.
  useEffect(() => {
    const alvo = document.getElementById('cta-band')
    if (!alvo) return
    let disparado = false
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !disparado) {
          disparado = true
          window.fbq?.('track', 'ViewContent', {
            content_name: 'Planilha Para Onde Foi Meu Dinheiro',
            content_ids: ['planilha-financas'],
            content_type: 'product',
            value: 37.0,
            currency: 'BRL',
          })
          obs.disconnect()
        }
      },
      { threshold: 0.7 },
    )
    obs.observe(alvo)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="cta-band" className="bg-brand py-14 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white" />
      <div className="wrap relative z-10 text-center">
        <Reveal>
          <h2 className="font-serif text-[clamp(1.5rem,5.5vw,2.1rem)] text-white leading-[1.2] mb-6 max-w-md mx-auto">
            {heading}
          </h2>
          <div className="max-w-xs mx-auto">
            <CTAButton label={label} />
          </div>
          <p className="text-white/45 text-xs mt-4 leading-relaxed max-w-xs mx-auto">
            Pagamento único · sem mensalidade · entrega na hora · 7 dias de garantia
          </p>
        </Reveal>
      </div>
    </section>
  )
}
