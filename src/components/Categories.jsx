import { m } from 'framer-motion'
import {
  Heart, Smile, Home, ShoppingBag, Car,
  Play, BookOpen, Shirt, Package,
} from 'lucide-react'
import { revealVariants, staggerContainerFast, viewportOnce } from '../hooks/useReveal'

const categories = [
  { icon: Heart,       label: 'Saúde',       color: 'text-rose-500',   bg: 'bg-rose-50' },
  { icon: Smile,       label: 'Lazer',       color: 'text-violet-500', bg: 'bg-violet-50' },
  { icon: Home,        label: 'Casa',        color: 'text-sky-500',    bg: 'bg-sky-50' },
  { icon: ShoppingBag, label: 'Compras',     color: 'text-amber-500',  bg: 'bg-amber-50' },
  { icon: Car,         label: 'Locomoção',   color: 'text-blue-500',   bg: 'bg-blue-50' },
  { icon: Play,        label: 'Streaming',   color: 'text-red-500',    bg: 'bg-red-50' },
  { icon: BookOpen,    label: 'Educação',    color: 'text-emerald-500',bg: 'bg-emerald-50' },
  { icon: Shirt,       label: 'Vestuário',   color: 'text-fuchsia-500',bg: 'bg-fuchsia-50' },
  { icon: Package,     label: 'Outros',      color: 'text-slate-500',  bg: 'bg-slate-100' },
]

export default function Categories() {
  return (
    <section className="bg-paper py-20 border-t border-ink/6">
      <div className="wrap">
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={revealVariants}
          className="mb-10"
        >
          <p className="section-eyebrow mb-3">Categorização Automática</p>
          <h2 className="section-title max-w-xs">
            9 categorias — sem você precisar fazer nada
          </h2>
          <p className="text-muted mt-4 max-w-sm text-sm leading-relaxed">
            A planilha identifica e classifica cada transação automaticamente. Você só
            precisa importar o extrato e o trabalho está feito.
          </p>
        </m.div>

        <m.div
          className="grid grid-cols-3 gap-3"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainerFast}
        >
          {categories.map(({ icon: Icon, label, color, bg }) => (
            <m.div
              key={label}
              variants={revealVariants}
              className="flex flex-col items-center gap-2.5 p-4 rounded-xl bg-white border border-ink/6 shadow-sm"
            >
              <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center`}>
                <Icon size={18} className={color} strokeWidth={1.8} />
              </div>
              <span className="text-xs font-semibold text-ink text-center leading-tight">
                {label}
              </span>
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  )
}
