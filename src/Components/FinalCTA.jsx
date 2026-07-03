import { useNavigate } from 'react-router-dom'
import '../Style/FinalCTA.css'

const perks = [
  { icon: 'ti ti-lock-open',  text: 'Free forever' },
  { icon: 'ti ti-credit-card-off', text: 'No card needed' },
  { icon: 'ti ti-clock',      text: 'Ready in 60 seconds' },
  { icon: 'ti ti-download',   text: 'Export anytime' },
]

const avatars = ['AK', 'PR', 'SM', 'KI', 'SN']
const accentColors = ['#6366f1', '#16a34a', '#d97706', '#dc2626', '#0891b2']

export default function FinalCTA() {
  const navigate = useNavigate()

  return (
    <section className="cta-root" aria-labelledby="cta-heading">
      <div className="cta-card">

        {/* ── Decorative blobs ── */}
        <div className="cta-blob cta-blob--tl" aria-hidden="true" />
        <div className="cta-blob cta-blob--br" aria-hidden="true" />

        {/* ── Inner content ── */}
        <div className="cta-inner">

          {/* Left — copy */}
          <div className="cta-left">
            <div className="cta-badge">
              <span className="cta-badge-dot" aria-hidden="true" />
              Start for free today
            </div>

            <h2 className="cta-heading" id="cta-heading">
              Take the first step<br />
              toward <span>financial clarity</span>
            </h2>

            <p className="cta-sub">
              Join 12,000+ people who stopped wondering where their money
              went. Set up your account in under a minute — no credit card,
              no catch.
            </p>

            {/* Social proof row */}
            <div className="cta-social">
              <div className="cta-avatars" aria-hidden="true">
                {avatars.map((a, i) => (
                  <div
                    key={a}
                    className="cta-avatar"
                    style={{ '--av-color': accentColors[i], zIndex: avatars.length - i }}
                  >
                    {a}
                  </div>
                ))}
              </div>
              <div className="cta-social-text">
                <div className="cta-social-stars" aria-label="Rated 4.9 out of 5">
                  {[1,2,3,4,5].map(i => (
                    <i key={i} className="ti ti-star-filled cta-star" aria-hidden="true" />
                  ))}
                </div>
                <span>Rated 4.9 by 12k+ users</span>
              </div>
            </div>

            {/* Perk pills */}
            <div className="cta-perks">
              {perks.map(({ icon, text }) => (
                <div key={text} className="cta-perk">
                  <i className={icon} aria-hidden="true" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Right — action panel */}
          <div className="cta-right">
            <div className="cta-panel">
              <div className="cta-panel-head">
                <div className="cta-panel-icon">
                  <i className="ti ti-wallet" aria-hidden="true" />
                </div>
                <div>
                  <div className="cta-panel-title">Fintrack</div>
                  <div className="cta-panel-sub">Personal finance, simplified</div>
                </div>
              </div>

              <div className="cta-panel-divider" />

              <div className="cta-panel-stats">
                <div className="cta-panel-stat">
                  <span className="cta-panel-stat-val">₹0</span>
                  <span className="cta-panel-stat-label">Cost forever</span>
                </div>
                <div className="cta-panel-stat-sep" />
                <div className="cta-panel-stat">
                  <span className="cta-panel-stat-val">&lt;60s</span>
                  <span className="cta-panel-stat-label">Setup time</span>
                </div>
                <div className="cta-panel-stat-sep" />
                <div className="cta-panel-stat">
                  <span className="cta-panel-stat-val">∞</span>
                  <span className="cta-panel-stat-label">Transactions</span>
                </div>
              </div>

              <div className="cta-panel-divider" />

              <button
                className="cta-btn-primary"
                onClick={() => navigate('/register')}
              >
                <i className="ti ti-rocket" aria-hidden="true" />
                Create free account
              </button>

              <button
                className="cta-btn-ghost"
                onClick={() => navigate('/login')}
              >
                <i className="ti ti-login" aria-hidden="true" />
                Sign in instead
              </button>

              <p className="cta-panel-note">
                <i className="ti ti-shield-check" aria-hidden="true" />
                Your data is encrypted and never shared
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}