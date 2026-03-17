import { useState } from 'react'
import { useTranslation } from '../context/LanguageContext'
import './styles/FAQ.css'

function FAQ() {
  const [activeFaq, setActiveFaq] = useState(null)
  const { t } = useTranslation()

  const handleFaqClick = (index) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  const faqData = [
    { question: t('faq.q1'), answer: t('faq.a1') },
    { question: t('faq.q2'), answer: t('faq.a2') },
    { question: t('faq.q3'), answer: t('faq.a3') },
    { question: t('faq.q4'), answer: t('faq.a4') },
  ]

  return (
    <section className="faq" id="faq" aria-label={t('faq.ariaLabel')}>
      <div className="section-header">
        <h2>{t('faq.heading')}</h2>
      </div>

      <div className="faq-list">
        {faqData.map((faq, index) => (
          <div key={index} className={`faq-item ${activeFaq === index ? 'active' : ''}`}>
            <button className="faq-question" onClick={() => handleFaqClick(index)}>
              <span>{faq.question}</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FAQ
