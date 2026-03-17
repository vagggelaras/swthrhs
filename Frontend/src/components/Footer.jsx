import { useTranslation } from '../context/LanguageContext'
import './styles/Footer.css'

function Footer() {
  const { t } = useTranslation()

  return (
    <footer aria-label={t('footer.ariaLabel')}>
      <div className="footer-content">
        <a href="#" className="logo">
          <div className="logo-icon">⚡</div>
          EnergyCompare
        </a>
        <div className="footer-links">
          <a href="#">{t('footer.terms')}</a>
          <a href="#">{t('footer.privacy')}</a>
          <a href="#">{t('footer.contact')}</a>
        </div>
        <p className="footer-copy">{t('footer.copyright')}</p>
      </div>
    </footer>
  )
}

export default Footer
