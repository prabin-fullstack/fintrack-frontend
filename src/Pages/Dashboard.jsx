import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Chart from 'chart.js/auto'
import api from '../Api'
import '../Style/Dashboard.css'

const CAT_ICONS = {
  Salary:    'ti ti-briefcase',
  Food:      'ti ti-tools-kitchen-2',
  Transport: 'ti ti-car',
  Utilities: 'ti ti-bolt',
  Freelance: 'ti ti-code',
  Shopping:  'ti ti-shopping-bag',
}

const CAT_COLORS = [
  '#6366f1', '#16a34a', '#d97706', '#dc2626', '#0891b2',
  '#9333ea', '#db2777', '#65a30d', '#0284c7', '#ea580c',
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function fmt(n) {
  return '₹' + Math.round(n).toLocaleString('en-IN')
}

function todayLabel() {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'short', year: 'numeric',
  })
}

function startOfDay(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

/**
 * Builds { labels, income[], expense[], rangeStart, rangeEnd } for the bar chart
 * based on the selected period filter.
 */
function buildPeriodData(transactions, period, customFrom, customTo) {
  const now = new Date()
  let rangeStart, rangeEnd, labels, bucketCount, bucketOf

  if (period === 'today') {
    rangeStart = startOfDay(now)
    rangeEnd   = new Date(rangeStart)
    rangeEnd.setDate(rangeStart.getDate() + 1)
    labels = ['Today']
    bucketCount = 1
    bucketOf = () => 0
  } else if (period === 'month') {
    rangeStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const dim = daysInMonth(now.getFullYear(), now.getMonth())
    rangeEnd = new Date(now.getFullYear(), now.getMonth(), dim + 1)
    labels = Array.from({ length: dim }, (_, i) => String(i + 1))
    bucketCount = dim
    bucketOf = d => d.getDate() - 1
  } else if (period === 'custom' && customFrom && customTo) {
    rangeStart = startOfDay(new Date(customFrom + 'T00:00:00'))
    const to    = startOfDay(new Date(customTo + 'T00:00:00'))
    rangeEnd    = new Date(to)
    rangeEnd.setDate(to.getDate() + 1)
    bucketCount = Math.max(1, Math.round((rangeEnd - rangeStart) / 86400000))
    labels = Array.from({ length: bucketCount }, (_, i) => {
      const d = new Date(rangeStart)
      d.setDate(rangeStart.getDate() + i)
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    })
    bucketOf = d => Math.floor((startOfDay(d) - rangeStart) / 86400000)
  } else {
    // 'week' (default)
    rangeStart = startOfDay(now)
    rangeStart.setDate(rangeStart.getDate() - ((now.getDay() + 6) % 7))
    rangeEnd = new Date(rangeStart)
    rangeEnd.setDate(rangeStart.getDate() + 7)
    labels = DAYS
    bucketCount = 7
    bucketOf = d => Math.floor((startOfDay(d) - rangeStart) / 86400000)
  }

  const income  = Array(bucketCount).fill(0)
  const expense = Array(bucketCount).fill(0)

  transactions.forEach(t => {
    const d = new Date(t.date)
    if (d < rangeStart || d >= rangeEnd) return
    const idx = bucketOf(d)
    if (idx < 0 || idx >= bucketCount) return
    const amt = parseFloat(t.amount || 0)
    if (t.transaction_type?.toLowerCase() === 'income')  income[idx]  += amt
    if (t.transaction_type?.toLowerCase() === 'expense') expense[idx] += amt
  })

  return { labels, income, expense, rangeStart, rangeEnd }
}

function buildCategoryData(transactions, rangeStart, rangeEnd) {
  const totals = new Map()
  transactions.forEach(t => {
    if (t.transaction_type?.toLowerCase() !== 'expense') return
    const d = new Date(t.date)
    if (d < rangeStart || d >= rangeEnd) return
    const cat = t.category || 'Other'
    totals.set(cat, (totals.get(cat) || 0) + parseFloat(t.amount || 0))
  })
  const entries = [...totals.entries()].sort((a, b) => b[1] - a[1])
  const labels = entries.map(e => e[0])
  const values = entries.map(e => e[1])
  const colors = labels.map((_, i) => CAT_COLORS[i % CAT_COLORS.length])
  return { labels, values, colors }
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading]           = useState(true)
  const [period, setPeriod]             = useState('week') // 'today' | 'week' | 'month' | 'custom'
  const [customFrom, setCustomFrom]     = useState('')
  const [customTo, setCustomTo]         = useState('')
  const [user,setUser] = useState(null)

  const barRef      = useRef(null)
  const barInst      = useRef(null)
  const catRef       = useRef(null)
  const catInst       = useRef(null)
  const navigate     = useNavigate()

  useEffect(() => {
    api.get('transactions/view/')
      .then(r => setTransactions(r.data.transactions || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    async function fetchUser() {
      try{
        const response = await api.get('accounts/profile/')
        console.log(response.data);
        setUser(response.data.name);
      }catch(error){
        console.log(error);
        
      }

    }
    fetchUser()
  },[])

  const totalIncome  = transactions.filter(t => t.transaction_type?.toLowerCase() === 'income')
                                  .reduce((a, t) => a + parseFloat(t.amount || 0), 0)
  const totalExpense = transactions.filter(t => t.transaction_type?.toLowerCase() === 'expense')
                                  .reduce((a, t) => a + parseFloat(t.amount || 0), 0)
  const balance      = totalIncome - totalExpense

  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  // ── Bar chart (income vs expense over selected period) ──
  useEffect(() => {
    if (loading || !barRef.current) return
    if (period === 'custom' && (!customFrom || !customTo)) return

    if (barInst.current) barInst.current.destroy()

    const { labels, income, expense } = buildPeriodData(transactions, period, customFrom, customTo)

    barInst.current = new Chart(barRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Income',
            data: income,
            backgroundColor: '#2E7D32',
            borderRadius: 6,
            borderSkipped: false,
            barPercentage: 0.5,
          },
          {
            label: 'Expense',
            data: expense,
            backgroundColor: '#D32F2F',
            borderRadius: 6,
            borderSkipped: false,
            barPercentage: 0.5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ' ₹' + Math.round(ctx.raw).toLocaleString('en-IN'),
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { family: 'Inter', size: 11 },
              color: '#8b90ad',
              autoSkip: true,
              maxTicksLimit: period === 'month' ? 10 : undefined,
            },
          },
          y: {
            grid: { color: 'rgba(197,200,212,.35)' },
            border: { dash: [4, 4], display: false },
            ticks: {
              font: { family: 'Inter', size: 11 },
              color: '#8b90ad',
              callback: v => '₹' + Math.round(v / 1000) + 'k',
            },
            beginAtZero: true,
          },
        },
      },
    })

    return () => barInst.current?.destroy()
  }, [transactions, loading, period, customFrom, customTo])

  // ── Category doughnut chart (expense breakdown for same period) ──
  useEffect(() => {
    if (loading || !catRef.current) return
    if (period === 'custom' && (!customFrom || !customTo)) return

    if (catInst.current) catInst.current.destroy()

    const { rangeStart, rangeEnd } = buildPeriodData(transactions, period, customFrom, customTo)
    const { labels, values, colors } = buildCategoryData(transactions, rangeStart, rangeEnd)

    if (labels.length === 0) return

    catInst.current = new Chart(catRef.current, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderColor: '#e8eaf0',
          borderWidth: 3,
          hoverOffset: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.label}: ₹${Math.round(ctx.raw).toLocaleString('en-IN')}`,
            },
          },
        },
      },
    })

    return () => catInst.current?.destroy()
  }, [transactions, loading, period, customFrom, customTo])

  if (loading) {
    return (
      <div className="db-loading">
        <div className="db-spinner" />
        <p>Loading dashboard…</p>
      </div>
    )
  }

  const { rangeStart, rangeEnd } = buildPeriodData(transactions, period, customFrom, customTo)
  const categoryData = buildCategoryData(transactions, rangeStart, rangeEnd)
  const categoryTotal = categoryData.values.reduce((a, v) => a + v, 0)

  return (
    <div className="db">

      <div className="db-head">
        <div>
          <h1 className="db-head__title">Dashboard</h1>
          <p className="db-head__sub">Welcome back <span style={{color:'#3B82F6',fontWeight:'bold'}}> {user?.toUpperCase()}  </span>  — here's your overview</p>
        </div>
        <div className="db-head__actions">
          <div className="db-date">{todayLabel()}</div>
          <button className="db-add-btn" onClick={() => navigate('/add')}>
            <i className="ti ti-plus" aria-hidden="true" />
            Add transaction
          </button>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-card__top">
            <span className="stat-card__label">Total income</span>
            <div className="stat-card__icon stat-card__icon--income">
              <i className="ti ti-trending-up" aria-hidden="true" />
            </div>
          </div>
          <div className="stat-card__val stat-card__val--income">{fmt(totalIncome)}</div>
          <span className="stat-card__chip chip-green">
            <i className="ti ti-arrow-up" aria-hidden="true" /> All time
          </span>
        </div>

        <div className="stat-card">
          <div className="stat-card__top">
            <span className="stat-card__label">Total expense</span>
            <div className="stat-card__icon stat-card__icon--expense">
              <i className="ti ti-trending-down" aria-hidden="true" />
            </div>
          </div>
          <div className="stat-card__val stat-card__val--expense">{fmt(totalExpense)}</div>
          <span className="stat-card__chip chip-red">
            <i className="ti ti-arrow-down" aria-hidden="true" /> All time
          </span>
        </div>

        <div className="stat-card">
          <div className="stat-card__top">
            <span className="stat-card__label">Net balance</span>
            <div className="stat-card__icon stat-card__icon--balance">
              <i className="ti ti-wallet" aria-hidden="true" />
            </div>
          </div>
          <div
            className="stat-card__val"
            style={{ color: balance >= 0 ? '#16a34a' : '#dc2626' }}
          >
            {balance >= 0 ? '+' : '-'}{fmt(Math.abs(balance))}
          </div>
          <span className={`stat-card__chip ${balance >= 0 ? 'chip-green' : 'chip-red'}`}>
            {balance >= 0 ? 'Surplus' : 'Deficit'}
          </span>
        </div>
      </div>

      <div className="bottom-row">

        <div className="nm-card">
          <div className="nm-card__head">
            <h2>Overview</h2>
            <div className="db-filter">
              <select
                className="db-filter__select"
                value={period}
                onChange={e => setPeriod(e.target.value)}
              >
                <option value="today">Today</option>
                <option value="week">This week</option>
                <option value="month">This month</option>
                <option value="custom">Custom range</option>
              </select>
              {period === 'custom' && (
                <div className="db-filter__range">
                  <input
                    type="date"
                    value={customFrom}
                    onChange={e => setCustomFrom(e.target.value)}
                  />
                  <span>–</span>
                  <input
                    type="date"
                    value={customTo}
                    onChange={e => setCustomTo(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-dot dot-income" />Income
            </div>
            <div className="legend-item">
              <span className="legend-dot dot-expense" />Expense
            </div>
          </div>
          <div className="chart-wrap">
            <canvas
              ref={barRef}
              role="img"
              aria-label="Bar chart comparing income and expense for the selected period"
            />
          </div>
        </div>

        <div className="nm-card">
          <div className="nm-card__head">
            <h2>Recent transactions</h2>
            <button
              className="nm-card__link"
              onClick={() => navigate('/transactions')}
            >
              View all
            </button>
          </div>

          {recent.length === 0 ? (
            <div className="txn-empty">
              <i className="ti ti-receipt-off" aria-hidden="true" />
              <p>No transactions yet</p>
            </div>
          ) : (
            <div className="txn-list">
              {recent.map(t => {
                const type   = t.transaction_type?.toLowerCase()
                const icon   = CAT_ICONS[t.category] || 'ti ti-receipt'
                const sign   = type === 'income' ? '+' : '-'
                const amount = parseFloat(t.amount || 0)
                const date   = new Date(t.date).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short',
                })
                return (
                  <div key={t.id} className="txn-row">
                    <div className={`txn-icon txn-icon--${type}`}>
                      <i className={icon} aria-hidden="true" />
                    </div>
                    <div className="txn-info">
                      <div className="txn-desc">{t.description || t.category}</div>
                      <div className="txn-meta">{t.category} · {date}</div>
                    </div>
                    <div className={`txn-amt txn-amt--${type}`}>
                      {sign}{fmt(amount)}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>

      <div className="nm-card">
        <div className="nm-card__head">
          <h2>Spending by category</h2>
          <span>{period === 'today' ? 'Today' : period === 'week' ? 'This week' : period === 'month' ? 'This month' : 'Custom range'}</span>
        </div>

        {categoryData.labels.length === 0 ? (
          <div className="txn-empty">
            <i className="ti ti-chart-pie" aria-hidden="true" />
            <p>No expenses in this period</p>
          </div>
        ) : (
          <div className="cat-row">
            <div className="cat-donut-wrap">
              <canvas
                ref={catRef}
                role="img"
                aria-label="Doughnut chart showing expense breakdown by category"
              />
              <div className="cat-donut-center">
                <span className="cat-donut-total">{fmt(categoryTotal)}</span>
                <span className="cat-donut-label">Total spent</span>
              </div>
            </div>

            <div className="cat-legend">
              {categoryData.labels.map((label, i) => {
                const value = categoryData.values[i]
                const pct = categoryTotal ? Math.round((value / categoryTotal) * 100) : 0
                return (
                  <div className="cat-legend__row" key={label}>
                    <span
                      className="cat-legend__dot"
                      style={{ background: categoryData.colors[i] }}
                    />
                    <span className="cat-legend__label">{label}</span>
                    <span className="cat-legend__pct">{pct}%</span>
                    <span className="cat-legend__val">{fmt(value)}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

    </div>
  )
}