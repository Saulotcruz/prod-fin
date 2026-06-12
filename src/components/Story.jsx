import Reveal from './Reveal'

export default function Story() {
  return (
    <section className="bg-brand py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white opacity-40" />
      <div
        className="absolute top-0 left-0 right-0 h-14 bg-paper pointer-events-none"
        style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
      />

      <div className="wrap relative z-10">
        <Reveal>
          <p className="section-eyebrow text-gold/60 mb-6">A Virada</p>

          <blockquote className="font-serif text-white text-[clamp(1.35rem,5.5vw,1.9rem)] leading-[1.3] tracking-[-0.01em] mb-8">
            “Quando somei meus gastos por categoria, quase caí da cadeira: eu torrava
            mais de <em className="text-gold not-italic">R$ 400 por mês</em> em coisas que
            nem percebia que existiam.”
          </blockquote>

          <div className="space-y-4 text-white/70 text-[0.95rem] leading-[1.75] max-w-md border-l-2 border-gold/40 pl-5">
            <p>
              Eu sou o Saulo. Trabalho com tecnologia há mais de 10 anos e vivia esse
              mesmo aperto. Até que cansei e categorizei todos os meus gastos do mês, um
              por um. Assinaturas esquecidas, delivery por preguiça, “só R$ 20” que viravam
              centenas.
            </p>
            <p>
              O problema não era nenhum gasto sozinho — era que ninguém nunca me mostrou{' '}
              <strong className="text-white font-semibold">todos eles somados, na minha
              cara, por categoria.</strong>
            </p>
            <p>
              Então construí uma planilha pra fazer esse trabalho pesado por mim. Hoje sei
              exatamente onde estou pisando — e sobra dinheiro.{' '}
              <strong className="text-white font-semibold">É essa mesma planilha que está
              aqui dentro</strong>, pronta pra você usar hoje.
            </p>
          </div>

          <p className="mt-8 font-serif text-gold text-lg">— Saulo Cruz</p>
        </Reveal>
      </div>
    </section>
  )
}
