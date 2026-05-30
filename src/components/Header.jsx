import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

function trackPixel() {
  if (typeof fbq !== 'undefined') {
    fbq('track', 'InitiateCheckout', { value: 37.00, currency: 'BRL' })
  }
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-brand/95 backdrop-blur-sm shadow-[0_2px_20px_rgba(0,0,0,0.25)]'
          : 'bg-transparent'
      }`}
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="wrap flex items-center justify-between h-14">
        <span className="font-serif text-gold text-xs tracking-wide whitespace-nowrap">
          Para onde foi meu dinheiro
        </span>
        {/*   <motion.a
          href="https://pay.hotmart.com/F106035340P?checkoutMode=10"
          onClick={trackPixel}
          className="bg-gold text-ink text-xs font-bold px-4 py-2 rounded-md leading-none tracking-wide"
          whileTap={{ scale: 0.95 }}
          whileHover={{ backgroundColor: '#E2C478' }}
        >
          Comprar — R$ 37
          </motion.a>   */}
      </div>
    </motion.header>
  )
}
