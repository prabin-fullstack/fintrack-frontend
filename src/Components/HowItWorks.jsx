import { useNavigate } from 'react-router-dom'
import '../Style/HowItWorks.css'

const steps = [
  {
    step: '01',
    icon: 'ti ti-circle-plus',
    title: 'Add your transactions',
    desc: 'Log income and expenses in seconds. Import from your bank CSV or add manually — Fintrack auto-tags everything by category and payment method.',
    highlights: ['Bank CSV import', 'Auto-categorisation', 'UPI, cash & card'],
  },
  {
    step: '02',
    icon: 'ti ti-chart-bar',
    title: 'See where your money goes',
    desc: 'Your dashboard updates the moment you save a transaction. Spot overspending, track monthly trends, and compare income vs expenses at a glance.',
    highlights: ['Live dashboard', 'Monthly trends', 'Category breakdown'],
  },
  {
    step: '03',
    icon: 'ti ti-target',
    title: 'Set budgets & hit goals',
    desc: 'Create budgets for any category. Fintrack alerts you before you overspend and shows exactly how much runway you have left this month.',
    highlights: ['Per-category budgets', 'Overspend alerts', 'Goal tracking'],
  },
]

export default function HowItWorks() {
  const navigate = useNavigate()

  return (
    <section className="hiw-root" aria-labelledby="hiw-heading">

      {/* ── Header ── */}
      <div className="hiw-header">
        <div className="hiw-badge">
          <span className="hiw-badge-dot" aria-hidden="true" />
          How it works
        </div>
        <h2 className="hiw-heading" id="hiw-heading">
          Up and running in <span>three steps</span>
        </h2>
        <p className="hiw-sub">
          No bank login required, no subscription, no setup fee.
          Just open the app and start tracking.
        </p>
      </div>

      {/* ── Steps ── */}
      <div className="hiw-steps" role="list">
        {steps.map(({ step, icon, title, desc, highlights }, i) => (
          <>
            {/* Card */}
            <div key={step} className="hiw-card" role="listitem">
              <div className="hiw-step-num" aria-label={`Step ${step}`}>{step}</div>
              <div className="hiw-icon-wrap">
                <i className={icon} aria-hidden="true" />
              </div>
              <div className="hiw-card-title">{title}</div>
              <div className="hiw-card-desc">{desc}</div>
              <div className="hiw-pills" aria-label="Features in this step">
                {highlights.map(h => (
                  <span key={h} className="hiw-pill">
                    <i className="ti ti-check" aria-hidden="true" />
                    {h}
                  </span>
                ))}
              </div>
            </div>

            {/* Connector — rendered AFTER the card it follows */}
            {i < steps.length - 1 && (
              <div key={`conn-${i}`} className="hiw-connector" aria-hidden="true">
                <div className="hiw-connector-line" />
                <i className="ti ti-chevron-right hiw-connector-arrow" />
              </div>
            )}
          </>
        ))}
      </div>

      {/* ── Bottom CTA ── */}
      <div className="hiw-cta-row">
        <div className="hiw-cta-card">
          <div className="hiw-cta-text">
            <strong>Ready to start?</strong>
            <span>It takes less than 60 seconds to set up your account.</span>
          </div>
          <button
            className="hiw-btn-primary"
            onClick={() => navigate('/register')}
          >
            <i className="ti ti-rocket" aria-hidden="true" />
            Get started free
          </button>
        </div>
      </div>

    </section>
  )
}