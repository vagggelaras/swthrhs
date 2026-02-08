import { useState, useEffect } from 'react'
import './App.css'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import CTA from './components/CTA'
import Footer from './components/Footer'
import ThemeToggle from './components/ThemeToggle'
import PriceSidebar from './components/PriceSidebar'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved !== null ? JSON.parse(saved) : true
  })

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    region: '',
    contact_time: 'anytime',
    customerType: 'residential',
    businessTariff: '',
    nightTariff: '',
    socialTariff: '',
    provider: '',
    kwhConsumption: 0
  })

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [pricesData, setPricesData] = useState([])

  useEffect(() => {
    fetch('/data/prices.json')
      .then(res => res.json())
      .then(data => setPricesData(data))
      .catch(err => console.error('Failed to load prices:', err))
  }, [])

  useEffect(() => {
    document.body.classList.toggle('light-mode', !darkMode)
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  const scrollToForm = () => {
    document.querySelector('.form-card').scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }

  const handleCtaClick = () => {
    scrollToForm()
  }

  return (
    <>
      <div className="bg-pattern"></div>
      <div className="grid-overlay"></div>

      <Nav onCtaClick={handleCtaClick} />
      <Hero formData={formData} setFormData={setFormData} />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <CTA onCtaClick={scrollToForm} />
      <Footer />
      <PriceSidebar
        formData={formData}
        setFormData={setFormData}
        pricesData={pricesData}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(prev => !prev)}
      />
      <ThemeToggle darkMode={darkMode} onToggle={() => setDarkMode(prev => !prev)} />
    </>
  )
}

export default App
