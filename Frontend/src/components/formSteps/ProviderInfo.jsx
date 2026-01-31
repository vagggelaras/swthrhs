import { useState } from 'react'

export default function ProviderInfo({ setFormData, throwError, setThrowError }) {
    const [selected, setSelected] = useState('')

    const handleSelect = (provider) => {
        setSelected(provider)
        setFormData(prev => ({ ...prev, provider }))
        if(throwError?.includes('πάροχο')) setThrowError(null)
    }

    const providers = [
        { id: 'dei', src: '/deiLogo.svg', alt: 'ΔΕΗ' },
        { id: 'enerwave', src: '/enerwaveLogo.svg', alt: 'Enerwave' },
        { id: 'eynice', src: '/eyniceLogo.svg', alt: 'Eynice' },
        { id: 'hron', src: '/hrwnLogo.svg', alt: 'Ήρων' },
        { id: 'protergia', src: '/protergiaLogo.svg', alt: 'Protergia' },
        { id: 'zenith', src: '/zenithLogo.svg', alt: 'Zenith' }
    ]

    return (
        <div className="providerInfoContainer">
            {providers.map(provider => (
                <img
                    key={provider.id}
                    src={provider.src}
                    alt={provider.alt}
                    className={selected === provider.id ? 'selected' : ''}
                    onClick={() => handleSelect(provider.id)}
                    style={{width:'100px', height:'100px'}}
                />
            ))}
        </div>
    )
}   