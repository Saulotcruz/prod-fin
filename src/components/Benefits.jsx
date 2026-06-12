import { Eye, Search, LayoutDashboard, Brain, ShieldCheck, Infinity as InfinityIcon } from 'lucide-react'
import Reveal from './Reveal'

const benefits = [
  {
    icon: Eye,
    title: 'Enxergue a verdade do seu mês em 2 minutos',
    body: 'Pra onde foi cada real, sem digitar uma linha sequer.',
  },
  {
    icon: Search,
    title: 'Ache os “vazamentos invisíveis”',
    body: 'As assinaturas e gastinhos que comem centenas todo mês sem você notar.',
  },
  {
    icon: LayoutDashboard,
    title: 'Um painel que qualquer pessoa entende',
    body: 'Entrou, saiu, sobrou — e por categoria, tudo num olhar.',
  },
  {
    icon: Brain,
    title: 'Pare de se sentir burro com dinheiro',
    body: 'Controlar fica fácil quando você finalmente consegue VER.',
  },
  {
    icon: ShieldCheck,
    title: 'Seus dados só com você',
    body: 'Sem conectar seu banco a ninguém. Privacidade total.',
  },
  {
    icon: InfinityIcon,
    title: 'Pague uma vez, use pra sempre',
    body: 'Sem mensalidade, sem surpresa no cartão depois.',
  },
]

export default function Benefits() {
  return (
    <section className="bg-paper py-20 border-t border-ink/6">
      <div className="wrap">
        <Reveal className="mb-10">
          <p className="section-eyebrow mb-3">O que você leva</p>
          <h2 className="section-title max-w-xs">
            Não é uma planilha. É o fim do “cadê o dinheiro?”
          </h2>
        </Reveal>

        <div className="flex flex-col gap-3">
          {benefits.map(({ icon: Icon, title, body }, i) => (
            <Reveal
              as="div"
              key={title}
              delay={i * 80}
              className="flex items-start gap-4 bg-white rounded-xl p-5 border border-ink/6 shadow-sm"
            >
              <div className="shrink-0 w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center">
                <Icon size={18} className="text-brand" strokeWidth={2} />
              </div>
              <div>
                <p className="font-bold text-ink text-[0.95rem] leading-snug">{title}</p>
                <p className="text-muted text-sm mt-1 leading-relaxed">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
