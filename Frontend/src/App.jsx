import { useState } from 'react'
import './App.css'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import CTA from './components/CTA'
import Footer from './components/Footer'

function App() {
  const [lightningOn, setLightningOn] = useState(true)

  const scrollToForm = () => {
    document.querySelector('.form-card').scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }

  const handleCtaClick = () => {
    setLightningOn(prev => !prev)
    scrollToForm()
  }

  return (
    <>
      <div className="bg-pattern"></div>
      <div className="grid-overlay"></div>

      <Nav onCtaClick={handleCtaClick} />
      <Hero lightningOn={lightningOn} />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <CTA onCtaClick={scrollToForm} />
      <Footer />
    </>
  )
}

export default App
