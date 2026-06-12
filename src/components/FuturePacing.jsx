import { Heart, Home, Smile, Play } from 'lucide-react'
import Reveal from './Reveal'

const chips = [
  { icon: Smile, label: 'Lazer', color: 'text-violet-500', bg: 'bg-violet-50' },
  { icon: Home, label: 'Casa', color: 'text-sky-500', bg: 'bg-sky-50' },
  { icon: Heart, label: 'Saúde', color: 'text-rose-500', bg: 'bg-rose-50' },
  { icon: Play, label: 'Streaming', color: 'text-red-500', bg: 'bg-red-50' },
]

export default function FuturePacing() {
  return (
    <section className="bg-cream py-20 border-t border-ink/6">
      <div className="wrap">
        <Reveal>
          <p className="section-eyebrow mb-3">Imagina o próximo mês</p>
          <h2 className="section-title max-w-sm">
            Dia 28 de novo — só que dessa vez você sabe.
          </h2>
        </Reveal>

        <Reveal className="mt-7 space-y-5 text-ink/80 text-[0.98rem] leading-[1.8] max-w-md">
          <p>
            Você abre a planilha e vê: quanto entrou, quanto saiu, quanto sobrou — e em
            cores, quanto foi pra cada categoria.
          </p>
        </Reveal>

        <Reveal className="mt-6 flex flex-wrap gap-2.5">
          {chips.map(({ icon: Icon, label, color, bg }) => (
            <span
              key={label}
              className="flex items-center gap-2 bg-white border border-ink/6 rounded-full pl-2 pr-4 py-1.5 shadow-sm"
            >
              <span className={`w-6 h-6 rounded-full ${bg} flex items-center justify-center`}>
                <Icon size={13} className={color} strokeWidth={2} />
              </span>
              <span className="text-sm font-semibold text-ink">{label}</span>
            </span>
          ))}
        </Reveal>

        <Reveal className="mt-7 space-y-5 text-ink/80 text-[0.98rem] leading-[1.8] max-w-md">
          <p>
            Pela primeira vez você não está adivinhando.{' '}
            <strong className="text-ink font-semibold">Você sabe.</strong> E sabendo, você
            decide: corta a assinatura que não usa, segura o delivery.
          </p>
          <p className="text-ink font-semibold">
            No mês seguinte, sobra. Não porque você ganha mais — porque parou de gastar no
            escuro.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
