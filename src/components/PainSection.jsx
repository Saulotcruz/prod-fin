import { X } from 'lucide-react'
import Reveal from './Reveal'

const pains = [
  {
    title: 'Fim do mês chega e o dinheiro sumiu — mas você não sabe como.',
    body: 'Você olha o extrato e fica sem entender onde foi parar o salário que entrou há 30 dias.',
  },
  {
    title: 'Fica horas digitando lançamento por lançamento numa planilha.',
    body: 'Todo mês a mesma rotina: abrir o app do banco, copiar cada transação, digitar categoria. Cansativo e sujeito a erro.',
  },
  {
    title: 'Usa papel, caderno ou app gratuito que some os seus dados.',
    body: 'Já perdeu o histórico porque o app fechou, o bloco de notas sumiu ou simplesmente desistiu de preencher.',
  },
  {
    title: 'Não confia em dar acesso do banco a aplicativos externos.',
    body: 'Faz sentido. Com o Para onde foi meu dinheiro você não conecta sua conta em nenhum lugar — só importa o arquivo TXT.',
  },
]

export default function PainSection() {
  return (
    <section className="bg-paper py-20">
      <div className="wrap">
        <Reveal>
          <p className="section-eyebrow mb-3">O Problema</p>
          <h2 className="section-title max-w-sm">
            Você ainda tenta controlar o dinheiro assim?
          </h2>
          <p className="text-muted mt-4 max-w-md leading-relaxed">
            Se qualquer um desses cenários parece familiar, você não está sozinho —
            e existe uma forma muito mais fácil.
          </p>
        </Reveal>

        <ul className="mt-10 space-y-0 divide-y divide-ink/8">
          {pains.map((pain, i) => (
            <Reveal
              as="li"
              key={i}
              delay={i * 100}
              className="grid grid-cols-[32px_1fr] gap-4 py-6 items-start"
            >
              <div className="mt-0.5 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <X size={14} className="text-red-500" strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-semibold text-ink leading-snug">{pain.title}</p>
                <p className="text-muted text-sm mt-1.5 leading-relaxed">{pain.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
