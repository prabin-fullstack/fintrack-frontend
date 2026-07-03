import { useState } from 'react'
import '../Style/Testimonials.css'

const testimonials = [
  {
    name: 'Anjali Sharma',
    role: 'Freelance Designer',
    city: 'Bengaluru',
    initials: 'AS',
    rating: 5,
    text: 'I tried four different budgeting apps before Fintrack. This is the first one I actually stuck with past the first week. The auto-categorisation alone saves me 20 minutes every Sunday.',
    stat: { value: '₹18k', label: 'saved last month' },
    accent: '#6366f1',
  },
  {
    name: 'Rohan Mehta',
    role: 'Software Engineer',
    city: 'Pune',
    initials: 'RM',
    rating: 5,
    text: 'The budget alert at 80% is a game changer. I used to blow my dining budget by day 20 every month. Now I actually have money left at the end of the month — which was basically a myth before.',
    stat: { value: '3×', label: 'fewer overdrafts' },
    accent: '#16a34a',
  },
  {
    name: 'Priya Nair',
    role: 'Startup Founder',
    city: 'Mumbai',
    initials: 'PN',
    rating: 5,
    text: 'I use it for both personal and my small business expenses. The CSV export makes my CA very happy. Clean UI, no bloat, does exactly what it promises — rare for a free product.',
    stat: { value: '12 min', label: 'to file expenses' },
    accent: '#d97706',
  },
  {
    name: 'Karthik Iyer',
    role: 'Medical Resident',
    city: 'Chennai',
    initials: 'KI',
    rating: 5,
    text: 'On a resident salary every rupee matters. Fintrack helped me spot that I was spending ₹4,200 a month on random food delivery without realising. Cut that in half in two months.',
    stat: { value: '₹2.1k', label: 'cut monthly' },
    accent: '#dc2626',
  },
  {
    name: 'Sneha Kulkarni',
    role: 'Product Manager',
    city: 'Hyderabad',
    initials: 'SK',
    rating: 5,
    text: "The mobile experience is genuinely great — not just a shrunken desktop view. I log transactions from my phone the moment I pay, which means I don't forget them like I used to.",
    stat: { value: '98%', label: 'transactions logged' },
    accent: '#0891b2',
  },
  {
    name: 'Dev Malhotra',
    role: 'MBA Student',
    city: 'Delhi',
    initials: 'DM',
    rating: 5,
    text: "Most finance apps feel like they were designed by a bank. Fintrack feels like it was designed by someone who actually worries about money. That's the difference.",
    stat: { value: '4.9★', label: 'his own rating' },
    accent: '#7c3aed',
  },
]

const VISIBLE = 3

export default function Testimonials() {
  const [start, setStart] = useState(0)

  const total = testimonials.length
  const canPrev = start > 0
  const canNext = start + VISIBLE < total

  const prev = () => setStart(s => Math.max(0, s - 1))
  const next = () => setStart(s => Math.min(total - VISIBLE, s + 1))

  const visible = testimonials.slice(start, start + VISIBLE)

  return (
    <section className="tm-root" aria-labelledby="tm-heading">

      {/* ── Header ── */}
      <div className="tm-header">
        <div className="tm-badge">
          <span className="tm-badge-dot" aria-hidden="true" />
          Testimonials
        </div>
        <h2 className="tm-heading" id="tm-heading">
          Loved by <span>12,000+ users</span>
        </h2>
        <p className="tm-sub">
          Real people, real numbers. No incentivised reviews.
        </p>
      </div>

      {/* ── Rating summary strip ── */}
      <div className="tm-summary">
        <div className="tm-summary-score">
          <span className="tm-big-score">4.9</span>
          <div className="tm-stars" aria-label="4.9 out of 5 stars">
            {[1,2,3,4,5].map(i => (
              <i key={i} className="ti ti-star-filled tm-star" aria-hidden="true" />
            ))}
          </div>
          <span className="tm-summary-label">Average rating</span>
        </div>
        <div className="tm-summary-sep" aria-hidden="true" />
        <div className="tm-summary-stat">
          <span className="tm-summary-val">12k+</span>
          <span className="tm-summary-label">Active users</span>
        </div>
        <div className="tm-summary-sep" aria-hidden="true" />
        <div className="tm-summary-stat">
          <span className="tm-summary-val">₹2.4B</span>
          <span className="tm-summary-label">Tracked</span>
        </div>
        <div className="tm-summary-sep" aria-hidden="true" />
        <div className="tm-summary-stat">
          <span className="tm-summary-val">98%</span>
          <span className="tm-summary-label">Would recommend</span>
        </div>
      </div>

      {/* ── Cards + nav ── */}
      <div className="tm-carousel-wrap">
        <button
          className="tm-nav-btn"
          onClick={prev}
          disabled={!canPrev}
          aria-label="Previous testimonials"
        >
          <i className="ti ti-chevron-left" aria-hidden="true" />
        </button>

        <div className="tm-cards" aria-live="polite" aria-label="Testimonials">
          {visible.map(({ name, role, city, initials, rating, text, stat, accent }) => (
            <div key={name} className="tm-card">

              {/* quote mark */}
              <div className="tm-quote-mark" style={{ color: accent }} aria-hidden="true">
                <i className="ti ti-quote" />
              </div>

              {/* stars */}
              <div className="tm-card-stars" aria-label={`${rating} out of 5`}>
                {Array.from({ length: rating }).map((_, i) => (
                  <i key={i} className="ti ti-star-filled tm-star" aria-hidden="true" />
                ))}
              </div>

              {/* text */}
              <p className="tm-card-text">"{text}"</p>

              {/* stat pill */}
              <div className="tm-card-stat" style={{ '--tm-accent': accent }}>
                <span className="tm-card-stat-val">{stat.value}</span>
                <span className="tm-card-stat-label">{stat.label}</span>
              </div>

              {/* author */}
              <div className="tm-card-author">
                <div className="tm-avatar" style={{ '--tm-accent': accent }}>
                  {initials}
                </div>
                <div className="tm-author-info">
                  <div className="tm-author-name">{name}</div>
                  <div className="tm-author-meta">{role} · {city}</div>
                </div>
              </div>

            </div>
          ))}
        </div>

        <button
          className="tm-nav-btn"
          onClick={next}
          disabled={!canNext}
          aria-label="Next testimonials"
        >
          <i className="ti ti-chevron-right" aria-hidden="true" />
        </button>
      </div>

      {/* ── Dot indicators ── */}
      <div className="tm-dots" role="tablist" aria-label="Testimonial pages">
        {Array.from({ length: total - VISIBLE + 1 }).map((_, i) => (
          <button
            key={i}
            className={`tm-dot${i === start ? ' tm-dot--active' : ''}`}
            onClick={() => setStart(i)}
            role="tab"
            aria-selected={i === start}
            aria-label={`Show testimonials starting at ${i + 1}`}
          />
        ))}
      </div>

    </section>
  )
}