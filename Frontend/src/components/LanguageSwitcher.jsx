import { useTranslation } from '../context/LanguageContext'
import './styles/LanguageSwitcher.css'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation()

  return (
    <button
      className="lang-switcher"
      onClick={() => setLocale(locale === 'el' ? 'en' : 'el')}
      aria-label={locale === 'el' ? 'Switch to English' : 'Αλλαγή σε Ελληνικά'}
    >
      {locale === 'el' ? 'EN' : 'ΕΛ'}
    </button>
  )
}
