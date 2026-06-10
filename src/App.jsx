import { LazyMotion, domAnimation } from 'framer-motion'
import Header from './components/Header'
import Hero from './components/Hero'
import PainSection from './components/PainSection'
import Story from './components/Story'
import ForWho from './components/ForWho'
import HowItWorks from './components/HowItWorks'
import Categories from './components/Categories'
import Dashboard from './components/Dashboard'
import Testimonials from './components/Testimonials'
import Guarantee from './components/Guarantee'
import ValueAnchoring from './components/ValueAnchoring'
import AboutSection from './components/AboutSection'
import Pricing from './components/Pricing'
import FAQ from './components/FAQ'
import Footer from './components/Footer'

export default function App() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="font-sans text-ink bg-paper antialiased">
        <Header />
        <main>
          <Hero />
          <Dashboard />
          <PainSection />
          <Story />
          <ForWho />
          <HowItWorks />
          <Categories />
          <Testimonials />
          <AboutSection />
          <ValueAnchoring />
          <Guarantee />
          <Pricing />
          <FAQ />
        </main>
        <Footer />
      </div>
    </LazyMotion>
  )
}
