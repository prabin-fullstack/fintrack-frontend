import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import '../Style/Footer.css'

// ids that exist as sections on the Home page (must match Navbar + Home.jsx)
const sectionIds = {
  Features: 'features',
  'How it works': 'how-it-works',
  About: 'about',
}

const links = {
  Product: [
    { label: 'Features',     to: '/#features' },
    { label: 'How it works', to: '/#how-it-works' },
    { label: 'Dashboard',    to: '/dashboard' },
    { label: 'Transactions', to: '/transactions' },
  ],
  Support: [
    { label: 'About',        to: '/#about' },
    { label: 'Help center',  to: '/help' },
    { label: 'Contact us',   to: '/contact' },
    { label: 'FAQs',         to: '/faq' },
  ],
  Legal: [
    { label: 'Privacy policy',    to: '/privacy' },
    { label: 'Terms of service',  to: '/terms' },
    { label: 'Security',          to: '/security' },
  ],
}

const socials = [
  { icon: 'ti ti-brand-twitter',  href: 'https://twitter.com',  label: 'Twitter'  },
  { icon: 'ti ti-brand-github',   href: 'https://github.com',   label: 'GitHub'   },
  { icon: 'ti ti-brand-linkedin', href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: 'ti ti-brand-instagram',href: 'https://instagram.com',label: 'Instagram'},
]

const stats = [
  { value: '12k+',  label: 'Users'    },
  { value: '₹2.4B', label: 'Tracked'  },
  { value: '4.9★',  label: 'Rating'   },
  { value: '99.9%', label: 'Uptime'   },
]

export default function Footer() {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  const scrollToSection = (id) => {
    if (!isHome) {
      navigate('/')
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 150)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="fo-root" aria-label="Site footer">
      <div className="fo-inner">

        {/* ── Top row: brand + stats ── */}
        <div className="fo-top">
          <div className="fo-brand-col">
            <NavLink to="/" className="fo-brand">
              <div className="fo-brand-icon">
                <i className="ti ti-wallet" aria-hidden="true" />
              </div>
              <span className="fo-brand-name">Fintrack</span>
            </NavLink>
            <p className="fo-tagline">
              Track income, expenses, and budgets in one beautiful place.
              Real-time insights that help you spend smarter every day.
            </p>
            <div className="fo-socials" aria-label="Social links">
              {socials.map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="fo-social-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  <i className={icon} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="fo-link-cols">
            {Object.entries(links).map(([group, items]) => (
              <div key={group} className="fo-link-col">
                <div className="fo-col-heading">{group}</div>
                <ul className="fo-col-list">
                  {items.map(({ label, to }) => {
                    const sectionId = sectionIds[label]
                    return (
                      <li key={label}>
                        {sectionId ? (
                          <button
                            type="button"
                            className="fo-link fo-link--btn"
                            onClick={() => scrollToSection(sectionId)}
                          >
                            {label}
                          </button>
                        ) : (
                          <NavLink to={to} className="fo-link">{label}</NavLink>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="fo-divider" />

        {/* ── Stats strip ── */}
        <div className="fo-stats" aria-label="Key statistics">
          {stats.map(({ value, label }, i) => (
            <div key={label} className="fo-stat-group">
              {i > 0 && <div className="fo-stat-sep" aria-hidden="true" />}
              <div className="fo-stat">
                <span className="fo-stat-val">{value}</span>
                <span className="fo-stat-label">{label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="fo-divider" />

        {/* ── Bottom bar ── */}
        <div className="fo-bottom">
          <p className="fo-copy">
            © {new Date().getFullYear()} Fintrack. Made with
            <i className="ti ti-heart-filled fo-heart" aria-hidden="true" />
            in India.
          </p>
          <div className="fo-bottom-links">
            <NavLink to="/privacy" className="fo-bottom-link">Privacy</NavLink>
            <span className="fo-bottom-dot" aria-hidden="true" />
            <NavLink to="/terms"   className="fo-bottom-link">Terms</NavLink>
            <span className="fo-bottom-dot" aria-hidden="true" />
            <NavLink to="/security" className="fo-bottom-link">Security</NavLink>
          </div>
          <div className="fo-status">
            <span className="fo-status-dot" aria-hidden="true" />
            All systems operational
          </div>
        </div>

      </div>
    </footer>
  )
}