import { useState } from 'react'
import SpecificInfo from './formSteps/SpecificInfo'
import BasicInfo from './formSteps/BasicInfo'
import ProviderInfo from './formSteps/ProviderInfo'
import './styles/ContactForm.css'

export default function ContactForm() {
    const [activeService, setActiveService] = useState('electricity')
    const [basicInfo, setBasicInfo] = useState({})
    const [throwError, setThrowError] = useState()
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        region: '',
        contact_time: 'anytime',
        customerType: 'residential',
        nightTariff: '',
        socialTariff: '',
        provider: ''
    })

    const handleToggle = (service) => {
        setActiveService(service)
    }

    

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = {
            service: activeService,
            ...formData
        }
        console.log('Form submitted:', data)
        alert('Ευχαριστούμε! Θα σε καλέσουμε σύντομα.')
    }

    const handleNext = () => {
        setThrowError(null)
        if (step === 1 ){

            if ((activeService === 'electricity' || activeService === 'both')){
                if(!formData.nightTariff){
                    setThrowError('Παρακαλώ επιλέξτε εάν έχετε νυχτερινό τιμολόγιο ή όχι.')
                    return
                }

                if(!formData.socialTariff){
                    setThrowError('Παρακαλώ επιλέξτε εάν λαμβάνετε κοινωνικό τιμολόγιο ή όχι.')
                    return
                }

                setBasicInfo({
                    service: activeService,
                    customerType: formData.customerType,
                    nightTariff: formData.nightTariff,
                    socialTariff: formData.socialTariff
                })
                
                setStep(2)
            }

        } else if (step === 2){
            if ((activeService === 'electricity' || activeService === 'both')) {
            
                if (!formData.provider) {
                    setThrowError('Παρακαλώ επιλέξτε πάροχο.')
                    return
                }

                setStep(3)

            }
        }
    }

    return (
        <div className={`form-card${step === 3 ? ' form-card-expanded' : ''}`}>
            <div className="form-header">
                <h2>Λάβε Δωρεάν Προσφορά</h2>
                <p>Συμπλήρωσε τα στοιχεία σου και θα σε καλέσουμε</p>
            </div>

            <form id="leadForm" onSubmit={handleSubmit}>
                <div className="service-toggle">
                    <button
                        type="button"
                        className={`toggle-btn ${activeService === 'electricity' ? 'active' : ''}`}
                        onClick={() => handleToggle('electricity')}
                    >
                        ⚡ Ρεύμα
                    </button>
                    <button
                        type="button"
                        className={`toggle-btn ${activeService === 'gas' ? 'active' : ''}`}
                        onClick={() => handleToggle('gas')}
                    >
                        🔥 Φ. Αέριο
                    </button>
                    <button
                        type="button"
                        className={`toggle-btn ${activeService === 'both' ? 'active' : ''}`}
                        onClick={() => handleToggle('both')}
                    >
                        ✨ Και τα δύο
                    </button>
                </div>

                {(activeService === 'electricity' || activeService === 'both') && step === 1 && (
                    <BasicInfo formData={formData} setFormData={setFormData} throwError={throwError} setThrowError={setThrowError} />
                )}

                {(activeService === 'electricity' || activeService === 'both') && step === 2 && (
                    <ProviderInfo setFormData={setFormData} throwError={throwError} setThrowError={setThrowError} />
                )}

                {(activeService === 'electricity' || activeService === 'both') && step === 3 && (
                    <SpecificInfo formData={formData} setFormData={setFormData} setThrowError={setThrowError} />
                )}

                <div className={throwError ? "error-container" : "error-container hidden"}>
                    <p className="error-message">{throwError}‎ </p>
                </div>

                <button type="button" onClick={handleNext} className="next-btn">
                    <i className="fa-solid fa-arrow-right fa-xl"></i>
                </button>

            </form>

            <p className="form-footer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Τα στοιχεία σου είναι ασφαλή
            </p>
        </div>    
    )
}