import { useEffect, useState } from 'react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-brand/95 backdrop-blur-sm shadow-[0_2px_20px_rgba(0,0,0,0.25)]'
          : 'bg-transparent'
      }`}
    >
      <div className="wrap flex items-center justify-between h-14">
        <span className="font-serif text-gold text-xs tracking-wide whitespace-nowrap">
          Para onde foi meu dinheiro
        </span>
      </div>
    </header>
  )
}
