import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Reveal from './Reveal'

const faqs = [
  {
    q: 'Funciona com qualquer banco?',
    a: 'Sim. A planilha é compatível com os principais bancos que permitem exportar o extrato em formato TXT: Itaú, Bradesco, Nubank, Caixa Econômica, Banco do Brasil, Santander e outros. Se o seu banco exportar em TXT, vai funcionar.',
  },
  {
    q: 'Preciso saber usar Excel avançado?',
    a: 'Não precisa. Se você sabe abrir um arquivo e clicar em botões, consegue usar a planilha. O processo de importação é uma única ação — clicar em "Importar" e selecionar o arquivo. Pronto.',
  },
  {
    q: 'E se eu não gostar da planilha?',
    a: 'Você tem 7 dias corridos após a compra para solicitar reembolso completo. Basta mandar um e-mail — sem burocracia, sem perguntas, sem demora. Recebe o dinheiro de volta em até 24 horas.',
  },
  {
    q: 'Como recebo a planilha após comprar?',
    a: 'Imediatamente após a confirmação do pagamento você recebe um e-mail com o link para download. Se não aparecer em alguns minutos, verifique a caixa de spam.',
  },
  {
    q: 'Funciona no Mac?',
    a: 'Sim. A planilha funciona no Microsoft Excel para Windows e Mac. Não é compatível com Google Sheets ou LibreOffice — precisa do Excel mesmo.',
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
