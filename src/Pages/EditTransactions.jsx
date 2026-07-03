import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../Api'
import '../Style/Edit.css'

const CATEGORIES = {
  income:  ['Salary', 'Freelance', 'Business', 'Investment', 'Gift'],
  expense: ['Food', 'Transport', 'Utilities', 'Shopping', 'Healthcare',
            'Education', 'Entertainment', 'Rent', 'EMI'],
}

const PAYMENT_METHODS = [
  'Cash', 'UPI', 'Card', 'Bank Transfer', 'Cheque', 'Credit Card', 'Wallet',
]

const CAT_ICONS = {
  Salary: 'ti ti-briefcase', Freelance: 'ti ti-code', Business: 'ti ti-building',
  Investment: 'ti ti-chart-line', Gift: 'ti ti-gift', Food: 'ti ti-tools-kitchen-2',
  Transport: 'ti ti-car', Utilities: 'ti ti-bolt', Shopping: 'ti ti-shopping-bag',
  Healthcare: 'ti ti-heart', Education: 'ti ti-book', Entertainment: 'ti ti-music',
  Rent: 'ti ti-home', EMI: 'ti ti-credit-card',
}

function fmt(n) {
  return parseFloat(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function EditTransaction() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [txnType,  setTxnType]  = useState('income')
  const [amount,   setAmount]   = useState('')
  const [date,     setDate]     = useState('')
  const [category, setCategory] = useState('')
  const [payment,  setPayment]  = useState('')
  const [desc,     setDesc]     = useState('')
  const [notes,    setNotes]    = useState('')
  const [errors,   setErrors]   = useState({})
  const [loading,  setLoading]  = useState(false)
  const [fetching, setFetching] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [success,  setSuccess]  = useState(null)
  const [confirmDel, setConfirmDel] = useState(false)

  const isIncome = txnType === 'income'
  const color    = isIncome ? '#16a34a' : '#dc2626'
  const sign     = isIncome ? '+' : '-'
  const prevIcon = CAT_ICONS[category] || (isIncome ? 'ti ti-trending-up' : 'ti ti-trending-down')
  const prevDate = date
    ? new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })
    : 'Date'

  useEffect(() => {
    let cancelled = false
    async function load() {
      setFetching(true)
      try {
        const res = await api.get(`transactions/view-single/${id}/`)
        if (cancelled) return
        const t = res.data
        setTxnType(t.transaction_type || 'income')
        setAmount(String(t.amount ?? ''))
        setDate(t.date || '')
        setCategory(t.category || '')
        setPayment(t.payment_method || '')
        setDesc(t.description || '')
        setNotes(t.notes || '')
      } catch (err) {
        console.error(err)
        if (!cancelled) setErrors({ api: 'Could not load this transaction.' })
      } finally {
        if (!cancelled) setFetching(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  function switchType(t) {
    setTxnType(t)
    if (!CATEGORIES[t].includes(category)) setCategory('')
    setErrors({})
  }

  function validate() {
    const e = {}
    if (!parseFloat(amount) || parseFloat(amount) <= 0) e.amount   = 'Enter a valid amount'
    if (!date)                                           e.date     = 'Select a date'
    if (!category)                                       e.category = 'Select a category'
    if (!payment)                                        e.payment  = 'Select a payment method'
    if (!desc.trim())                                    e.desc     = 'Enter a description'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await api.put(`transactions/update/${id}/`, {
        transaction_type: txnType,
        amount: parseFloat(amount),
        date, category,
        payment_method: payment,
        description: desc.trim(),
        notes: notes.trim(),
      })
      setSuccess(`${category} · ${sign}${fmt(amount)} updated.`)
      setTimeout(() => setSuccess(null), 4000)
    } catch (err) {
      console.error(err)
      setErrors({ api: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirmDel) { setConfirmDel(true); return }
    setDeleting(true)
    try {
      await api.delete(`transactions/${id}/delete/`)
      navigate('/transactions')
    } catch (err) {
      console.error(err)
      setErrors({ api: 'Could not delete this transaction.' })
      setDeleting(false)
      setConfirmDel(false)
    }
  }

  if (fetching) {
    return (
      <div className="ss-layout">
        <div className="ss-left">
          <div className="ss-head">
            <button className="at-back" onClick={() => navigate('/transactions')} aria-label="Go back">
              <i className="ti ti-arrow-left" aria-hidden="true" />
            </button>
            <div>
              <h1 className="ss-title">Edit transaction</h1>
              <p className="ss-sub">Loading transaction details…</p>
            </div>
          </div>
          <div className="at-card">
            <div className="at-card__title">
              <i className="ti ti-loader-2 at-spin" aria-hidden="true" /> Fetching…
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="ss-layout">

      <div className="ss-left">
        <div className="ss-head">
          <button className="at-back" onClick={() => navigate('/transactions')} aria-label="Go back">
            <i className="ti ti-arrow-left" aria-hidden="true" />
          </button>
          <div>
            <h1 className="ss-title">Edit transaction</h1>
            <p className="ss-sub">Update the details of this entry</p>
          </div>
        </div>

        <div className="at-type-toggle" role="group" aria-label="Transaction type">
          <button type="button"
            className={`at-type-btn ${isIncome ? 'at-type-btn--income' : 'at-type-btn--off'}`}
            onClick={() => switchType('income')}>
            <i className="ti ti-trending-up" aria-hidden="true" /> Income
          </button>
          <button type="button"
            className={`at-type-btn ${!isIncome ? 'at-type-btn--expense' : 'at-type-btn--off'}`}
            onClick={() => switchType('expense')}>
            <i className="ti ti-trending-down" aria-hidden="true" /> Expense
          </button>
        </div>

        <form className="at-card" onSubmit={handleSubmit} noValidate>
          <div className="at-card__title">
            <i className="ti ti-receipt" aria-hidden="true" /> Transaction details
          </div>
          <div className="at-fg">
            <div className="at-field">
              <label htmlFor="f-amount">Amount</label>
              <div className="at-amt-wrap">
                <span className="at-amt-pfx">₹</span>
                <input className={`at-input at-input--amt${errors.amount ? ' at-input--err' : ''}`}
                  id="f-amount" type="number" min="0" step="0.01" placeholder="0.00"
                  value={amount} onChange={e => setAmount(e.target.value)} />
              </div>
              {errors.amount && <span className="at-err">{errors.amount}</span>}
            </div>

            <div className="at-field">
              <label htmlFor="f-date">Date</label>
              <input className={`at-input${errors.date ? ' at-input--err' : ''}`}
                id="f-date" type="date" value={date} onChange={e => setDate(e.target.value)} />
              {errors.date && <span className="at-err">{errors.date}</span>}
            </div>

            <div className="at-field">
              <label htmlFor="f-cat">Category</label>
              <select className={`at-select${errors.category ? ' at-input--err' : ''}`}
                id="f-cat" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">Select category</option>
                {CATEGORIES[txnType].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <span className="at-err">{errors.category}</span>}
            </div>

            <div className="at-field">
              <label htmlFor="f-pay">Payment method</label>
              <select className={`at-select${errors.payment ? ' at-input--err' : ''}`}
                id="f-pay" value={payment} onChange={e => setPayment(e.target.value)}>
                <option value="">Select method</option>
                {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              {errors.payment && <span className="at-err">{errors.payment}</span>}
            </div>

            <div className="at-field at-field--full">
              <label htmlFor="f-desc">Description</label>
              <input className={`at-input${errors.desc ? ' at-input--err' : ''}`}
                id="f-desc" type="text" placeholder="What was this for?"
                value={desc} onChange={e => setDesc(e.target.value)} />
              {errors.desc && <span className="at-err">{errors.desc}</span>}
            </div>

            <div className="at-field at-field--full">
              <label htmlFor="f-notes">Notes <span className="at-optional">(optional)</span></label>
              <textarea className="at-textarea" id="f-notes" placeholder="Any extra details…"
                value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
          </div>

          {errors.api && (
            <div className="at-api-err">
              <i className="ti ti-alert-circle" aria-hidden="true" /> {errors.api}
            </div>
          )}

          <div className="at-actions">
            <button type="button" className="at-btn-cancel" onClick={handleDelete} disabled={deleting}>
              {deleting
                ? <><i className="ti ti-loader-2 at-spin" aria-hidden="true" /> Deleting…</>
                : confirmDel
                  ? <><i className="ti ti-alert-triangle" aria-hidden="true" /> Confirm delete</>
                  : <><i className="ti ti-trash" aria-hidden="true" /> Delete</>}
            </button>
            <button type="submit" className="at-btn-submit" disabled={loading}>
              {loading
                ? <><i className="ti ti-loader-2 at-spin" aria-hidden="true" /> Saving…</>
                : <><i className="ti ti-check" aria-hidden="true" /> Save changes</>}
            </button>
          </div>
        </form>
      </div>

      <div className="ss-right">
        <div className="ss-panel-label">Live preview</div>
        <div className="ss-prev-card">
          <div className="ss-prev-ico" style={{ color }}>
            <i className={prevIcon} aria-hidden="true" />
          </div>
          <div className="ss-prev-info">
            <div className="ss-prev-desc">{desc || 'Description will appear here'}</div>
            <div className="ss-prev-meta">{category || 'Category'} · {prevDate} · {payment || 'Payment'}</div>
          </div>
          <div className="ss-prev-amt" style={{ color }}>{sign}₹{fmt(amount || 0)}</div>
        </div>

        <div className="ss-panel-label">Summary</div>
        <div className="ss-sum-grid">
          <div className="ss-sum-card">
            <div className="ss-sum-lbl">Type</div>
            <div className="ss-sum-val" style={{ color, fontSize: 14 }}>{isIncome ? 'Income' : 'Expense'}</div>
          </div>
          <div className="ss-sum-card">
            <div className="ss-sum-lbl">Amount</div>
            <div className="ss-sum-val" style={{ color }}>₹{fmt(amount || 0)}</div>
          </div>
          <div className="ss-sum-card">
            <div className="ss-sum-lbl">Category</div>
            <div className="ss-sum-val" style={{ fontSize: 13 }}>{category || '—'}</div>
          </div>
          <div className="ss-sum-card">
            <div className="ss-sum-lbl">Payment</div>
            <div className="ss-sum-val" style={{ fontSize: 13 }}>{payment || '—'}</div>
          </div>
        </div>

        <div className="ss-panel-label">Tips</div>
        <div className="ss-tips">
          <div className="ss-tip"><i className="ti ti-bulb" aria-hidden="true" />Changes are saved only after you click "Save changes".</div>
          <div className="ss-tip"><i className="ti ti-trash" aria-hidden="true" />Deleting a transaction is permanent and can't be undone.</div>
          <div className="ss-tip"><i className="ti ti-notes" aria-hidden="true" />Update notes to keep vendor or order details current.</div>
        </div>

        {success && (
          <div className="ss-toast">
            <div className="ss-toast-ico"><i className="ti ti-check" aria-hidden="true" /></div>
            <div>
              <p className="ss-toast-title">Transaction updated!</p>
              <span className="ss-toast-sub">{success}</span>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}