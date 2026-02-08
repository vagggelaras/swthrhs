import { useMemo, useEffect } from 'react'
import './styles/PriceSidebar.css'

export default function PriceSidebar({ formData, setFormData, pricesData, isOpen, onToggle }) {
  const kWh = formData.kwhConsumption

  // Lock body scroll on mobile when sidebar is open
  useEffect(() => {
    if (isOpen && window.innerWidth <= 640) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const sortedPlans = useMemo(() => {
    if (!pricesData.length || kWh === 0) return []

    return pricesData
      .filter(plan => plan.price_per_kwh !== null)
      .map(plan => ({
        ...plan,
        monthlyCost: plan.price_per_kwh * kWh + (plan.monthly_fee_eur ?? 0)
      }))
      .sort((a, b) => a.monthlyCost - b.monthlyCost)
  }, [pricesData, kWh])

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && <div className="sidebar-backdrop" onClick={onToggle} />}

      {/* Floating toggle button */}
      <button className="sidebar-toggle-btn" onClick={onToggle} aria-label="Toggle price sidebar">
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        )}
      </button>

      {/* Sidebar panel */}
      <aside className={`price-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Σύγκριση Τιμών</h3>
          <label className="sidebar-slider-label">
            Μηνιαία κατανάλωση:
          </label>
          <div className="sidebar-kwh-input-row">
            <input
              type="number"
              min="0"
              max="5000"
              value={kWh}
              onChange={(e) => {
                const val = Math.max(0, Math.min(5000, Number(e.target.value) || 0))
                setFormData(prev => ({ ...prev, kwhConsumption: val }))
              }}
              className="sidebar-kwh-input"
            />
            <span className="sidebar-kwh-unit">kWh</span>
          </div>
          <input
            type="range"
            min="0"
            max="5000"
            step="50"
            value={kWh}
            onChange={(e) => setFormData(prev => ({ ...prev, kwhConsumption: Number(e.target.value) }))}
            className="kwh-slider"
          />
          <div className="slider-labels">
            <span>0</span>
            <span>2500</span>
            <span>5000 kWh</span>
          </div>
        </div>

        <div className="sidebar-content">
          {kWh === 0 ? (
            <div className="sidebar-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              <p>Μετακίνησε το slider παραπάνω για να δεις τιμές</p>
            </div>
          ) : (
            <div className="plans-list">
              {sortedPlans.map((plan, index) => (
                <div
                  key={`${plan.provider}-${plan.plan}-${index}`}
                  className={`plan-card ${index < 3 ? 'top-plan' : ''}`}
                >
                  <div className="plan-rank">#{index + 1}</div>
                  <div className="plan-info">
                    <span className="plan-provider">{plan.provider}</span>
                    <span className="plan-name">{plan.plan}</span>
                    <span className="plan-tariff">{plan.tariff_type}</span>
                  </div>
                  <div className="plan-cost">
                    <span className="cost-value">{plan.monthlyCost.toFixed(2)}&euro;</span>
                    <span className="cost-label">/μήνα</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
