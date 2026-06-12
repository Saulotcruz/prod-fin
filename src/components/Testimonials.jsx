import { Star } from 'lucide-react'
import Reveal from './Reveal'

/*
 * SUBSTITUIR pelos prints reais de WhatsApp.
 * Coloque as imagens em: public/depoimentos/  (ex.: depo-1.png, depo-2.png...)
 * Mantenha proporção parecida e informe width/height reais para evitar layout shift (CLS).
 * O `src` aponta para /depoimentos/arquivo.png (a pasta public é servida na raiz).
 */
const prints = [
  {
    src: '/depoimentos/depo-1.webp',
    alt: 'Depoimento de cliente no WhatsApp sobre a planilha',
    w: 1179,
    h: 1333,
    caption: 'Raphael: economizou mais de R$ 180/mês — R$ 2.160 no ano.',
  },
  {
    src: '/depoimentos/depo-2.webp',
    alt: 'Depoimento de cliente no WhatsApp sobre a planilha',
    w: 1119,
    h: 1280,
    caption: 'Victor: vai economizar R$ 3.600 no ano.',
  },
 /* { src: '/depoimentos/depo-3.webp', alt: 'Depoimento de cliente no WhatsApp sobre a planilha', w: 800, h: 1200 },*/
]

export default function Testimonials() {
  return (
    <section className="bg-cream py-20 border-t border-ink/6">
      <div className="wrap">
        <Reveal className="text-center mb-10">
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
        </Reveal>

        <div className="flex flex-col gap-4 max-w-sm mx-auto">
          {prints.map((p, i) => (
            <Reveal
              as="figure"
              key={i}
              delay={i * 100}
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
              {p.caption && (
                <figcaption className="px-4 py-3 text-sm font-semibold text-brand text-center border-t border-ink/6">
                  {p.caption}
                </figcaption>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
