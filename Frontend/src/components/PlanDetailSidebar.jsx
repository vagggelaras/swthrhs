import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import './styles/PlanDetailSidebar.css'

import idFront from '../assets/idFront.svg'
import idBack from '../assets/idBack.svg'
import powerMeter from '../assets/powerMeter.svg'
import billFront from '../assets/billFront.svg'
import billBack from '../assets/billBack.svg'
import deiLogo from '../assets/deiLogo.svg'
import enerwaveLogo from '../assets/enerwaveLogo.svg'
import eyniceLogo from '../assets/eyniceLogo.svg'
import hrwnLogo from '../assets/hrwnLogo.svg'
import protergiaLogo from '../assets/protergiaLogo.svg'
import zenithLogo from '../assets/zenithLogo.svg'

const PROVIDER_LOGOS = {
  'ΔΕΗ': deiLogo,
  'ENERWAVE': enerwaveLogo,
  'EUNICE': eyniceLogo,
  'ΗΡΩΝ': hrwnLogo,
  'PROTERGIA': protergiaLogo,
  'ΖΕΝΙΘ': zenithLogo,
}

function getProviderLogo(name) {
  if (!name) return null
  const upper = name.toUpperCase()
  for (const [key, logo] of Object.entries(PROVIDER_LOGOS)) {
    if (upper.includes(key) || key.includes(upper)) return logo
  }
  return null
}

const UploadIcon = () => (
  <svg className="upload-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)

function isImageFile(file) {
  if (file.type.startsWith('image/')) return true
  const ext = file.name.split('.').pop().toLowerCase()
  return ['png', 'jpg', 'jpeg'].includes(ext)
}

function FilePreviewItem({ file, onRemove }) {
  const url = useMemo(() => {
    if (!file || !isImageFile(file)) return null
    return URL.createObjectURL(file)
  }, [file])

  useEffect(() => {
    return () => { if (url) URL.revokeObjectURL(url) }
  }, [url])

  return (
    <div className="file-preview">
      {url && <img src={url} alt={file.name} className="file-preview-thumb" />}
      <span className="file-preview-name">{file.name}</span>
      <button type="button" className="file-preview-remove" onClick={onRemove} aria-label="Αφαίρεση">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}

function FilePreviewList({ files, field, onRemove }) {
  if (!files.length) return null
  return (
    <div className="file-preview-list">
      {files.map((file, i) => (
        <FilePreviewItem key={`${file.name}-${i}`} file={file} onRemove={() => onRemove(field, i)} />
      ))}
    </div>
  )
}

const SECTIONS = [
  { title: 'Στοιχεία Προγράμματος', step: 0 },
  { title: 'Καταχώρηση Στοιχείων', step: 1 },
  { title: 'Επισύναψη Αρχείων', step: 2 },
  { title: 'Υποβολή', step: 3 },
]

export default function PlanDetailSidebar({ isOpen, onClose, selectedPlan, formData, submissionId }) {
  const [activeStep, setActiveStep] = useState(0)
  const sectionRefs = useRef([])

  useEffect(() => {
    const el = sectionRefs.current[activeStep]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [activeStep])
  const [detailForm, setDetailForm] = useState({
    afm: '',
    doy: '',
    pagiaEntoli: false,
    allagiOnomatos: false,
    idpiothsia: '',
  })
  const [files, setFiles] = useState({
    tautotitaPiso: [],
    tautotitaMprosta: [],
    metritis: [],
    logariasmosPiso: [],
    logariasmosMprosta: [],
    misthotirio: [],
  })

  const isStep1Valid = detailForm.afm.trim() !== '' &&
    detailForm.doy.trim() !== '' &&
    detailForm.idpiothsia !== ''

  const isStep2Valid = files.tautotitaPiso.length > 0 &&
    files.tautotitaMprosta.length > 0 &&
    files.metritis.length > 0 &&
    files.logariasmosPiso.length > 0 &&
    files.logariasmosMprosta.length > 0 &&
    files.misthotirio.length > 0

  const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg']

  const handleFileChange = (field) => (e) => {
    const newFiles = Array.from(e.target.files || []).filter(f => ALLOWED_TYPES.includes(f.type))
    if (newFiles.length === 0) return
    setFiles(prev => ({ ...prev, [field]: [...prev[field], ...newFiles] }))
    e.target.value = ''
  }

  const removeFile = (field, index) => {
    setFiles(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }))
  }

  const handleNext = () => {
    if (activeStep === 1 && !isStep1Valid) return
    if (activeStep === 2 && !isStep2Valid) return
    if (activeStep < SECTIONS.length - 1) {
      setActiveStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1)
    }
  }

  const [submitting, setSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState(null)

  const uploadFiles = useCallback(async (fieldFiles, folder) => {
    const urls = []
    for (const file of fieldFiles) {
      const ext = file.name.split('.').pop()
      const path = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('uploads').upload(path, file)
      if (!error) {
        const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(path)
        urls.push(urlData.publicUrl)
      }
    }
    return urls
  }, [])

  const handleSubmit = useCallback(async () => {
    setSubmitting(true)
    setSubmitResult(null)
    try {
      const folder = submissionId || `${Date.now()}_${Math.random().toString(36).slice(2)}`

      const [
        logariasmosMprostaUrls, logariasmosPisoUrls,
        tautotitaMprostaUrls, tautotitaPisoUrls,
        metritisUrls, misthotirioUrls
      ] = await Promise.all([
        uploadFiles(files.logariasmosMprosta, `${folder}/logariasmos_mprosta`),
        uploadFiles(files.logariasmosPiso, `${folder}/logariasmos_piso`),
        uploadFiles(files.tautotitaMprosta, `${folder}/tautotita_mprosta`),
        uploadFiles(files.tautotitaPiso, `${folder}/tautotita_piso`),
        uploadFiles(files.metritis, `${folder}/metritis`),
        uploadFiles(files.misthotirio, `${folder}/misthotirio`),
      ])

      const updateData = {
        selected_plan: selectedPlan ? {
          provider: selectedPlan.provider,
          plan: selectedPlan.plan,
          tariff_type: selectedPlan.tariff_type,
          price_per_kwh: selectedPlan.price_per_kwh,
          night_price_per_kwh: selectedPlan.night_price_per_kwh,
          monthly_fee_eur: selectedPlan.monthly_fee_eur,
        } : null,
        detail_form: {
          afm: detailForm.afm,
          doy: detailForm.doy,
          pagia_entoli: detailForm.pagiaEntoli,
          allagi_onomatos: detailForm.allagiOnomatos,
          idpiothsia: detailForm.idpiothsia,
        },
        uploaded_files: {
          logariasmos_mprosta: logariasmosMprostaUrls,
          logariasmos_piso: logariasmosPisoUrls,
          tautotita_mprosta: tautotitaMprostaUrls,
          tautotita_piso: tautotitaPisoUrls,
          metritis: metritisUrls,
          misthotirio: misthotirioUrls,
        },
      }

      let error
      if (submissionId) {
        ({ error } = await supabase
          .from('submissions')
          .update(updateData)
          .eq('id', submissionId))
      } else {
        ({ error } = await supabase
          .from('submissions')
          .insert([{
            ...updateData,
            lead_info: {
              name: formData.name,
              phone: formData.phone,
              email: formData.email || null,
              region: formData.region,
              contact_time: formData.contact_time,
            },
            electricity_info: {
              customer_type: formData.customerType,
              night_tariff: formData.nightTariff,
              social_tariff: formData.socialTariff,
              current_provider: formData.provider,
              kwh_consumption: formData.kwhConsumption,
              night_kwh_consumption: formData.nightKwhConsumption,
            },
            submitted_at: new Date().toISOString(),
          }]))
      }

      if (error) throw error
      setSubmitResult('success')
    } catch (err) {
      console.error('Submit error:', err)
      setSubmitResult('error')
    } finally {
      setSubmitting(false)
    }
  }, [files, formData, selectedPlan, detailForm, submissionId, uploadFiles])

  const handleClose = () => {
    onClose()
  }

  return (
    <>
      {isOpen && <div className="detail-sidebar-backdrop" onClick={handleClose} />}

      <aside className={`detail-sidebar ${isOpen ? 'open' : ''}`}>
        {isOpen && (
          <button className="detail-sidebar-close-btn" type="button" onClick={handleClose} aria-label="Κλείσιμο">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}

        <div className="detail-sidebar-header">
          <h3>Επισύναψη Εγγράφων</h3>
        </div>

        <div className="detail-sidebar-inner">
        <div className="detail-sidebar-content">
          {SECTIONS.map(({ title, step }) => {
            const isActive = step === activeStep
            const isCompleted = step < activeStep
            const isLocked = step > activeStep

            return (
              <div
                key={step}
                ref={el => sectionRefs.current[step] = el}
                className={`detail-section ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`}
              >
                <div className="detail-section-header">
                  <div className="detail-section-step">
                    {isCompleted ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      step + 1
                    )}
                  </div>
                  <h4 className="detail-section-title">{title}</h4>
                </div>

                <div className="detail-section-body">
                  {step === 0 && selectedPlan && (
                    <div className="detail-plan-summary">
                      <div className="detail-plan-info">
                        <div className="detail-plan-row">
                          <span className="detail-plan-label">Υπηρεσία:</span>
                          <span className="detail-plan-value">{selectedPlan.tariff_type}</span>
                        </div>
                        <div className="detail-plan-row">
                          <span className="detail-plan-label">Όνομα πακέτου:</span>
                          <span className="detail-plan-value">{selectedPlan.plan}</span>
                        </div>
                        <div className="detail-plan-row">
                          <span className="detail-plan-label">Όνομα παρόχου:</span>
                          <span className="detail-plan-value">{selectedPlan.provider}</span>
                        </div>
                      </div>
                      <div className="detail-plan-logo">
                        {getProviderLogo(selectedPlan.provider) ? (
                          <img src={getProviderLogo(selectedPlan.provider)} alt={selectedPlan.provider} />
                        ) : (
                          <span className="detail-plan-logo-fallback">{selectedPlan.provider.charAt(0)}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="detail-form">
                      <div className="detail-form-subsection">
                        <h5 className="detail-form-subtitle">Προσωπικά Στοιχεία</h5>
                        <div className="detail-form-group">
                          <label>ΑΦΜ <span className="detail-required">*</span></label>
                          <input
                            type="text"
                            value={detailForm.afm}
                            onChange={(e) => setDetailForm(prev => ({ ...prev, afm: e.target.value }))}
                            placeholder="Εισάγετε ΑΦΜ"
                            required
                          />
                        </div>
                        <div className="detail-form-group">
                          <label>ΔΟΥ <span className="detail-required">*</span></label>
                          <input
                            type="text"
                            value={detailForm.doy}
                            onChange={(e) => setDetailForm(prev => ({ ...prev, doy: e.target.value }))}
                            placeholder="Εισάγετε ΔΟΥ"
                            required
                          />
                        </div>
                        <div className="detail-form-group detail-form-checkbox">
                          <label>
                            <input
                              type="checkbox"
                              checked={detailForm.pagiaEntoli}
                              onChange={(e) => setDetailForm(prev => ({ ...prev, pagiaEntoli: e.target.checked }))}
                            />
                            Πληρωμή με πάγια εντολή
                          </label>
                        </div>
                      </div>

                      <div className="detail-form-subsection">
                        <h5 className="detail-form-subtitle">Στοιχεία Παροχής Ρεύματος</h5>
                        <div className="detail-form-group detail-form-checkbox">
                          <label>
                            <input
                              type="checkbox"
                              checked={detailForm.allagiOnomatos}
                              onChange={(e) => setDetailForm(prev => ({ ...prev, allagiOnomatos: e.target.checked }))}
                            />
                            Αλλαγή στο όνομα έκδοσης λογαριασμού
                          </label>
                        </div>
                        <div className="detail-form-group">
                          <label>Ιδιότητα <span className="detail-required">*</span></label>
                          <div className="detail-form-options">
                            {['Ιδιοκτήτης', 'Διαχειριστής', 'Ενοικιαστής'].map(option => (
                              <button
                                key={option}
                                type="button"
                                className={`detail-form-option-btn ${detailForm.idpiothsia === option ? 'active' : ''}`}
                                onClick={() => setDetailForm(prev => ({ ...prev, idpiothsia: option }))}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="detail-form">
                      <div className="detail-form-subsection">
                        <h5 className="detail-form-subtitle">Τελευταίος Λογαριασμός</h5>
                        <div className="detail-upload-row">
                          <div className="detail-upload-col">
                            <label className={`detail-upload-card ${files.logariasmosMprosta.length ? 'has-file' : ''}`}>
                              <input type="file" accept=".pdf,.png,.jpg,.jpeg" multiple onChange={handleFileChange('logariasmosMprosta')} />
                              <img src={billFront} alt="Μπροστά όψη" className="detail-upload-card-icon" />
                              <span className="detail-upload-card-label">
                                <UploadIcon />Μπροστά όψη
                              </span>
                            </label>
                            <FilePreviewList files={files.logariasmosMprosta} field="logariasmosMprosta" onRemove={removeFile} />
                          </div>
                          <div className="detail-upload-col">
                            <label className={`detail-upload-card ${files.logariasmosPiso.length ? 'has-file' : ''}`}>
                              <input type="file" accept=".pdf,.png,.jpg,.jpeg" multiple onChange={handleFileChange('logariasmosPiso')} />
                              <img src={billBack} alt="Πίσω όψη" className="detail-upload-card-icon" />
                              <span className="detail-upload-card-label">
                                <UploadIcon />Πίσω όψη
                              </span>
                            </label>
                            <FilePreviewList files={files.logariasmosPiso} field="logariasmosPiso" onRemove={removeFile} />
                          </div>
                        </div>
                      </div>

                      <div className="detail-form-subsection">
                        <h5 className="detail-form-subtitle">Ταυτότητα / Διαβατήριο</h5>
                        <div className="detail-upload-row">
                          <div className="detail-upload-col">
                            <label className={`detail-upload-card ${files.tautotitaMprosta.length ? 'has-file' : ''}`}>
                              <input type="file" accept=".pdf,.png,.jpg,.jpeg" multiple onChange={handleFileChange('tautotitaMprosta')} />
                              <img src={idFront} alt="Μπροστά όψη" className="detail-upload-card-icon" />
                              <span className="detail-upload-card-label">
                                <UploadIcon />Μπροστά όψη
                              </span>
                            </label>
                            <FilePreviewList files={files.tautotitaMprosta} field="tautotitaMprosta" onRemove={removeFile} />
                          </div>
                          <div className="detail-upload-col">
                            <label className={`detail-upload-card ${files.tautotitaPiso.length ? 'has-file' : ''}`}>
                              <input type="file" accept=".pdf,.png,.jpg,.jpeg" multiple onChange={handleFileChange('tautotitaPiso')} />
                              <img src={idBack} alt="Πίσω όψη" className="detail-upload-card-icon" />
                              <span className="detail-upload-card-label">
                                <UploadIcon />Πίσω όψη
                              </span>
                            </label>
                            <FilePreviewList files={files.tautotitaPiso} field="tautotitaPiso" onRemove={removeFile} />
                          </div>
                        </div>
                      </div>

                      <div className="detail-form-subsection">
                        <h5 className="detail-form-subtitle">Μετρητής</h5>
                        <label className={`detail-upload-card ${files.metritis.length ? 'has-file' : ''}`}>
                          <input type="file" accept=".pdf,.png,.jpg,.jpeg" multiple onChange={handleFileChange('metritis')} />
                          <img src={powerMeter} alt="Μετρητής" className="detail-upload-card-icon" />
                          <span className="detail-upload-card-label">
                            <UploadIcon />Φωτογραφία μετρητή & ενδείξεων
                          </span>
                        </label>
                        <FilePreviewList files={files.metritis} field="metritis" onRemove={removeFile} />
                      </div>

                      <div className="detail-form-subsection">
                        <h5 className="detail-form-subtitle">
                          {detailForm.idpiothsia === 'Ιδιοκτήτης' ? 'Ε9' : 'Μισθωτήριο'}
                        </h5>
                        <div className="detail-upload-field">
                          <label>
                            {detailForm.idpiothsia === 'Ιδιοκτήτης' ? 'Αρχείο Ε9' : 'Αρχείο μισθωτηρίου'} <span className="detail-required">*</span>
                          </label>
                          <label className={`detail-upload-btn ${files.misthotirio.length ? 'has-file' : ''}`}>
                            <input type="file" accept=".pdf,.png,.jpg,.jpeg" multiple onChange={handleFileChange('misthotirio')} />
                            <UploadIcon />Επιλογή αρχείου
                          </label>
                          <FilePreviewList files={files.misthotirio} field="misthotirio" onRemove={removeFile} />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="detail-submit-section">
                      {submitResult === 'success' ? (
                        <div className="detail-submit-success">
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                          </svg>
                          <p>Η αίτησή σου υποβλήθηκε επιτυχώς!</p>
                        </div>
                      ) : submitResult === 'error' ? (
                        <div className="detail-submit-error">
                          <p>Κάτι πήγε στραβά. Δοκίμασε ξανά.</p>
                          <button type="button" className="detail-next-btn" onClick={handleSubmit} disabled={submitting}>
                            {submitting ? 'Υποβολή...' : 'Δοκίμασε ξανά'}
                          </button>
                        </div>
                      ) : (
                        <div className="detail-submit-ready">
                          <p className="detail-submit-text">Είσαι έτοιμος! Πάτα υποβολή για να ολοκληρώσεις την αίτησή σου.</p>
                          <button type="button" className="detail-next-btn" onClick={handleSubmit} disabled={submitting}>
                            {submitting ? 'Υποβολή...' : 'Υποβολή Αίτησης'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {!isLocked && (
                    <div className="detail-section-actions">
                      {step > 0 && (
                        <button
                          className="detail-back-btn"
                          type="button"
                          onClick={handleBack}
                          disabled={!isActive}
                        >
                          Πίσω
                        </button>
                      )}
                      {step < SECTIONS.length - 1 && (
                        <div className="detail-next-wrapper">
                          <button
                            className="detail-next-btn"
                            type="button"
                            onClick={handleNext}
                            disabled={!isActive || (step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)}
                          >
                            Επόμενο
                          </button>
                          {isActive && ((step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)) && (
                            <span className="detail-next-tooltip">
                              {step === 1
                                ? 'Συμπλήρωσε όλα τα υποχρεωτικά πεδία (*)'
                                : 'Ανέβασε όλα τα απαιτούμενα αρχεία (*)'}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        </div>
      </aside>
    </>
  )
}
