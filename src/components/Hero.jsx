export default function Hero() {
  return (
    <section className="relative bg-brand overflow-hidden min-h-[62svh] flex flex-col justify-center">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid-white" />

      {/* Radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-brand2/40 blur-[100px] pointer-events-none" />

      <div className="wrap relative z-10 pt-24 pb-12">
        <p className="section-eyebrow text-gold/60 mb-6">
          Planilha de Finanças Pessoais · Excel
        </p>

        <h1 className="font-serif text-[clamp(2.2rem,9vw,3.6rem)] leading-[1.06] text-white mb-7 tracking-[-0.02em]">
          Você ganha razoável. Então por que{' '}
          <em className="text-gold not-italic">nunca sobra nada no fim do mês?</em>
        </h1>

        <p className="text-white/65 text-lg leading-relaxed border-l-2 border-gold pl-5 max-w-md">
          Não é que você gasta demais. É que você gasta no escuro. Esta planilha pega
          o extrato do seu banco e mostra, num painel simples,{' '}
          <strong className="text-white font-semibold">pra onde foi cada centavo</strong>
          {' '}— sem app, sem mensalidade, sem entender nada de Excel.
        </p>
      </div>
    </section>
  )
}
