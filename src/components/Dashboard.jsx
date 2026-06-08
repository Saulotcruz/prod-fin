import { motion } from 'framer-motion'
import { FileSpreadsheet } from 'lucide-react'
import { revealVariants, viewportOnce, ease } from '../hooks/useReveal'

/*
 * Imagens em public/produto/:
 *  - dashboard.png → print REAL do Excel (gera confiança)
 *  - dash-2.png    → resumo visual estilizado (gera desejo)
 * Ajuste w/h se trocar as imagens (evita layout shift / CLS).
 */
const REAL = { src: '/produto/dashboard.png', w: 984, h: 642 }
const SUMMARY = { src: '/produto/dash-2.png', w: 565, h: 486 }

function WindowChrome({ label }) {
  return (
    <div className="bg-[#050f09] px-4 py-2.5 flex items-center gap-2 border-b border-white/6">
      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
      <span className="ml-3 text-[0.6rem] text-white/20 tracking-wider truncate">{label}</span>
    </div>
  )
}

export default function Dashboard() {
  return (
    <section className="bg-[#176B49] py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white opacity-50" />

      {/* Diagonal vindo da seção anterior */}
      <div
        className="absolute top-0 left-0 right-0 h-14 bg-brand pointer-events-none"
        style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
      />

      <div className="wrap relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={revealVariants}
          className="mb-8 text-center"
        >
          <p className="section-eyebrow text-gold/60 mb-3">O Produto por dentro</p>
          <h2 className="section-title-light">Seu mês inteiro em um olhar</h2>
          <p className="text-white/50 mt-3 text-sm max-w-xs mx-auto leading-relaxed">
            Importou o extrato? Pronto. Receita, gastos, saldo e cada categoria já aparecem organizados.
          </p>
        </motion.div>

        {/* 1) Print REAL do Excel (prova) */}
        <motion.div
          className="max-w-lg mx-auto"
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.8, ease }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <FileSpreadsheet size={15} className="text-gold shrink-0" />
            <p className="text-white/70 text-sm font-medium">
              É uma planilha <strong className="text-white">Excel de verdade</strong>
            </p>
          </div>

          <div className="rounded-xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)] bg-[#0a1f14]">
            <WindowChrome label="ParaOndeFoiMeuDinheiro.xlsm — Dashboard" />
            <img
              src={REAL.src}
              alt="Print real da planilha no Excel mostrando recebimentos, gastos, saldo e gráficos"
              width={REAL.w}
              height={REAL.h}
              loading="lazy"
              decoding="async"
              className="w-full h-auto block"
            />
          </div>
          <p className="text-white/35 text-xs text-center mt-3 leading-relaxed">
            Você abre no Excel, importa o extrato e usa — sem instalar nada, sem app.
          </p>
        </motion.div>

        {/* 2) Resumo visual estilizado (desejo) */}
        <motion.div
          className="mt-12 max-w-md mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={revealVariants}
        >
          <p className="text-white/70 text-sm font-medium text-center mb-3">
            E o resumo do mês fica assim — <strong className="text-white">limpo e visual</strong>
          </p>
          <div className="rounded-xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)] bg-[#0a1f14]">
            <WindowChrome label="ParaOndeFoiMeuDinheiro.xlsm — Resumo" />
            <img
              src={SUMMARY.src}
              alt="Resumo do mês: receita, gastos, saldo, economia e gastos por categoria"
              width={SUMMARY.w}
              height={SUMMARY.h}
              loading="lazy"
              decoding="async"
              className="w-full h-auto block"
            />
          </div>
        </motion.div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-14 bg-paper pointer-events-none"
        style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}
      />
    </section>
  )
}
