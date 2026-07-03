import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../Api";
import "../Style/Login.css";

export default function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiErr, setApiErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function validate() {
    const e = {};
    if (!username.trim()) e.username = "Username is required";
    if (!password.trim()) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setApiErr("");
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await api.post("accounts/login/", {
        username,
        password,
      });
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      localStorage.setItem("username", username);
      setIsLoggedIn(true);
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      const msg =
        err?.response?.data?.detail || "Invalid username or password.";
      setApiErr(msg);
    } finally {
      setLoading(false);
    }
  }

  function clearFieldErr(field) {
    setErrors((prev) => {
      const n = { ...prev };
      delete n[field];
      return n;
    });
    setApiErr("");
    setSuccess(false);
  }

  return (
    <div className="ls-page">
      <div className="ls-layout">
        {/* ══ LEFT — Brand panel ══ */}
        <div className="ls-left">
          <div className="ls-left-inner">
            <div className="ls-brand">
              <div className="ls-brand-ico">
                <i className="ti ti-wallet" aria-hidden="true" />
              </div>
              <span className="ls-brand-name">Fintrack</span>
            </div>

            <div className="ls-hero">
              <h1>
                Take control of your <span>finances</span>, effortlessly
              </h1>
              <p>
                Track income, expenses and budgets in one beautiful place.
                Real-time insights that help you spend smarter every day.
              </p>
            </div>

            <div className="ls-feats">
              {[
                {
                  icon: "ti-chart-line",
                  title: "Live analytics",
                  desc: "Charts update as you add transactions",
                },
                {
                  icon: "ti-shield-check",
                  title: "Secure & private",
                  desc: "Your data is encrypted and never shared",
                },
                {
                  icon: "ti-bell",
                  title: "Budget alerts",
                  desc: "Get notified before you overspend",
                },
                {
                  icon: "ti-download",
                  title: "Export reports",
                  desc: "Download your data as CSV anytime",
                },
              ].map((f) => (
                <div key={f.title} className="ls-feat">
                  <div className="ls-feat-ico">
                    <i className={`ti ${f.icon}`} aria-hidden="true" />
                  </div>
                  <div className="ls-feat-text">
                    <strong>{f.title}</strong>
                    <span>{f.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="ls-trust">
              <span className="ls-trust-dot" />
              12,000+ users · ₹2.4B tracked · 4.9 ★ rating
            </div>
          </div>
        </div>

        {/* ══ RIGHT — Form panel ══ */}
        <div className="ls-right">
          <div className="ls-right-inner">
            <div className="ls-form-head">
              <div className="ls-form-brand">
                <div className="ls-brand-ico ls-brand-ico--sm">
                  <i className="ti ti-wallet" aria-hidden="true" />
                </div>
                <span className="ls-brand-name ls-brand-name--sm">
                  Fintrack
                </span>
              </div>
              <h2>Welcome back</h2>
              <p>Sign in to continue to your account</p>
            </div>

            <div className="ls-card">
              {apiErr && (
                <div className="ls-banner ls-banner--err">
                  <i className="ti ti-alert-circle" aria-hidden="true" />
                  <span>{apiErr}</span>
                </div>
              )}

              {success && (
                <div className="ls-banner ls-banner--ok">
                  <i className="ti ti-check" aria-hidden="true" />
                  Signed in successfully! Redirecting…
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="ls-field">
                  <label htmlFor="f-username">Username</label>
                  <div className="ls-inp-wrap">
                    <i className="ti ti-user ls-inp-ico" aria-hidden="true" />
                    <input
                      className={`ls-input${errors.username ? " ls-input--err" : ""}`}
                      id="f-username"
                      type="text"
                      placeholder="Your username"
                      value={username}
                      autoComplete="username"
                      onChange={(e) => {
                        setUsername(e.target.value);
                        clearFieldErr("username");
                      }}
                    />
                  </div>
                  {errors.username && (
                    <span className="ls-err">
                      <i className="ti ti-alert-circle" /> {errors.username}
                    </span>
                  )}
                </div>

                <div className="ls-field">
                  <label htmlFor="f-pass">Password</label>
                  <div className="ls-inp-wrap">
                    <i className="ti ti-lock ls-inp-ico" aria-hidden="true" />
                    <input
                      className={`ls-input ls-input--pr${errors.password ? " ls-input--err" : ""}`}
                      id="f-pass"
                      type={showPw ? "text" : "password"}
                      placeholder="Your password"
                      value={password}
                      autoComplete="current-password"
                      onChange={(e) => {
                        setPassword(e.target.value);
                        clearFieldErr("password");
                      }}
                    />
                    <button
                      type="button"
                      className="ls-eye-btn"
                      onClick={() => setShowPw((v) => !v)}
                      aria-label={showPw ? "Hide password" : "Show password"}
                    >
                      <i
                        className={`ti ${showPw ? "ti-eye-off" : "ti-eye"}`}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                  {errors.password && (
                    <span className="ls-err">
                      <i className="ti ti-alert-circle" /> {errors.password}
                    </span>
                  )}
                </div>

                <div className="ls-row">
                  <label className="ls-remember" htmlFor="f-remember">
                    <div
                      className={`ls-checkbox${remember ? " ls-checkbox--checked" : ""}`}
                      role="checkbox"
                      aria-checked={remember}
                      tabIndex={0}
                      onClick={() => setRemember((v) => !v)}
                      onKeyDown={(e) => e.key === " " && setRemember((v) => !v)}
                      id="f-remember"
                    >
                      {remember && (
                        <i className="ti ti-check" aria-hidden="true" />
                      )}
                    </div>
                    Remember me
                  </label>
                  <Link to="/forgot-password" className="ls-forgot">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="ls-btn-login"
                  disabled={loading || success}
                >
                  {loading ? (
                    <>
                      <i
                        className="ti ti-loader-2 ls-spin"
                        aria-hidden="true"
                      />{" "}
                      Signing in…
                    </>
                  ) : (
                    <>
                      <i className="ti ti-login" aria-hidden="true" /> Sign in
                    </>
                  )}
                </button>

                <div className="ls-divider">or continue with</div>

                <div className="ls-social-row">
                  <button type="button" className="ls-btn-social">
                    <i className="ti ti-brand-google" aria-hidden="true" />{" "}
                    Google
                  </button>
                  <button type="button" className="ls-btn-social">
                    <i className="ti ti-brand-windows" aria-hidden="true" />{" "}
                    Microsoft
                  </button>
                </div>
              </form>
            </div>

            <p className="ls-register-link">
              Don't have an account? <Link to="/register">Create one free</Link>
            </p>
          </div>
        </div>
      </div>

      {success && (
        <div className="ls-success-overlay" role="status" aria-live="polite">
          <div className="ls-success-card">
            <div className="ls-success-icon">
              <i className="ti ti-check" aria-hidden="true" />
            </div>
            <h3>Welcome back!</h3>
            <p>Signed in successfully. Taking you to your dashboard…</p>
            <div className="ls-success-bar">
              <div className="ls-success-bar-fill" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
