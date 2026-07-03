import { useNavigate } from 'react-router-dom'
import '../Style/Hero.css'

const features = [
  {
    icon: 'ti ti-chart-line',
    title: 'Live analytics',
    desc: 'Charts update as you add transactions',
  },
  {
    icon: 'ti ti-shield-check',
    title: 'Secure & private',
    desc: 'Encrypted data, never shared',
  },
  {
    icon: 'ti ti-category',
    title: 'Smart categories',
    desc: 'Auto-tag by type and payment method',
  },
  {
    icon: 'ti ti-device-mobile',
    title: 'Mobile ready',
    desc: 'Works perfectly on any screen size',
  },
  {
    icon: 'ti ti-bell',
    title: 'Budget alerts',
    desc: 'Get notified before you overspend',
  },
  {
    icon: 'ti ti-download',
    title: 'Export reports',
    desc: 'Download as CSV or PDF anytime',
  },
]

const stats = [
  { value: '12k+', label: 'Active users' },
  { value: '₹2.4B', label: 'Tracked' },
  { value: '4.9★', label: 'User rating' },
]

export default function HeroSection() {
  const navigate = useNavigate()

  return (
    <div className="nm-root">
      <div className="nm-split">

        {/* ── LEFT COLUMN ── */}
        <div className="nm-left">
          <div className="nm-badge">
            <span className="nm-badge-dot" aria-hidden="true" />
            Now with smart insights
          </div>

          <h1 className="nm-title">
            Take control of your<br />
            <span>finances</span>, effortlessly
          </h1>

          <p className="nm-sub">
            Track income, expenses, and budgets in one beautiful place.
            Real-time insights that help you spend smarter every day.
          </p>

          <div className="nm-cta">
            <button
              className="nm-btn-primary"
              onClick={() => navigate('/register')}
            >
              <i className="ti ti-rocket" aria-hidden="true" />
              Get started free
            </button>
            
          </div>

          <div className="nm-stats" aria-label="Key statistics">
            {stats.map((s, i) => (
              <div key={s.label} className="nm-stat-group">
                {i > 0 && <div className="nm-stat-sep" aria-hidden="true" />}
                <div className="nm-stat">
                  <div className="nm-stat-val">{s.value}</div>
                  <div className="nm-stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="nm-right">
          <div className="nm-panel-label">Everything you need</div>

          <div className="nm-feat-grid">
            {features.map(({ icon, title, desc }) => (
              <div key={title} className="nm-feat-card">
                <div className="nm-feat-icon">
                  <i className={icon} aria-hidden="true" />
                </div>
                <div className="nm-feat-title">{title}</div>
                <div className="nm-feat-desc">{desc}</div>
              </div>
            ))}
          </div>

          <div className="nm-divider" />

          <div className="nm-cta-panel">
            <div className="nm-cta-panel-text">
              <strong>Free forever</strong> · No card needed
            </div>
            <div className="nm-chip">
              <i className="ti ti-check" aria-hidden="true" />
              Always free
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}