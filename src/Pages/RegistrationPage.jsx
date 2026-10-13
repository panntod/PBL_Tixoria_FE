import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Check } from 'lucide-react'
import EventCover from '../components/EventCover'
import { BlockSkeleton, ErrorState } from '../components/States'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { formatDate, isValidEmail, rupiah } from '../lib/format'
import { createRegistration, getEvent } from '../lib/services'

const STEPS = ['Pilih tiket', 'Data peserta', 'Pembayaran', 'Selesai']
const PAY_METHODS = [
  ['va', 'Transfer virtual account', 'BCA, BNI, Mandiri, BRI'],
  ['qris', 'QRIS', 'Semua aplikasi dompet digital dan m-banking'],
  ['ewallet', 'Dompet digital', 'GoPay, OVO, DANA, ShopeePay'],
]

function Stepper({ current }) {
  return (
    <ol className="stepper" aria-label="Langkah pendaftaran" style={{ listStyle: 'none', padding: 0 }}>
      {STEPS.map((label, i) => {
        const state = i < current ? 'done' : i === current ? 'current' : ''
        return (
          <li key={label} className={`step ${state}`} aria-current={state === 'current' ? 'step' : undefined}>
            <i>{state === 'done' ? <Check size={12} /> : i + 1}</i>
            {label}
          </li>
        )
      })}
    </ol>
  )
}

export default function RegistrationPage() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()

  const { data: event, isLoading, isError, refetch } = useQuery({ queryKey: ['event', id], queryFn: () => getEvent(id) })

  const [step, setStep] = useState('data') // 'data' | 'bayar'
  const [form, setForm] = useState({
    nama: user?.nama || '',
    email: user?.email || '',
    whatsapp: user?.whatsapp || '',
    institusi: user?.institusi || '',
  })
  const [touched, setTouched] = useState({})
  const [agree, setAgree] = useState(false)
  const [method, setMethod] = useState('va')
  const [saving, setSaving] = useState(false)

  if (isLoading) {
    return (
      <div className="page">
        <div className="container">
          <BlockSkeleton height={320} />
        </div>
      </div>
    )
  }
  if (isError || !event) {
    return (
      <div className="page">
        <div className="container container-md">
          <ErrorState title="Acara tidak dapat dimuat" onRetry={refetch} />
        </div>
      </div>
    )
  }

  const ticket = event.tickets.find((t) => t.id === params.get('ticket'))
  const qty = Math.max(1, Number(params.get('qty')) || 1)
  const closed = event.status === 'selesai' || event.status === 'dibatalkan'
  if (!ticket || closed || ticket.seats < 1) return <Navigate to={`/events/${event.id}`} replace />

  const total = ticket.price * qty
  const isFree = total === 0

  const errors = {
    nama: form.nama.trim() ? '' : 'Isi nama lengkap Anda.',
    email: isValidEmail(form.email) ? '' : 'Lengkapi alamat surel Anda.',
    whatsapp: form.whatsapp.replace(/\D/g, '').length >= 9 ? '' : 'Isi nomor WhatsApp yang aktif.',
  }
  const hasErrors = Object.values(errors).some(Boolean)
  const show = (key) => touched[key] && errors[key]
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const blur = (key) => () => setTouched((t) => ({ ...t, [key]: true }))

  async function finish() {
    setSaving(true)
    try {
      const reg = await createRegistration({ event, ticket, qty, participant: form })
      navigate(`/registrations/${reg.orderNo}/success`, { replace: true })
    } catch {
      toast('Pendaftaran gagal. Coba lagi.', 'error')
      setSaving(false)
    }
  }

  function submitData(e) {
    e.preventDefault()
    setTouched({ nama: true, email: true, whatsapp: true })
    if (hasErrors || !agree) return
    if (isFree) finish()
    else setStep('bayar')
  }

  const currentIndex = step === 'data' ? 1 : 2

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Pendaftaran</h1>
        <Stepper current={currentIndex} />

        <div className="wizard-grid">
          <div>
            {step === 'data' ? (
              <form onSubmit={submitData} noValidate>
                <div className="card card-pad">
                  <h2>Data peserta</h2>
                  <div className="form-grid" style={{ marginTop: 18 }}>
                    <div className="field">
                      <label htmlFor="nama">Nama lengkap</label>
                      <input id="nama" className={`input ${show('nama') ? 'invalid' : ''}`} value={form.nama} onChange={set('nama')} onBlur={blur('nama')} autoComplete="name" />
                      {show('nama') && <span className="error-text">{errors.nama}</span>}
                    </div>
                    <div className="field">
                      <label htmlFor="email">Surel</label>
                      <input id="email" type="email" className={`input ${show('email') ? 'invalid' : ''}`} value={form.email} onChange={set('email')} onBlur={blur('email')} autoComplete="email" />
                      {show('email') && <span className="error-text">{errors.email}</span>}
                    </div>
                    <div className="field">
                      <label htmlFor="wa">Nomor WhatsApp</label>
                      <input id="wa" type="tel" className={`input ${show('whatsapp') ? 'invalid' : ''}`} value={form.whatsapp} onChange={set('whatsapp')} onBlur={blur('whatsapp')} autoComplete="tel" />
                      {show('whatsapp') && <span className="error-text">{errors.whatsapp}</span>}
                    </div>
                    <div className="field">
                      <label htmlFor="inst">Institusi</label>
                      <input id="inst" className="input" value={form.institusi} onChange={set('institusi')} placeholder="Nama kampus atau instansi" />
                    </div>
                  </div>
                </div>

                <label className="check" style={{ margin: '20px 0' }}>
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                  <span>Data yang saya isi sudah benar dan saya menyetujui Syarat &amp; ketentuan.</span>
                </label>

                <div className="wizard-actions" style={{ marginTop: 0 }}>
                  <Link to={`/events/${event.id}`} className="btn btn-outline btn-lg">
                    Kembali
                  </Link>
                  <button type="submit" className="btn btn-primary btn-lg" disabled={!agree || saving}>
                    {isFree ? 'Daftar gratis' : `Bayar ${rupiah(total)}`}
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="card card-pad">
                  <h2>Pembayaran</h2>
                  <p className="muted" style={{ margin: '6px 0 16px', fontSize: 13 }}>
                    Pilih metode pembayaran. Tiket terbit setelah pembayaran berhasil.
                  </p>
                  <div className="stack" style={{ gap: 10 }}>
                    {PAY_METHODS.map(([key, name, hint]) => (
                      <label key={key} className="pay-opt">
                        <input type="radio" name="method" checked={method === key} onChange={() => setMethod(key)} />
                        <span>
                          {name}
                          <small>{hint}</small>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="wizard-actions">
                  <button type="button" className="btn btn-outline btn-lg" onClick={() => setStep('data')}>
                    Kembali
                  </button>
                  <button type="button" className="btn btn-primary btn-lg" disabled={saving} onClick={finish}>
                    {saving ? 'Memproses…' : `Bayar ${rupiah(total)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          <aside className="card summary" aria-label="Ringkasan pesanan">
            <EventCover theme={event.theme} variant="summary" title={event.coverLabel.replace(/\n/g, ' ')} />
            <h3>{event.title}</h3>
            <p className="meta">
              {formatDate(event.date)} · {event.location}
            </p>
            <hr />
            <div className="sum-row">
              <span>
                Tiket {ticket.name} × {qty}
              </span>
              <span>{rupiah(total)}</span>
            </div>
            <div className="sum-total">
              <span>Total</span>
              <span>{rupiah(total)}</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
