export default function BasiccInfo({formData, setFormData, throwError, setThrowError}) {
  return (
            <>
            <div className="form-group">
                <label>Τύπος παροχής</label>
                <div className="button-group">
                    <button
                        type="button"
                        className={`option-btn ${formData.customerType === 'residential' ? 'active' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, customerType: 'residential' }))}
                    >
                        <span className="option-text">Οικιακό</span>
                    </button>
                    <button
                        type="button"
                        className={`option-btn ${formData.customerType === 'professional' ? 'active' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, customerType: 'professional' }))}
                    >
                        <span className="option-text">Επαγγελματικό</span>
                    </button>
                </div>
            </div>

            {formData.customerType === 'professional' ? (
                <div className="form-group">
                    <label>Τιμολόγιο</label>
                    <div className="button-group" style={{ flexDirection: 'column' }}>
                        {['Γ21', 'Γ22', 'Γ23'].map(tariff => (
                            <button
                                key={tariff}
                                type="button"
                                className={`option-btn ${formData.businessTariff === tariff ? 'active' : ''}`}
                                onClick={() => setFormData(prev => ({ ...prev, businessTariff: tariff }))}
                            >
                                <span className="option-text">{tariff}</span>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    <div className="form-group">
                        <label>Έχετε νυχτερινό τιμολόγιο;</label>
                        <div className="button-group">
                            <button
                                type="button"
                                className={`option-btn ${formData.nightTariff === 'yes' ? 'active' : ''}`}
                                onClick={() => { setFormData(prev => ({ ...prev, nightTariff: 'yes' })); if(throwError?.includes('νυχτερινό')) setThrowError(null) }}
                            >
                                <span className="option-text">Ναι</span>
                            </button>
                            <button
                                type="button"
                                className={`option-btn ${formData.nightTariff === 'no' ? 'active' : ''}`}
                                onClick={() => { setFormData(prev => ({ ...prev, nightTariff: 'no' })); if(throwError?.includes('νυχτερινό')) setThrowError(null) }}
                            >
                                <span className="option-text">Όχι</span>
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Λαμβάνετε κοινωνικό τιμολόγιο;</label>
                        <div className="button-group">
                            <button
                                type="button"
                                className={`option-btn ${formData.socialTariff === 'yes' ? 'active' : ''}`}
                                onClick={() => { setFormData(prev => ({ ...prev, socialTariff: 'yes' })); if(throwError?.includes('κοινωνικό')) setThrowError(null) }}
                            >
                                <span className="option-text">Ναι</span>
                            </button>
                            <button
                                type="button"
                                className={`option-btn ${formData.socialTariff === 'no' ? 'active' : ''}`}
                                onClick={() => { setFormData(prev => ({ ...prev, socialTariff: 'no' })); if(throwError?.includes('κοινωνικό')) setThrowError(null) }}
                            >
                                <span className="option-text">Όχι</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}