import { useTranslation } from '../context/LanguageContext'
import ContactForm from './ContactForm'
import './styles/Hero.css'

function Hero({ formData, setFormData, onFormSubmit, providersData, pricesData, activeService, setActiveService }) {
  const { t } = useTranslation()

  return (
      <section className="hero" id="hero" aria-label={t('hero.ariaLabel')}>
        <div className="hero-content">
          <div className="hero-text-top">
            <div className="badge">{t('hero.badge')}</div>
            <h1>{t('hero.headingBefore')} <span>40%</span> {t('hero.headingAfter')}</h1>
          </div>

          <div className="hero-text-bottom">
            <p className="hero-description">
              {t('hero.description')}
            </p>
            <div className="trust-badges">
              <div className="trust-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                {t('hero.free')}
              </div>
              <div className="trust-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                {t('hero.customers')}
              </div>
              <div className="trust-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                {t('hero.allProviders')}
              </div>
            </div>
          </div>

          <ContactForm formData={formData} setFormData={setFormData} onFormSubmit={onFormSubmit} providersData={providersData} pricesData={pricesData} activeService={activeService} setActiveService={setActiveService} />
        </div>
      </section >
  )
}

export default Hero
