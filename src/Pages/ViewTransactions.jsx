import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../Api'
import '../Style/ViewTransactions.css'

const PAGE_SIZE = 10

const CAT_ICONS = {
  Salary: 'ti ti-briefcase', Freelance: 'ti ti-code', Business: 'ti ti-building',
  Investment: 'ti ti-chart-line', Gift: 'ti ti-gift', Food: 'ti ti-tools-kitchen-2',
  Transport: 'ti ti-car', Utilities: 'ti ti-bolt', Shopping: 'ti ti-shopping-bag',
  Healthcare: 'ti ti-heart', Education: 'ti ti-book', Entertainment: 'ti ti-music',
  Rent: 'ti ti-home', EMI: 'ti ti-credit-card',
}

function isToday(d) {
  const now = new Date()
  return d.toDateString() === now.toDateString()
}

function isThisWeek(d) {
  const now = new Date()
  const start = new Date(now)
  start.setDate(now.getDate() - now.getDay())
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(start.getDate() + 7)
  return d >= start && d < end
}

function isThisMonth(d) {
  const now = new Date()
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
}

function groupByDate(items) {
  const groups = []
  const map = new Map()
  for (const t of items) {
    const key = t.date || 'unknown'
    if (!map.has(key)) {
      const g = { date: key, items: [] }
      map.set(key, g)
      groups.push(g)
    }
    map.get(key).items.push(t)
  }
  return groups
}

function dayLabel(dateStr) {
  if (!dateStr || dateStr === 'unknown') return 'No date'
  const d = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ViewTransactions() {
  const [transactions, setTransactions] = useState([])
  const [filtered, setFiltered]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [deleting, setDeleting]         = useState(null)
  const [search, setSearch]             = useState('')
  const [typeFilter, setTypeFilter]     = useState('')
  const [catFilter, setCatFilter]       = useState('')
  const [dateFilter, setDateFilter]     = useState('')
  const [customFrom, setCustomFrom]     = useState('')
  const [customTo, setCustomTo]         = useState('')
  const [page, setPage]                 = useState(1)
  const [confirmTarget, setConfirmTarget] = useState(null) // holds the transaction pending delete
  const navigate = useNavigate()

  useEffect(() => {
    api.get('transactions/view/')
      .then(r => {
        const data = r.data.transactions || []
        setTransactions(data)
        setFiltered(data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    const result = transactions.filter(t => {
      const matchQ  = !q || [t.description, t.category, t.payment_method]
                              .join(' ').toLowerCase().includes(q)
      const matchT  = !typeFilter || t.transaction_type?.toLowerCase() === typeFilter
      const matchC  = !catFilter  || t.category === catFilter

      let matchD = true
      if (t.date) {
        const d = new Date(t.date + 'T00:00:00')
        if (dateFilter === 'today')      matchD = isToday(d)
        else if (dateFilter === 'week')  matchD = isThisWeek(d)
        else if (dateFilter === 'month') matchD = isThisMonth(d)
        else if (dateFilter === 'custom') {
          const from = customFrom ? new Date(customFrom + 'T00:00:00') : null
          const to   = customTo   ? new Date(customTo + 'T23:59:59')   : null
          matchD = (!from || d >= from) && (!to || d <= to)
        }
      } else if (dateFilter && dateFilter !== '') {
        matchD = false
      }

      return matchQ && matchT && matchC && matchD
    })
    setFiltered(result)
    setPage(1)
  }, [search, typeFilter, catFilter, dateFilter, customFrom, customTo, transactions])

  // Opens the modal instead of deleting immediately
  const requestDelete = (t) => {
    setConfirmTarget(t)
  }

  const cancelDelete = () => {
    setConfirmTarget(null)
  }

  const confirmDelete = async () => {
    if (!confirmTarget) return
    const id = confirmTarget.id
    setDeleting(id)
    try {
      await api.delete(`transactions/delete/${id}/`)
      setTransactions(prev => prev.filter(t => t.id !== id))
    } catch (e) {
      console.error(e)
    } finally {
      setDeleting(null)
      setConfirmTarget(null)
    }
  }

  const categories = [...new Set(transactions.map(t => t.category).filter(Boolean))].sort()

  const totalIncome  = filtered
    .filter(t => t.transaction_type?.toLowerCase() === 'income')
    .reduce((a, t) => a + parseFloat(t.amount || 0), 0)

  const totalExpense = filtered
    .filter(t => t.transaction_type?.toLowerCase() === 'expense')
    .reduce((a, t) => a + parseFloat(t.amount || 0), 0)

  const balance = totalIncome - totalExpense

  function fmt(n) {
    return '₹' + Math.round(n).toLocaleString('en-IN')
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageStart = (safePage - 1) * PAGE_SIZE
  const pageItems = filtered.slice(pageStart, pageStart + PAGE_SIZE)

  function goToPage(p) {
    setPage(Math.min(Math.max(1, p), totalPages))
  }

  function pageNumbers() {
    const nums = []
    const span = 1
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= safePage - span && i <= safePage + span)) {
        nums.push(i)
      } else if (nums[nums.length - 1] !== '…') {
        nums.push('…')
      }
    }
    return nums
  }

  if (loading) {
    return (
      <div className="vt-loading">
        <div className="vt-spinner" />
        <p>Loading transactions…</p>
      </div>
    )
  }

  return (
    <div className="vt">

      <div className="vt-head">
        <div>
          <h1 className="vt-head__title">Transactions</h1>
          <p className="vt-head__sub">
            {filtered.length === transactions.length
              ? `${transactions.length} records`
              : `${filtered.length} of ${transactions.length} filtered`}
          </p>
        </div>
        <button className="vt-new-btn" onClick={() => navigate('/add')}>
          <i className="ti ti-plus" aria-hidden="true" />
          New transaction
        </button>
      </div>

      <div className="vt-stat-row">
        <div className="vt-stat">
          <div className="vt-stat__top">
            <span className="vt-stat__lbl">Records</span>
            <div className="vt-stat__ico vt-stat__ico--purple">
              <i className="ti ti-list" aria-hidden="true" />
            </div>
          </div>
          <div className="vt-stat__val vt-stat__val--purple">{filtered.length}</div>
        </div>
        <div className="vt-stat">
          <div className="vt-stat__top">
            <span className="vt-stat__lbl">Income</span>
            <div className="vt-stat__ico vt-stat__ico--green">
              <i className="ti ti-trending-up" aria-hidden="true" />
            </div>
          </div>
          <div className="vt-stat__val vt-stat__val--green">{fmt(totalIncome)}</div>
        </div>
        <div className="vt-stat">
          <div className="vt-stat__top">
            <span className="vt-stat__lbl">Expense</span>
            <div className="vt-stat__ico vt-stat__ico--red">
              <i className="ti ti-trending-down" aria-hidden="true" />
            </div>
          </div>
          <div className="vt-stat__val vt-stat__val--red">{fmt(totalExpense)}</div>
        </div>
        <div className="vt-stat">
          <div className="vt-stat__top">
            <span className="vt-stat__lbl">Balance</span>
            <div className="vt-stat__ico vt-stat__ico--amber">
              <i className="ti ti-wallet" aria-hidden="true" />
            </div>
          </div>
          <div
            className="vt-stat__val"
            style={{ color: balance >= 0 ? '#16a34a' : '#dc2626' }}
          >
            {balance >= 0 ? '+' : '-'}{fmt(Math.abs(balance))}
          </div>
        </div>
      </div>

      <div className="vt-panel">

        <div className="vt-panel__head">
          <h2>All transactions</h2>
          <div className="vt-controls">
            <div className="vt-search">
              <i className="ti ti-search" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="vt-select"
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
            >
              <option value="">All types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select
              className="vt-select"
              value={catFilter}
              onChange={e => setCatFilter(e.target.value)}
            >
              <option value="">All categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              className="vt-select"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
            >
              <option value="">All dates</option>
              <option value="today">Today</option>
              <option value="week">This week</option>
              <option value="month">This month</option>
              <option value="custom">Custom range</option>
            </select>

            {dateFilter === 'custom' && (
              <div className="vt-date-range">
                <input
                  type="date"
                  className="vt-select"
                  value={customFrom}
                  onChange={e => setCustomFrom(e.target.value)}
                />
                <span className="vt-date-range__sep">–</span>
                <input
                  type="date"
                  className="vt-select"
                  value={customTo}
                  onChange={e => setCustomTo(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        <div className="vt-timeline">
          {pageItems.length === 0 ? (
            <div className="vt-empty">
              <i className="ti ti-receipt-off" aria-hidden="true" />
              <p>No transactions found</p>
            </div>
          ) : (
            groupByDate(pageItems).map(group => {
              const dayNet = group.items.reduce((a, t) => {
                const v = parseFloat(t.amount || 0)
                return a + (t.transaction_type?.toLowerCase() === 'expense' ? -v : v)
              }, 0)
              return (
                <div className="vt-tl-group" key={group.date}>
                  <div className="vt-tl-daylabel">
                    <span>{dayLabel(group.date)}</span>
                    <span
                      className="vt-tl-daynet"
                      style={{ color: dayNet >= 0 ? '#16a34a' : '#dc2626' }}
                    >
                      {dayNet >= 0 ? '+' : '-'}{fmt(Math.abs(dayNet))}
                    </span>
                  </div>

                  <div className="vt-tl-line">
                    {group.items.map(t => {
                      const type  = t.transaction_type?.toLowerCase()
                      const isDel = deleting === t.id
                      const icon  = CAT_ICONS[t.category] || (type === 'expense' ? 'ti ti-trending-down' : 'ti ti-trending-up')
                      return (
                        <div className="vt-tl-item" key={t.id}>
                          <div className={`vt-tl-dot vt-tl-dot--${type}`} />
                          <div className={`vt-tl-ico vt-tl-ico--${type}`}>
                            <i className={icon} aria-hidden="true" />
                          </div>

                          <div className="vt-tl-body">
                            <div className="vt-tl-top">
                              <span className="vt-tl-desc">{t.description || '—'}</span>
                              <span className={`vt-tl-amt vt-tl-amt--${type}`}>
                                {type === 'expense' ? '−' : '+'}{fmt(parseFloat(t.amount || 0))}
                              </span>
                            </div>
                            <div className="vt-tl-meta">
                              <span className="vt-cat-chip">{t.category || '—'}</span>
                              <span className="vt-tl-pay">{t.payment_method || '—'}</span>
                              <span className="vt-tl-id">#{String(t.id).padStart(4, '0')}</span>
                            </div>
                          </div>

                          <div className="vt-actions vt-tl-actions">
                            <button
                              className="vt-btn vt-btn--edit"
                              onClick={() => navigate(`/edit/${t.id}`)}
                              aria-label="Edit transaction"
                            >
                              <i className="ti ti-edit" aria-hidden="true" />
                            </button>
                            <button
                              className="vt-btn vt-btn--del"
                              onClick={() => requestDelete(t)}
                              disabled={isDel}
                              aria-label="Delete transaction"
                            >
                              <i className="ti ti-trash" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {totalPages > 1 && (
          <div className="vt-pagination">
            <button
              className="vt-page-btn"
              onClick={() => goToPage(safePage - 1)}
              disabled={safePage === 1}
              aria-label="Previous page"
            >
              <i className="ti ti-chevron-left" aria-hidden="true" />
            </button>

            {pageNumbers().map((n, i) =>
              n === '…' ? (
                <span key={`dots-${i}`} className="vt-page-dots">…</span>
              ) : (
                <button
                  key={n}
                  className={`vt-page-btn${n === safePage ? ' vt-page-btn--active' : ''}`}
                  onClick={() => goToPage(n)}
                >
                  {n}
                </button>
              )
            )}

            <button
              className="vt-page-btn"
              onClick={() => goToPage(safePage + 1)}
              disabled={safePage === totalPages}
              aria-label="Next page"
            >
              <i className="ti ti-chevron-right" aria-hidden="true" />
            </button>
          </div>
        )}

        <div className="vt-panel__foot">
          <span>Showing {pageItems.length ? pageStart + 1 : 0}–{pageStart + pageItems.length} of {filtered.length}</span>
          <span
            className="vt-foot-net"
            style={{ color: balance >= 0 ? '#16a34a' : '#dc2626' }}
          >
            Net: {balance >= 0 ? '+' : '-'}{fmt(Math.abs(balance))}
          </span>
        </div>

      </div>

      {/* ── Delete confirmation modal ── */}
      {confirmTarget && (
        <div
          className="vt-modal-overlay"
          onClick={cancelDelete}
          role="presentation"
        >
          <div
            className="vt-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="vt-modal-title"
            onClick={e => e.stopPropagation()}
          >
            <div className="vt-modal__icon">
              <i className="ti ti-alert-triangle" aria-hidden="true" />
            </div>

            <h3 id="vt-modal-title" className="vt-modal__title">
              Delete this transaction?
            </h3>

            <p className="vt-modal__desc">
              <strong>{confirmTarget.description || 'This transaction'}</strong>
              {' '}for{' '}
              <strong>
                {confirmTarget.transaction_type?.toLowerCase() === 'expense' ? '−' : '+'}
                {fmt(parseFloat(confirmTarget.amount || 0))}
              </strong>
              {' '}will be permanently removed. This can't be undone.
            </p>

            <div className="vt-modal__actions">
              <button
                className="vt-modal__btn vt-modal__btn--cancel"
                onClick={cancelDelete}
                disabled={deleting === confirmTarget.id}
              >
                Cancel
              </button>
              <button
                className="vt-modal__btn vt-modal__btn--danger"
                onClick={confirmDelete}
                disabled={deleting === confirmTarget.id}
              >
                {deleting === confirmTarget.id ? (
                  <>
                    <span className="vt-modal__spinner" />
                    Deleting…
                  </>
                ) : (
                  <>
                    <i className="ti ti-trash" aria-hidden="true" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}