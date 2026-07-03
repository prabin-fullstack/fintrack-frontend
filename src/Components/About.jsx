import '../Style/About.css'

const timeline = [
  {
    year: '2022',
    title: 'The problem',
    desc: 'Our founders were tired of spreadsheets and banking apps that never talked to each other. They wanted one place for everything.',
  },
  {
    year: '2023',
    title: 'First version',
    desc: 'A simple dashboard, a handful of beta users, and more bugs than features. But people loved the core idea.',
  },
  {
    year: '2024',
    title: 'Growing fast',
    desc: 'Smart categories, budget alerts, and CSV exports shipped. User base crossed 5,000 — all through word of mouth.',
  },
  {
    year: '2025',
    title: 'Today',
    desc: 'Over 12,000 users tracking ₹2.4B across India. Rated 4.9★ on the App Store. Still just getting started.',
  },
]

const values = [
  {
    icon: 'ti ti-eye-off',
    title: 'Privacy first',
    desc: 'Your financial data is yours. We never sell it, share it, or use it to serve ads.',
  },
  {
    icon: 'ti ti-tools',
    title: 'Built to last',
    desc: 'No dark patterns, no lock-in. Export everything, anytime, in open formats.',
  },
  {
    icon: 'ti ti-heart',
    title: 'Made with care',
    desc: 'Every screen is designed to reduce stress around money, not add to it.',
  },
  {
    icon: 'ti ti-users',
    title: 'User-driven',
    desc: 'Every major feature came from a real user request. We read every message.',
  },
]

const team = [
  { initials: 'PO', name: 'Prabin O',   role: 'Founder & CEO' },
  { initials: 'PR', name: 'Priya Rao',     role: 'Co-founder & Design' },
  { initials: 'SM', name: 'Suresh Menon',  role: 'Lead Engineer' },
]

export default function About() {
  return (
    <div className="ab-root">

      {/* ── HERO ROW ── */}
      <div className="ab-split">
        <div className="ab-left">
          <div className="nm-badge">
            <span className="nm-badge-dot" aria-hidden="true" />
            Our story
          </div>

          <h1 className="nm-title">
            Money management<br />
            <span>built for real life</span>
          </h1>

          <p className="nm-sub">
            Fintrack started as a frustration. Most finance apps were either
            too simple to be useful or too complex to actually use. We built
            the tool we wished existed — and it turned out a lot of people
            wanted the same thing.
          </p>

          {/* Timeline */}
          <div className="ab-timeline" aria-label="Company timeline">
            {timeline.map((t, i) => (
              <div key={t.year} className="ab-tl-item">
                <div className="ab-tl-left">
                  <div className="ab-tl-year">{t.year}</div>
                  {i < timeline.length - 1 && (
                    <div className="ab-tl-line" aria-hidden="true" />
                  )}
                </div>
                <div className="ab-tl-body">
                  <div className="ab-tl-title">{t.title}</div>
                  <div className="ab-tl-desc">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="nm-right">
          <div className="nm-panel-label">What we believe in</div>

          <div className="nm-feat-grid">
            {values.map(({ icon, title, desc }) => (
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

          {/* Team */}
          <div className="nm-panel-label" style={{ marginBottom: 12 }}>
            The team
          </div>
          <div className="ab-team">
            {team.map(({ initials, name, role }) => (
              <div key={name} className="ab-member">
                <div className="ab-avatar">{initials}</div>
                <div className="ab-member-info">
                  <div className="ab-member-name">{name}</div>
                  <div className="ab-member-role">{role}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="nm-divider" />

          <div className="nm-cta-panel">
            <div className="nm-cta-panel-text">
              <strong>Open to feedback</strong> · hello@fintrack.in
            </div>
            <div className="nm-chip">
              <i className="ti ti-mail" aria-hidden="true" />
              Say hi
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}