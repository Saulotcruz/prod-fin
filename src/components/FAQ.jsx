import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Reveal from './Reveal'

const faqs = [
  {
    q: 'Não entendo de Excel, vou conseguir?',
    a: 'Vai. Você só joga o arquivo do banco lá dentro e a planilha faz o resto — separa em categorias e monta o painel sozinha. É mais fácil que pedir iFood. Sem fórmula, sem digitação.',
  },
  {
    q: 'Funciona com o meu banco?',
    a: 'Sim — Nubank, Itaú, Bradesco, Caixa, Inter, Santander, Banco do Brasil e praticamente todos que deixam baixar o extrato em arquivo (TXT). Se o seu banco exporta o extrato, vai funcionar.',
  },
  {
    q: 'Dá trabalho manter todo mês?',
    a: 'Não. São 3 cliques, cerca de 2 minutos, uma vez por mês. Zero digitação. Você baixa o extrato, joga na planilha e o painel se atualiza.',
  },
  {
    q: 'É mais um app pra pagar todo mês?',
    a: 'Não. São R$ 37 uma vez só — é seu pra sempre. Sem mensalidade, sem renovação, e seus dados ficam só com você (você não conecta sua conta a ninguém).',
  },
  {
    q: 'Como recebo depois de comprar?',
    a: 'Na hora. Assim que o pagamento é confirmado, você recebe no seu e-mail o link para baixar. Se não aparecer em alguns minutos, confira a caixa de spam.',
  },
  {
    q: 'Funciona no Mac?',
    a: 'Sim. Funciona no Microsoft Excel para Windows e Mac. Só não é compatível com Google Sheets ou LibreOffice — precisa do Excel mesmo.',
  },
]

function FAQItem({ q, a, open, onToggle }) {
  return (
    <div className="border-b border-ink/8 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-ink text-sm leading-snug">{q}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 mt-0.5 text-muted transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Accordion em CSS puro (grid-rows 0fr -> 1fr) */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden min-h-0">
          <p className="text-muted text-sm leading-relaxed pb-5">{a}</p>
        </div>
      </div>
    </div>
  )
}

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null)

  return (
    <section className="bg-cream py-20 border-t border-ink/6">
      <div className="wrap">
        <Reveal className="mb-10">
          <p className="section-eyebrow mb-3">Dúvidas Frequentes</p>
          <h2 className="section-title max-w-xs">Tem alguma dúvida?</h2>
        </Reveal>

        <div className="bg-white rounded-xl border border-ink/6 shadow-sm divide-y divide-ink/6 px-6">
          {faqs.map((item, i) => (
            <Reveal key={i} delay={i * 80}>
              <FAQItem
                q={item.q}
                a={item.a}
                open={openIdx === i}
                onToggle={() => setOpenIdx(openIdx === i ? null : i)}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
