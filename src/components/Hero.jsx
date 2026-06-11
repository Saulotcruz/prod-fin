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

        <h1 className="font-serif text-[clamp(2.5rem,10vw,4rem)] leading-[1.04] text-white mb-8 tracking-[-0.02em]">
          Chega de mês a mês sem saber para onde foi{' '}
          <em className="text-gold not-italic">o seu dinheiro.</em>
        </h1>

        <p className="text-white/60 text-lg leading-relaxed mb-10 border-l-2 border-gold pl-5 max-w-md">
          Importe seu extrato bancário e veja todas as suas finanças categorizadas
          automaticamente — sem horas de preenchimento, sem app de banco, sem mensalidade.
        </p>
      </div>
    </section>
  )
}
