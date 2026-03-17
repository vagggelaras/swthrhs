import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from '../context/LanguageContext'
import './styles/ThemeToggle.css'

function ThemeToggle({ darkMode, onToggle }) {
  const { t } = useTranslation()

  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label={darkMode ? t('theme.lightMode') : t('theme.darkMode')}
    >
      <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
    </button>
  )
}

export default ThemeToggle
