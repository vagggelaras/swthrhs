import { useTranslation } from '../../context/LanguageContext'

export default function SpecificInfo({ formData, setFormData, setThrowError, activeService }) {
    const { t } = useTranslation()

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <>
            <div className="form-group">
                <label htmlFor="name">{t('specificInfo.fullName')}</label>
                <input type="text" id="name" name="name" placeholder={t('specificInfo.namePlaceholder')} required value={formData.name} onChange={handleInputChange} />
            </div>

            <div className="form-group-row">
                <div className="form-group">
                    <label htmlFor="phone">{t('specificInfo.phone')}</label>
                    <input type="tel" id="phone" name="phone" placeholder="69xxxxxxxx" required pattern="[0-9]{10}" title={t('specificInfo.phoneTitle')} value={formData.phone} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="email">{t('specificInfo.email')}</label>
                    <input type="email" id="email" name="email" placeholder={t('specificInfo.emailPlaceholder')} required value={formData.email || ''} onChange={handleInputChange} />
                </div>
            </div>

            {(activeService === 'gas' || activeService === 'both') && (
                <div className="form-group">
                    <label htmlFor="region">{t('specificInfo.region')}</label>
                    <select id="region" name="region" required value={formData.region} onChange={handleInputChange}>
                        <option value="">{t('specificInfo.selectRegion')}</option>
                        <option value="attiki">{t('specificInfo.attiki')}</option>
                        <option value="thessaloniki">{t('specificInfo.thessaloniki')}</option>
                        <option value="patra">{t('specificInfo.patra')}</option>
                        <option value="larisa">{t('specificInfo.larisa')}</option>
                        <option value="other">{t('specificInfo.otherRegion')}</option>
                    </select>
                </div>
            )}

            <div className="form-group">
                <label htmlFor="contact_time">{t('specificInfo.callTime')}</label>
                <select id="contact_time" name="contact_time" value={formData.contact_time} onChange={handleInputChange} >
                    <option value="anytime">{t('specificInfo.anytime')}</option>
                    <option value="morning">{t('specificInfo.morning')}</option>
                    <option value="noon">{t('specificInfo.noon')}</option>
                    <option value="afternoon">{t('specificInfo.afternoon')}</option>
                    <option value="evening">{t('specificInfo.evening')}</option>
                </select>
            </div>
        </>
    )
}
