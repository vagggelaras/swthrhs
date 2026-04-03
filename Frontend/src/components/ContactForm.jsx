import { useState, lazy, Suspense } from 'react'
import { useTranslation } from '../context/LanguageContext'
import SpecificInfo from './formSteps/SpecificInfo'
import BasicInfo from './formSteps/BasicInfo'
import ProviderInfo from './formSteps/ProviderInfo'
import Lightning from './LighitngBackground'
import './styles/ContactForm.css'

const LiquidEther = lazy(() => import('./LiquidEther'))

const GAS_COLORS = ['#00b64c', '#00d8cd', '#90E0EF']
const GAS_STYLE = { position: 'absolute' }

export default function ContactForm({ formData, setFormData, onFormSubmit, providersData, pricesData, activeService, setActiveService }) {
    const { t } = useTranslation()
    const [toggleOpen, setToggleOpen] = useState(false)
    const [basicInfo, setBasicInfo] = useState({})
    const [throwError, setThrowError] = useState()
    const [step, setStep] = useState(1)
    const [honeypot, setHoneypot] = useState('')

    const handleToggle = (service, isActive) => {
        if (isActive) {
            setToggleOpen(!toggleOpen)
        } else {
            setActiveService(service)
            setToggleOpen(false)
            setStep(1)
            setThrowError(null)
            setFormData(prev => ({
                ...prev,
                customerType: 'residential',
                businessTariff: '',
                nightTariff: '',
                socialTariff: '',
                provider: '',
                kwhConsumption: 140,
                nightKwhConsumption: 0,
                region: '',
            }))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setThrowError(null)

        // Honeypot: bots fill hidden fields, humans don't
        if (honeypot) return

        if (!formData.name || !formData.name.trim() || formData.name.trim().length > 255) {
            setThrowError('errors.name')
            return
        }
        if (!formData.phone || !/^[0-9]{10}$/.test(formData.phone)) {
            setThrowError('errors.phone')
            return
        }
        if (!formData.email || formData.email.length > 320 || !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
            setThrowError('errors.email')
            return
        }

        onFormSubmit?.()
    }

    const handleBack = () => {
        setThrowError(null)
        if (step > 1) {
            setStep(step - 1)
        }
    }

    const handleNext = () => {
        setThrowError(null)
        if (step === 1) {
            if (formData.customerType === 'professional') {
                if (!formData.businessTariff) {
                    setThrowError('errors.businessTariff')
                    return
                }
            } else {
                if (!formData.nightTariff) {
                    setThrowError('errors.nightTariff')
                    return
                }

                if (!formData.socialTariff) {
                    setThrowError('errors.socialTariff')
                    return
                }
            }

            setBasicInfo({
                service: activeService,
                customerType: formData.customerType,
                nightTariff: formData.nightTariff,
                socialTariff: formData.socialTariff
            })

            setStep(2)
        } else if (step === 2) {
            if (!formData.provider) {
                setThrowError('errors.provider')
                return
            }

            setStep(3)
        }
    }

    return (
        <div className="form-card">
            {activeService === 'electricity' && (
                <Lightning hue={260} xOffset={0} speed={0.5} intensity={0.6} size={2} />
            )}
            {activeService === 'gas' && (
                <Suspense fallback={null}><LiquidEther
                    className="ether-background"
                    style={GAS_STYLE}
                    colors={GAS_COLORS}
                    mouseForce={10}
                    cursorSize={80}
                    isViscous
                    viscous={30}
                    iterationsViscous={32}
                    iterationsPoisson={32}
                    resolution={0.5}
                    isBounce={true}
                    autoDemo
                    autoSpeed={0.9}
                    autoIntensity={3}
                    takeoverDuration={0.25}
                    autoResumeDelay={0}
                    autoRampDuration={0.6}
                    disableMouse
                /></Suspense>
            )}
            <div className="form-content">
                <div className="form-header">
                    <h2>{t('form.heading')}</h2>
                    <p>{t('form.subheading')}</p>
                </div>

            <form id="leadForm" onSubmit={handleSubmit}>
                {/* Honeypot field — invisible to users, bots fill it automatically */}
                <input
                    type="text"
                    name="website"
                    value={honeypot}
                    onChange={e => setHoneypot(e.target.value)}
                    autoComplete="off"
                    tabIndex={-1}
                    aria-hidden="true"
                    style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
                />
                <div className={`service-toggle ${toggleOpen ? 'open' : ''}`}>
                    <button
                        type="button"
                        className={`toggle-btn ${activeService === 'electricity' ? 'active' : ''}`}
                        onClick={() => handleToggle('electricity', activeService === 'electricity')}
                    >
                            {t('common.electricity')}
                        <svg className="toggle-arrow" width="12" height="12" viewBox="0 0 320 512" fill="currentColor"><path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9S303 192 288 192H32c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/></svg>
                    </button>
                    <button
                        type="button"
                        className={`toggle-btn ${activeService === 'gas' ? 'active' : ''}`}
                        onClick={() => handleToggle('gas', activeService === 'gas')}
                    >
                        {t('common.gas')}
                        <svg className="toggle-arrow" width="12" height="12" viewBox="0 0 320 512" fill="currentColor"><path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9S303 192 288 192H32c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/></svg>
                    </button>
                    <button
                        type="button"
                        className={`toggle-btn ${activeService === 'both' ? 'active' : ''}`}
                        onClick={() => handleToggle('both', activeService === 'both')}
                    >
                        {t('common.both')}
                        <svg className="toggle-arrow" width="12" height="12" viewBox="0 0 320 512" fill="currentColor"><path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9S303 192 288 192H32c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/></svg>
                    </button>
                </div>

                <div className="step-indicator">
                    <div className="step-text">{t('form.step')} {step}/3</div>
                    <div className="step-bar">
                        <div className="step-bar-fill" style={{ transform: `scaleX(${step / 3})` }} />
                    </div>
                </div>

                <div className="form-step-content">
                    {step === 1 && (
                        <BasicInfo formData={formData} setFormData={setFormData} throwError={throwError} setThrowError={setThrowError} />
                    )}

                    {step === 2 && (
                        <>
                            <div className="step-title">{t('form.currentProvider')}</div>
                            <ProviderInfo formData={formData} setFormData={setFormData} throwError={throwError} setThrowError={setThrowError} activeService={activeService} providersData={providersData} pricesData={pricesData} />
                        </>
                    )}

                    {step === 3 && (
                        <SpecificInfo formData={formData} setFormData={setFormData} setThrowError={setThrowError} activeService={activeService} />
                    )}
                </div>

                <div className={throwError ? "error-container" : "error-container hidden"}>
                    <p className="error-message">{throwError ? t(throwError) : ''}‎ </p>
                </div>

                <div className="form-buttons">
                    {step > 1 && (
                        <button type="button" onClick={handleBack} className="back-btn" aria-label="Προηγούμενο βήμα">
                            <svg width="16" height="16" viewBox="0 0 448 512" fill="currentColor"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H109.2l105.4-105.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
                        </button>
                    )}
                    <button type={step === 3 ? 'submit' : 'button'} onClick={step !== 3 ? handleNext : undefined} className="next-btn" aria-label={step !== 3 ? 'Επόμενο βήμα' : undefined}>
                        {step !== 3 ? <svg width="20" height="20" viewBox="0 0 448 512" fill="currentColor"><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h306.7L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg> : t('form.callMe')}
                    </button>
                </div>

            </form>

            <p className="form-footer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                {t('form.secureInfo')}
            </p>
            </div>
        </div>
    )
}
