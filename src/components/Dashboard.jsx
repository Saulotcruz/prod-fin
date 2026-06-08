import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { FileSpreadsheet } from 'lucide-react'
import { revealVariants, viewportOnce } from '../hooks/useReveal'

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

/*
 * Efeito estilo Apple: a imagem cresce conforme entra na tela (pico no centro)
 * e encolhe ao sair, atrelado à barra de rolagem (scroll-linked).
 * `min` = escala inicial/final, `max` = escala no centro da viewport.
 * Usa só transform/opacity (performance). Respeita prefers-reduced-motion.
 */
function ScrollZoom({ children, min = 0.86, max = 1.06, className = '' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [min, max, min])
  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.85, 1], [0.4, 1, 1, 0.7])

  return (
    <motion.div
      ref={ref}
      style={reduce ? undefined : { scale, opacity }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  )
}

export default function Dashboard() {
  return (
    <section className="py-12 relative overflow-hidden bg-[linear-gradient(180deg,#0A3D2B_0%,#176B49_30%)]">
      <div className="absolute inset-0 bg-grid-white opacity-50" />

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

        {/* 1) Print REAL do Excel (prova) — zoom mais forte estilo Apple */}
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-center gap-2 mb-3">
            <FileSpreadsheet size={15} className="text-gold shrink-0" />
            <p className="text-white/70 text-sm font-medium">
              É uma planilha <strong className="text-white">Excel de verdade</strong>
            </p>
          </div>

          <ScrollZoom min={0.82} max={1.08}>
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
          </ScrollZoom>

          <p className="text-white/35 text-xs text-center mt-3 leading-relaxed">
            Você abre no Excel, importa o extrato e usa — sem instalar nada, sem app.
          </p>
        </div>

        {/* 2) Resumo visual estilizado (desejo) — zoom mais sutil */}
        <div className="mt-12 max-w-md mx-auto">
          <p className="text-white/70 text-sm font-medium text-center mb-3">
            E o resumo do mês fica assim — <strong className="text-white">limpo e visual</strong>
          </p>
          <ScrollZoom min={0.88} max={1.04}>
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
          </ScrollZoom>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-14 bg-paper pointer-events-none"
        style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}
      />
    </section>
  )
}
