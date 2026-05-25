import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getApiErrorMessage, validateSignupInput } from "../utils/validation.js";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateSignupInput(formData);

    setFieldErrors(nextErrors);
    setError("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      await signup(formData);
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to create account"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-panel auth-panel--auth">
        <div className="brand-block">
          <span className="brand-pill">FocusVault</span>
          <h1>Create your account.</h1>
          <p>Set up secure access to your smart notes dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <label>
            Name
            <input
              value={formData.name}
              onChange={(event) => setFormData({ ...formData, name: event.target.value })}
              placeholder="Your name"
              autoComplete="name"
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? "signup-name-error" : undefined}
              required
            />
            {fieldErrors.name ? (
              <span className="field-error" id="signup-name-error">
                {fieldErrors.name}
              </span>
            ) : null}
          </label>

          <label>
            Email
            <input
              type="email"
              value={formData.email}
              onChange={(event) => setFormData({ ...formData, email: event.target.value })}
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "signup-email-error" : undefined}
              required
            />
            {fieldErrors.email ? (
              <span className="field-error" id="signup-email-error">
                {fieldErrors.email}
              </span>
            ) : null}
          </label>

          <label>
            Password
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? "signup-password-error" : undefined}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((previous) => !previous)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {fieldErrors.password ? (
              <span className="field-error" id="signup-password-error">
                {fieldErrors.password}
              </span>
            ) : null}
          </label>

          <p className="form-hint">Press Enter to create the account after validation passes.</p>

          {error ? (
            <div className="form-error" role="alert" aria-live="polite">
              {error}
            </div>
          ) : null}

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
