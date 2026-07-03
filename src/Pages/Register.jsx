import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Chart from 'chart.js/auto'
import api from '../Api'
import '../Style/Register.css'

const MONTHLY_DATA = {
  labels:  ['Jan','Feb','Mar','Apr','May','Jun'],
  income:  [42000,48000,38000,55000,51000,53500],
  expense: [28000,31000,25000,38000,29000,31200],
}

function fmt(n) {
  return '₹' + Math.round(n).toLocaleString('en-IN')
}

function passwordStrength(pw) {
  let score = 0
  if (pw.length >= 8)            score++
  if (/[A-Z]/.test(pw))         score++
  if (/[0-9]/.test(pw))         score++
  if (/[^A-Za-z0-9]/.test(pw))  score++
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['', 'weak', 'fair', 'good', 'strong']
  return { score, label: labels[score] || 'Weak', cls: colors[score] || 'weak' }
}

export default function Register() {
  const navigate   = useNavigate()
  const chartRef   = useRef(null)
  const chartInst  = useRef(null)

  const [name,     setName]     = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [agreed,   setAgreed]   = useState(false)
  const [showPw,   setShowPw]   = useState(false)
  const [showCpw,  setShowCpw]  = useState(false)
  const [errors,   setErrors]   = useState({})
  const [apiErr,   setApiErr]   = useState('')
  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState(false)

  const pwStrength = password ? passwordStrength(password) : null

  useEffect(() => {
    if (!chartRef.current) return
    if (chartInst.current) chartInst.current.destroy()
    chartInst.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: MONTHLY_DATA.labels,
        datasets: [
          {
            label: 'Income',
            data: MONTHLY_DATA.income,
            backgroundColor: '#6366f1',
            borderRadius: 5,
            borderSkipped: false,
            barPercentage: 0.45,
          },
          {
            label: 'Expense',
            data: MONTHLY_DATA.expense,
            backgroundColor: '#c5c8d4',
            borderRadius: 5,
            borderSkipped: false,
            barPercentage: 0.45,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: c => ' ' + fmt(c.raw) },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { family: 'Inter', size: 11 }, color: '#8b90ad' },
          },
          y: {
            grid: { color: 'rgba(197,200,212,.35)' },
            border: { dash: [4, 4], display: false },
            ticks: {
              font: { family: 'Inter', size: 10 },
              color: '#8b90ad',
              callback: v => '₹' + Math.round(v / 1000) + 'k',
            },
            beginAtZero: true,
          },
        },
      },
    })
    return () => chartInst.current?.destroy()
  }, [])

  function validate() {
    const e = {}
    if (!name.trim())                      e.name     = 'Full name is required'
    if (!username.trim())                  e.username = 'Username is required'
    if (password.length < 4)              e.password = 'Password must be at least 4 characters'
    if (confirm !== password)             e.confirm  = 'Passwords do not match'
    if (!agreed)                           e.terms    = 'Please accept the terms to continue'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    setApiErr('')
    if (!validate()) return
    setLoading(true)
    try {
      await api.post('accounts/register/', { name:name, username:username, password:password,password2:confirm })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 1400)
    } catch (err) {
      console.log(err.response.data);
      const msg = err?.response?.data?.detail
        || err?.response?.data?.username?.[0]
        || 'Registration failed. Please try again.'
      setApiErr(msg)
    } finally {
      setLoading(false)
    }
  }

  function clearFieldErr(field) {
    setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
    setApiErr('')
  }

  return (
    <div className="rg-page">
      <div className="rg-layout">

        {/* ══ LEFT — Chart panel ══ */}
        <div className="rg-left">
          <div className="rg-brand">
            <div className="rg-brand-ico">
              <i className="ti ti-wallet" aria-hidden="true" />
            </div>
            <span className="rg-brand-name">Fintrack</span>
          </div>

          <div className="rg-headline">
            Smart <span>money management</span><br />starts here
          </div>

          <div className="rg-stat-row">
            <div className="rg-stat">
              <div className="rg-stat__lbl">Income</div>
              <div className="rg-stat__val rg-stat__val--income">₹53.5k</div>
            </div>
            <div className="rg-stat">
              <div className="rg-stat__lbl">Expense</div>
              <div className="rg-stat__val rg-stat__val--expense">₹31.2k</div>
            </div>
            <div className="rg-stat">
              <div className="rg-stat__lbl">Saved</div>
              <div className="rg-stat__val rg-stat__val--accent">₹22.3k</div>
            </div>
          </div>

          <div className="rg-chart-card">
            <div className="rg-chart-head">
              <span className="rg-chart-title">Monthly overview</span>
              <div className="rg-legend">
                <div className="rg-leg-item">
                  <span className="rg-leg-dot" style={{ background: '#6366f1' }} />Income
                </div>
                <div className="rg-leg-item">
                  <span className="rg-leg-dot" style={{ background: '#c5c8d4' }} />Expense
                </div>
              </div>
            </div>
            <div className="rg-chart-wrap">
              <canvas
                ref={chartRef}
                role="img"
                aria-label="Monthly income and expense bar chart for the past 6 months"
              />
            </div>
          </div>

          <div className="rg-tips">
            {[
              { icon: 'ti-chart-line',   text: 'Track every rupee with live dashboard analytics' },
              { icon: 'ti-shield-check', text: 'Bank-grade security — your data stays yours' },
              { icon: 'ti-bell',         text: 'Budget alerts before you overspend' },
            ].map(t => (
              <div key={t.icon} className="rg-tip">
                <div className="rg-tip-ico">
                  <i className={`ti ${t.icon}`} aria-hidden="true" />
                </div>
                {t.text}
              </div>
            ))}
          </div>
        </div>

        {/* ══ RIGHT — Register form ══ */}
        <div className="rg-right">

          <div className="rg-form-head">
            <h2>Create your account</h2>
            <p>Free forever · No credit card required</p>
          </div>

          <div className="rg-card">

            {(apiErr || errors.terms) && (
              <div className="rg-banner rg-banner--err">
                <i className="ti ti-alert-circle" aria-hidden="true" />
                <span>{apiErr || errors.terms}</span>
              </div>
            )}

            {success && (
              <div className="rg-banner rg-banner--ok">
                <i className="ti ti-check" aria-hidden="true" />
                Account created! Redirecting to login…
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>

              <div className="rg-field">
                <label htmlFor="f-name">Full name</label>
                <div className="rg-inp-wrap">
                  <i className="ti ti-id-badge rg-inp-ico" aria-hidden="true" />
                  <input
                    className={`rg-input${errors.name ? ' rg-input--err' : ''}`}
                    id="f-name"
                    type="text"
                    placeholder="Prabin O"
                    value={name}
                    autoComplete="name"
                    onChange={e => { setName(e.target.value); clearFieldErr('name') }}
                  />
                </div>
                {errors.name && (
                  <span className="rg-err">
                    <i className="ti ti-alert-circle" aria-hidden="true" /> {errors.name}
                  </span>
                )}
              </div>

              <div className="rg-field">
                <label htmlFor="f-username">Username</label>
                <div className="rg-inp-wrap">
                  <i className="ti ti-user rg-inp-ico" aria-hidden="true" />
                  <input
                    className={`rg-input${errors.username ? ' rg-input--err' : ''}`}
                    id="f-username"
                    type="text"
                    placeholder="prabin"
                    value={username}
                    autoComplete="username"
                    onChange={e => { setUsername(e.target.value); clearFieldErr('username') }}
                  />
                </div>
                {errors.username && (
                  <span className="rg-err">
                    <i className="ti ti-alert-circle" aria-hidden="true" /> {errors.username}
                  </span>
                )}
              </div>

              <div className="rg-field">
                <label htmlFor="f-password">Password</label>
                <div className="rg-inp-wrap">
                  <i className="ti ti-lock rg-inp-ico" aria-hidden="true" />
                  <input
                    className={`rg-input rg-input--pr${errors.password ? ' rg-input--err' : ''}`}
                    id="f-password"
                    type={showPw ? 'text' : 'password'}
                    placeholder="Min. 4 characters"
                    value={password}
                    autoComplete="new-password"
                    onChange={e => { setPassword(e.target.value); clearFieldErr('password') }}
                  />
                  <button
                    type="button"
                    className="rg-eye-btn"
                    onClick={() => setShowPw(v => !v)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    <i className={`ti ${showPw ? 'ti-eye-off' : 'ti-eye'}`} aria-hidden="true" />
                  </button>
                </div>
                {errors.password && (
                  <span className="rg-err">
                    <i className="ti ti-alert-circle" aria-hidden="true" /> {errors.password}
                  </span>
                )}
                {pwStrength && !errors.password && (
                  <div className="rg-pw-str">
                    <div className="rg-pw-bar">
                      {[1,2,3,4].map(i => (
                        <div
                          key={i}
                          className={`rg-pw-seg${i <= pwStrength.score ? ` rg-pw-seg--${pwStrength.cls}` : ''}`}
                        />
                      ))}
                    </div>
                    <span className="rg-pw-lbl">{pwStrength.label}</span>
                  </div>
                )}
              </div>

              <div className="rg-field">
                <label htmlFor="f-confirm">Confirm password</label>
                <div className="rg-inp-wrap">
                  <i className="ti ti-lock-check rg-inp-ico" aria-hidden="true" />
                  <input
                    className={`rg-input rg-input--pr${errors.confirm ? ' rg-input--err' : ''}`}
                    id="f-confirm"
                    type={showCpw ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    value={confirm}
                    autoComplete="new-password"
                    onChange={e => { setConfirm(e.target.value); clearFieldErr('confirm') }}
                  />
                  <button
                    type="button"
                    className="rg-eye-btn"
                    onClick={() => setShowCpw(v => !v)}
                    aria-label={showCpw ? 'Hide password' : 'Show password'}
                  >
                    <i className={`ti ${showCpw ? 'ti-eye-off' : 'ti-eye'}`} aria-hidden="true" />
                  </button>
                </div>
                {errors.confirm && (
                  <span className="rg-err">
                    <i className="ti ti-alert-circle" aria-hidden="true" /> {errors.confirm}
                  </span>
                )}
              </div>

              <div className="rg-terms">
                <div
                  className={`rg-checkbox${agreed ? ' rg-checkbox--checked' : ''}`}
                  role="checkbox"
                  aria-checked={agreed}
                  tabIndex={0}
                  onClick={() => { setAgreed(v => !v); clearFieldErr('terms') }}
                  onKeyDown={e => e.key === ' ' && setAgreed(v => !v)}
                >
                  {agreed && <i className="ti ti-check" aria-hidden="true" />}
                </div>
                <span>
                  I agree to the{' '}
                  <Link to="/terms">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy">Privacy Policy</Link>
                </span>
              </div>

              <button
                type="submit"
                className="rg-btn-submit"
                disabled={loading || success}
              >
                {loading
                  ? <><i className="ti ti-loader-2 rg-spin" aria-hidden="true" /> Creating…</>
                  : <><i className="ti ti-user-plus" aria-hidden="true" /> Create account</>
                }
              </button>

            </form>
          </div>

          <p className="rg-login-link">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>

        </div>
      </div>
       {success && (
        <div className="rg-success-overlay" role="status" aria-live="polite">
          <div className="rg-success-card">
            <div className="rg-success-icon">
              <i className="ti ti-check" aria-hidden="true" />
            </div>
            <h3>Account created!</h3>
            <p>Welcome to Fintrack. Taking you to sign in…</p>
            <div className="rg-success-bar">
              <div className="rg-success-bar-fill" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}