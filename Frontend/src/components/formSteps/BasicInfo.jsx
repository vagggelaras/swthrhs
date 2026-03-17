import { useTranslation } from '../../context/LanguageContext'

export default function BasiccInfo({formData, setFormData, throwError, setThrowError}) {
  const { t } = useTranslation()

  return (
            <>
            <div className="form-group">
                <label>{t('basicInfo.serviceType')}</label>
                <div className="button-group">
                    <button
                        type="button"
                        className={`option-btn ${formData.customerType === 'residential' ? 'active' : ''}`}
                        onClick={() => { setFormData(prev => ({ ...prev, customerType: 'residential' })); setThrowError(null) }}
                    >
                        <span className="option-text">{t('basicInfo.residential')}</span>
                    </button>
                    <button
                        type="button"
                        className={`option-btn ${formData.customerType === 'professional' ? 'active' : ''}`}
                        onClick={() => { setFormData(prev => ({ ...prev, customerType: 'professional' })); setThrowError(null) }}
                    >
                        <span className="option-text">{t('basicInfo.professional')}</span>
                    </button>
                </div>
            </div>

            {formData.customerType === 'professional' ? (
                <div className="form-group">
                    <label>{t('basicInfo.tariff')}</label>
                    <div className="button-group" style={{ flexDirection: 'column' }}>
                        {['Γ21', 'Γ22', 'Γ23'].map(tariff => (
                            <button
                                key={tariff}
                                type="button"
                                className={`option-btn ${formData.businessTariff === tariff ? 'active' : ''}`}
                                onClick={() => { setFormData(prev => ({ ...prev, businessTariff: tariff })); if(throwError === 'errors.businessTariff') setThrowError(null) }}
                            >
                                <span className="option-text">{tariff}</span>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    <div className="form-group">
                        <label>{t('basicInfo.nightTariff')}</label>
                        <div className="button-group">
                            <button
                                type="button"
                                className={`option-btn ${formData.nightTariff === 'yes' ? 'active' : ''}`}
                                onClick={() => { setFormData(prev => ({ ...prev, nightTariff: 'yes' })); if(throwError === 'errors.nightTariff') setThrowError(null) }}
                            >
                                <span className="option-text">{t('common.yes')}</span>
                            </button>
                            <button
                                type="button"
                                className={`option-btn ${formData.nightTariff === 'no' ? 'active' : ''}`}
                                onClick={() => { setFormData(prev => ({ ...prev, nightTariff: 'no' })); if(throwError === 'errors.nightTariff') setThrowError(null) }}
                            >
                                <span className="option-text">{t('common.no')}</span>
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>{t('basicInfo.socialTariff')}</label>
                        <div className="button-group">
                            <button
                                type="button"
                                className={`option-btn ${formData.socialTariff === 'yes' ? 'active' : ''}`}
                                onClick={() => { setFormData(prev => ({ ...prev, socialTariff: 'yes' })); if(throwError === 'errors.socialTariff') setThrowError(null) }}
                            >
                                <span className="option-text">{t('common.yes')}</span>
                            </button>
                            <button
                                type="button"
                                className={`option-btn ${formData.socialTariff === 'no' ? 'active' : ''}`}
                                onClick={() => { setFormData(prev => ({ ...prev, socialTariff: 'no' })); if(throwError === 'errors.socialTariff') setThrowError(null) }}
                            >
                                <span className="option-text">{t('common.no')}</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
