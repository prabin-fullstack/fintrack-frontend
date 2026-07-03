import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import '../Style/Navbar.css'

export default function Navbar({ isLoggedIn = false, name, userName = 'User', onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isClickScrolling = useRef(false)

  const safeName = userName || 'User'
  const initials = safeName.slice(0, 2).toUpperCase()

  const requestLogout = () => {
    setMenuOpen(false)
    setShowLogoutConfirm(true)
  }

  const cancelLogout = () => {
    setShowLogoutConfirm(false)
  }

  const confirmLogout = () => {
    onLogout?.()
    setShowLogoutConfirm(false)
    navigate('/login')
  }

  const navLinks = [
    { to: '/dashboard',    label: 'Dashboard',        icon: 'ti ti-chart-bar' },
    { to: '/transactions', label: 'View Transactions', icon: 'ti ti-receipt' },
  ]

  const sectionLinks = [
    { id: 'hero',          label: 'Home',         icon: 'ti ti-home' },
    { id: 'how-it-works',  label: 'How It Works', icon: 'ti ti-list-check' },
    { id: 'features',      label: 'Features',     icon: 'ti ti-star' },
    { id: 'about',         label: 'About',        icon: 'ti ti-info-circle' },
  ]

  const getLinkClass = ({ isActive }) =>
    isActive ? 'nm-link nm-link--active' : 'nm-link'

  const getMobileLinkClass = ({ isActive }) =>
    isActive ? 'nm-mobile-link nm-mobile-link--active' : 'nm-mobile-link'

  const scrollToSection = (id) => {
    setMenuOpen(false)
    setActiveSection(id)

    if (!isHome) {
      navigate('/')
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 150)
    } else {
      isClickScrolling.current = true
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => { isClickScrolling.current = false }, 800)
    }
  }

  useEffect(() => {
    if (!isHome) {
      setActiveSection('hero')
    }
  }, [isHome])

  useEffect(() => {
    if (!isHome) return

    const ids = sectionLinks.map(s => s.id)
    const elements = ids
      .map(id => document.getElementById(id))
      .filter(Boolean)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return

        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      {
        rootMargin: '-40% 0px -50% 0px',
        threshold: 0,
      }
    )

    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [isHome])

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <div className="nm-nav-wrapper">
      <nav className="nm-nav" aria-label="Main navigation">

        <NavLink to="/" className="nm-brand" onClick={() => setMenuOpen(false)}>
          <div className="nm-brand-icon">
            <i className="ti ti-wallet" aria-hidden="true" />
          </div>
          <span className="nm-brand-name">Fintrack</span>
        </NavLink>

        <div className="nm-auth">
          {isLoggedIn && (
            <>
              <div className="nm-links" role="list">
                {navLinks.map(({ to, label, icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/dashboard'}
                    className={getLinkClass}
                    role="listitem"
                  >
                    <i className={icon} aria-hidden="true" />
                    <span className="nm-link-label">{label}</span>
                  </NavLink>
                ))}
              </div>
              <div className="nm-avatar" title={safeName}>
                {initials}
              </div>

              <button
                className="nm-btn-ghost nm-btn-ghost--danger"
                onClick={requestLogout}
              >
                <i className="ti ti-logout" />
                <span className="nm-btn-label">Logout</span>
              </button>
            </>
          )}

          {!isLoggedIn && (
            <>
              <div className="nm-links" role="list">
                {sectionLinks.map(({ id, label, icon }) => (
                  <button
                    key={id}
                    type="button"
                    className={
                      isHome && activeSection === id
                        ? 'nm-link nm-link--active'
                        : 'nm-link'
                    }
                    onClick={() => scrollToSection(id)}
                    role="listitem"
                  >
                    <i className={icon} aria-hidden="true" />
                    <span className="nm-link-label">{label}</span>
                  </button>
                ))}
              </div>

              <NavLink to="/login" className="nm-btn-ghost">
                <i className="ti ti-lock" />
                <span className="nm-btn-label">Login</span>
              </NavLink>

              <NavLink to="/register" className="nm-btn-primary">
                <i className="ti ti-user-plus" />
                <span className="nm-btn-label">Register</span>
              </NavLink>
            </>
          )}
        </div>

        <button
          className="nm-hamburger"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <i className={menuOpen ? 'ti ti-x' : 'ti ti-menu-2'} aria-hidden="true" />
        </button>
      </nav>

      <nav
        className={`nm-mobile-menu${menuOpen ? ' nm-mobile-menu--open' : ''}`}
        aria-label="Mobile navigation"
      >
        {isLoggedIn && (
          <div className="nm-mobile-profile">
            <div className="nm-avatar" title={safeName}>{initials}</div>
            <span className="nm-mobile-profile__name">{safeName}</span>
          </div>
        )}

        {isLoggedIn ? (
          navLinks.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              className={getMobileLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              <i className={icon} aria-hidden="true" />
              {label}
            </NavLink>
          ))
        ) : (
          sectionLinks.map(({ id, label, icon }) => (
            <button
              key={id}
              type="button"
              className={
                isHome && activeSection === id
                  ? 'nm-mobile-link nm-mobile-link--active'
                  : 'nm-mobile-link'
              }
              onClick={() => scrollToSection(id)}
            >
              <i className={icon} aria-hidden="true" />
              {label}
            </button>
          ))
        )}

        <div className="nm-mobile-divider" aria-hidden="true" />

        <div className="nm-mobile-auth">
          {isLoggedIn && (
            <button
              className="nm-btn-ghost nm-btn-ghost--danger"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={requestLogout}
            >
              <i className="ti ti-logout" />
              Logout
            </button>
          )}

          {!isLoggedIn && (
            <>
              <NavLink
                to="/login"
                className="nm-btn-ghost"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setMenuOpen(false)}
              >
                <i className="ti ti-lock" />
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="nm-btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setMenuOpen(false)}
              >
                <i className="ti ti-user-plus" />
                Register
              </NavLink>
            </>
          )}
        </div>
      </nav>

      {/* ── Logout confirmation modal ── */}
      {showLogoutConfirm && (
        <div
          className="nm-modal-overlay"
          onClick={cancelLogout}
          role="presentation"
        >
          <div
            className="nm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="nm-modal-title"
            onClick={e => e.stopPropagation()}
          >
            <div className="nm-modal__icon">
              <i className="ti ti-logout" aria-hidden="true" />
            </div>

            <h3 id="nm-modal-title" className="nm-modal__title">
              Log out of Fintrack?
            </h3>

            <p className="nm-modal__desc">
              You'll need to sign in again to access your dashboard and transactions.
            </p>

            <div className="nm-modal__actions">
              <button
                className="nm-modal__btn nm-modal__btn--cancel"
                onClick={cancelLogout}
              >
                Cancel
              </button>
              <button
                className="nm-modal__btn nm-modal__btn--danger"
                onClick={confirmLogout}
              >
                <i className="ti ti-logout" aria-hidden="true" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}