import { motion } from 'framer-motion'
import { revealVariants, viewportOnce, ease } from '../hooks/useReveal'

const kpis = [
  { label: 'Receita',    value: 'R$ 5.200', variant: 'gold' },
  { label: 'Gastos',     value: 'R$ 3.460', variant: 'red'  },
  { label: 'Saldo',      value: 'R$ 1.740', variant: 'green'},
  { label: 'Economia',   value: '33%',      variant: 'gray' },
]

const categories = [
  { name: 'Casa',         value: 'R$ 1.240', percent: 68, color: '#C9A84C' },
  { name: 'Alimentação',  value: 'R$ 890',   percent: 49, color: '#60a5fa' },
  { name: 'Locomoção',    value: 'R$ 620',   percent: 34, color: '#a78bfa' },
  { name: 'Lazer',        value: 'R$ 380',   percent: 21, color: '#34d399' },
  { name: 'Streaming',    value: 'R$ 180',   percent: 10, color: '#f87171' },
  { name: 'Saúde',        value: 'R$ 150',   percent: 8,  color: '#fb923c' },
]

const variantStyles = {
  gold:  'text-[#C9A84C]',
  red:   'text-red-400',
  green: 'text-emerald-400',
  gray:  'text-white/60',
}

function KPICard({ label, value, variant, delay }) {
  return (
    <motion.div
      className="bg-white/5 border border-white/8 rounded-lg p-3"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.5, ease, delay }}
    >
      <p className="text-[0.58rem] font-semibold tracking-wider uppercase text-white/30 mb-1.5">
        {label}
      </p>
      <p className={`text-base font-bold ${variantStyles[variant]}`}>{value}</p>
    </motion.div>
  )
}

function ProgressBar({ name, value, percent, color, delay }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <p className="text-[0.68rem] text-white/40 w-24 shrink-0 truncate">{name}</p>
      <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          viewport={viewportOnce}
          transition={{ duration: 0.9, ease, delay }}
        />
      </div>
      <p className="text-[0.68rem] text-white/50 w-16 text-right shrink-0">{value}</p>
    </div>
  )
}

export default function Dashboard() {
  return (
    <section className="bg-brand py-20 relative overflow-hidden">
      {/* bg grid */}
      <div className="absolute inset-0 bg-grid-white opacity-50" />

      <div className="wrap relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={revealVariants}
          className="mb-10 text-center"
        >
          <p className="section-eyebrow text-gold/60 mb-3">O Produto</p>
          <h2 className="section-title-light">
            É assim que seu painel vai ficar
          </h2>
          <p className="text-white/50 mt-3 text-sm max-w-xs mx-auto leading-relaxed">
            Tudo gerado automaticamente depois de importar seu extrato
          </p>
        </motion.div>

        {/* Dashboard mockup card */}
        <motion.div
          className="rounded-xl overflow-hidden border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.5)]"
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.8, ease }}
        >
          {/* Window chrome */}
          <div className="bg-[#050f09] px-4 py-3 flex items-center gap-2 border-b border-white/6">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 text-[0.65rem] text-white/20 tracking-wider">
              ParaOndeForuMeuDinheiro.xlsm — Dashboard
            </span>
          </div>

          <div className="bg-[#0a1f14] p-5">
            {/* Month label */}
            <p className="text-[0.6rem] font-bold tracking-widest uppercase text-white/25 mb-3">
              Junho 2025 — Resumo Mensal
            </p>

            {/* KPI grid */}
            <div className="grid grid-cols-2 gap-2 mb-5">
              {kpis.map((k, i) => (
                <KPICard key={k.label} {...k} delay={0.1 + i * 0.08} />
              ))}
            </div>

            {/* Category breakdown */}
            <div className="bg-white/3 rounded-lg p-4 border border-white/5">
              <p className="text-[0.6rem] font-bold tracking-widest uppercase text-white/25 mb-4">
                Gastos por Categoria
              </p>
              {categories.map((cat, i) => (
                <ProgressBar key={cat.name} {...cat} delay={0.4 + i * 0.1} />
              ))}
            </div>

            {/* Import status bar */}
            <motion.div
              className="mt-4 flex items-center gap-2.5 bg-emerald-900/30 border border-emerald-500/20 rounded-lg px-4 py-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewportOnce}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <p className="text-[0.68rem] text-emerald-400/80">
                147 transações importadas com sucesso · Última importação: hoje
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom clip */}
      <div
        className="absolute bottom-0 left-0 right-0 h-14 bg-paper pointer-events-none"
        style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}
      />
    </section>
  )
}
