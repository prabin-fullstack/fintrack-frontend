import '../Style/Features.css'

const features = [
  {
    icon: 'ti ti-chart-line',
    tag: 'Analytics',
    title: 'Live dashboard that thinks with you',
    desc: 'Every transaction you add instantly updates your charts. See income vs expenses, category breakdowns, and monthly trends — all in one glance, no refresh needed.',
    points: [
      'Real-time chart updates',
      'Monthly & weekly views',
      'Income vs expense comparison',
      'Category-wise breakdown',
    ],
    accent: '#6366f1',
    light: 'rgba(99,102,241,0.08)',
  },
  {
    icon: 'ti ti-shield-check',
    tag: 'Security',
    title: 'Your data stays yours, always',
    desc: 'We use bank-grade encryption at rest and in transit. No third-party data sharing, no ad targeting, no selling your financial habits. Ever.',
    points: [
      'AES-256 encryption at rest',
      'HTTPS-only data transit',
      'Zero third-party sharing',
      'Delete your data anytime',
    ],
    accent: '#16a34a',
    light: 'rgba(22,163,74,0.08)',
  },
  {
    icon: 'ti ti-category',
    tag: 'Smart tagging',
    title: 'Categories that figure themselves out',
    desc: 'Fintrack reads your transaction descriptions and auto-assigns categories — groceries, fuel, dining, subscriptions. You can always override, but rarely need to.',
    points: [
      'Auto-tag by merchant name',
      'Payment method detection',
      'Custom category creation',
      'Bulk re-categorisation',
    ],
    accent: '#d97706',
    light: 'rgba(217,119,6,0.08)',
  },
  {
    icon: 'ti ti-bell',
    tag: 'Alerts',
    title: 'Know before you overspend',
    desc: 'Set a monthly budget per category. Fintrack warns you at 80% and again at 100% — so you course-correct before the damage is done, not after.',
    points: [
      'Per-category budget limits',
      '80% & 100% threshold alerts',
      'Weekly spending digest',
      'Unusual spend detection',
    ],
    accent: '#dc2626',
    light: 'rgba(220,38,38,0.08)',
  },
]

export default function Features() {
  return (
    <section className="ft-root" aria-labelledby="ft-heading">

      {/* ── Header ── */}
      <div className="ft-header">
        <div className="ft-badge">
          <span className="ft-badge-dot" aria-hidden="true" />
          Features
        </div>
        <h2 className="ft-heading" id="ft-heading">
          Everything you need,<br />
          <span>nothing you don't</span>
        </h2>
        <p className="ft-sub">
          Built around how people actually think about money —
          not how accountants do.
        </p>
      </div>

      {/* ── Feature rows ── */}
      <div className="ft-list">
        {features.map(({ icon, tag, title, desc, points, accent, light }, i) => (
          <div
            key={tag}
            className={`ft-row${i % 2 === 1 ? ' ft-row--reverse' : ''}`}
          >
            {/* Visual card */}
            <div className="ft-visual" style={{ '--ft-accent': accent, '--ft-light': light }}>
              <div className="ft-visual-inner">
                <div className="ft-visual-icon">
                  <i className={icon} aria-hidden="true" />
                </div>
                <div className="ft-visual-tag">{tag}</div>
                <div className="ft-visual-title">{title}</div>
                {/* decorative neumorphic blobs */}
                <div className="ft-blob ft-blob--tl" aria-hidden="true" />
                <div className="ft-blob ft-blob--br" aria-hidden="true" />
              </div>
            </div>

            {/* Text content */}
            <div className="ft-content">
              <div className="ft-content-tag" style={{ color: accent }}>
                <i className={icon} aria-hidden="true" />
                {tag}
              </div>
              <h3 className="ft-content-title">{title}</h3>
              <p className="ft-content-desc">{desc}</p>
              <ul className="ft-points" aria-label={`${tag} features`}>
                {points.map(p => (
                  <li key={p} className="ft-point">
                    <span className="ft-point-dot" style={{ background: accent }} aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}