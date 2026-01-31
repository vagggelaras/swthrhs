import './styles/Nav.css'

function Nav({ onCtaClick }) {
  return (
    <nav>
      <div className="nav-content">
        <a href="#" className="logo">
          <div className="logo-icon">⚡</div>
          EnergyCompare
        </a>
        <button className="nav-cta" onClick={onCtaClick}>
          Ζήτα Προσφορά
        </button>
      </div>
    </nav>
  )
}

export default Nav
