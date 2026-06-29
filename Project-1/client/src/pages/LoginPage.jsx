import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const successMessage = location.state?.message || "";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login({ username, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <div className="signup-cont">
        <div className="signup-card">
          <h2 className="form-title">Welcome Back 👋</h2>

          {successMessage && (
            <p className="text-success small text-center">{successMessage}</p>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              className="unique-input form-control mb-3"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="unique-input form-control mb-3"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="text-danger small text-center">{error}</p>}

            <button
              type="submit"
              className="btn btn-outline-danger w-75 d-block mx-auto mb-3"
              disabled={submitting}
            >
              {submitting ? "Logging in…" : "Login"}
            </button>

            <p className="text-center mt-2">
              Don&apos;t have an account?{" "}
              <Link to="/signup" style={{ color: "rgb(224, 59, 92)" }}>
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
}
