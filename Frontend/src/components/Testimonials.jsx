import { useEffect, useRef } from 'react'
import { useTranslation } from '../context/LanguageContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faQuoteLeft } from '@fortawesome/free-solid-svg-icons'
import './styles/Testimonials.css'

const TESTIMONIALS = [
  { quoteKey: 'testimonials.t1Quote', nameKey: 'testimonials.t1Name', initialsKey: 'testimonials.t1Initials', locationKey: 'testimonials.t1Location', accent: 'blue' },
  { quoteKey: 'testimonials.t2Quote', nameKey: 'testimonials.t2Name', initialsKey: 'testimonials.t2Initials', locationKey: 'testimonials.t2Location', accent: 'gold' },
  { quoteKey: 'testimonials.t3Quote', nameKey: 'testimonials.t3Name', initialsKey: 'testimonials.t3Initials', locationKey: 'testimonials.t3Location', accent: 'green' },
]

function Testimonials() {
  const { t } = useTranslation()
  const gridRef = useRef(null)

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll('.testimonial-card')
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
    <section className="testimonials" id="testimonials" aria-label={t('testimonials.ariaLabel')}>
      <div className="section-header">
        <h2>{t('testimonials.heading')}</h2>
        <p>{t('testimonials.description')}</p>
      </div>

      <div className="testimonials-grid" ref={gridRef}>
        {TESTIMONIALS.map((item, i) => (
          <div key={i} className={`testimonial-card testimonial-accent-${item.accent}`} style={{ transitionDelay: `${i * 120}ms` }}>
            <div className="testimonial-quote-icon">
              <FontAwesomeIcon icon={faQuoteLeft} />
            </div>
            <div className="stars">
              {[...Array(5)].map((_, j) => (
                <FontAwesomeIcon key={j} icon={faStar} />
              ))}
            </div>
            <blockquote>{t(item.quoteKey)}</blockquote>
            <div className="testimonial-author">
              <div className="author-avatar">{t(item.initialsKey)}</div>
              <div className="author-info">
                <strong>{t(item.nameKey)}</strong>
                <span>{t(item.locationKey)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Testimonials
