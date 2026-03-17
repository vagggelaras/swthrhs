import { useTranslation } from '../context/LanguageContext'
import './styles/HowItWorks.css'

function HowItWorks() {
  const { t } = useTranslation()

  return (
    <section className="how-it-works" id="how-it-works" aria-label={t('howItWorks.ariaLabel')}>
      <div className="section-header">
        <h2>{t('howItWorks.heading')}</h2>
        <p>{t('howItWorks.description')}</p>
      </div>

      <div className="steps">
        <div className="step">
          <div className="step-number">1</div>
          <h3>{t('howItWorks.step1Title')}</h3>
          <p>{t('howItWorks.step1Desc')}</p>
        </div>

        <div className="step">
          <div className="step-number">2</div>
          <h3>{t('howItWorks.step2Title')}</h3>
          <p>{t('howItWorks.step2Desc')}</p>
        </div>

        <div className="step">
          <div className="step-number">3</div>
          <h3>{t('howItWorks.step3Title')}</h3>
          <p>{t('howItWorks.step3Desc')}</p>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
