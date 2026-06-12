import Reveal from './Reveal'

export default function PainSection() {
  return (
    <section className="bg-paper py-20">
      <div className="wrap">
        <Reveal>
          <p className="section-eyebrow mb-3">O Problema</p>
          <h2 className="section-title max-w-sm">
            Dia 28. Você abre o app do banco e aperta os olhos.
          </h2>
        </Reveal>

        <Reveal className="mt-8 space-y-5 text-ink/80 text-[0.98rem] leading-[1.8] max-w-md">
          <p>
            <span className="text-ink font-semibold">“Como assim?”</span> Você não
            comprou nada de absurdo. Trabalhou o mês inteiro, foi “se controlando”…
            e mesmo assim o dinheiro evaporou. De novo.
          </p>
          <p>
            Aí vem aquela vergonhazinha que você não conta pra ninguém:{' '}
            <em className="text-ink not-italic font-medium">
              “eu ganho bem, sou adulto — como é que não consigo explicar pra onde foi
              meu próprio dinheiro?”
            </em>
          </p>
          <p>
            Você rola o extrato. Dezenas de linhas misturadas. iFood, um boleto, três
            assinaturas que nem lembrava que tinha. Impossível entender. E no fundo você
            sabe: mês que vem vai ser igual.
          </p>
          <p className="text-ink font-semibold">
            Porque o problema nunca foi falta de esforço — é que você tenta controlar o
            que não consegue enxergar.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
