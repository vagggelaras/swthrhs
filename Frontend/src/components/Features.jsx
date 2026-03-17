import { useEffect, useRef } from 'react'
import { useTranslation } from '../context/LanguageContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartBar, faHandHoldingDollar, faBullseye } from '@fortawesome/free-solid-svg-icons'
import './styles/Features.css'

const FEATURES = [
  { icon: faChartBar, titleKey: 'features.compareTitle', descKey: 'features.compareDesc', accent: 'blue' },
  { icon: faHandHoldingDollar, titleKey: 'features.noFeesTitle', descKey: 'features.noFeesDesc', accent: 'gold' },
  { icon: faBullseye, titleKey: 'features.personalizedTitle', descKey: 'features.personalizedDesc', accent: 'green' },
]

function Features() {
  const { t } = useTranslation()
  const gridRef = useRef(null)

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll('.feature-card')
    if (!cards?.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )

    cards.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="features" id="features" aria-label={t('features.ariaLabel')}>
      <div className="section-header">
        <h2>{t('features.heading')}</h2>
        <p>{t('features.description')}</p>
      </div>

      <div className="features-grid" ref={gridRef}>
        {FEATURES.map((f, i) => (
          <div key={i} className={`feature-card feature-accent-${f.accent}`} style={{ transitionDelay: `${i * 120}ms` }}>
            <div className="feature-icon-wrapper">
              <div className="feature-icon">
                <FontAwesomeIcon icon={f.icon} />
              </div>
            </div>
            <h3>{t(f.titleKey)}</h3>
            <p>{t(f.descKey)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features
