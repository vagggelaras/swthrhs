import { useTranslation } from '../context/LanguageContext'
import './styles/CTA.css'

function CTA({ onCtaClick }) {
  const { t } = useTranslation()

  return (
    <section className="cta-section" id="cta" aria-label={t('cta.ariaLabel')}>
      <div className="cta-box">
        <h2>{t('cta.heading')}</h2>
        <p>{t('cta.description')}</p>
        <button className="cta-btn" onClick={onCtaClick}>
          {t('cta.button')}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </section>
  )
}

export default CTA
