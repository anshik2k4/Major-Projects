import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Layout from "../components/Layout";

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!username.trim() || !email.trim() || !password.trim()) {
      toast.warning("All fields are required!");
      return;
    }

    if (password.length < 6) {
      toast.warning("Password must be at least 6 characters!");
      return;
    }

    setSubmitting(true);

    try {
      await signup({ username, email, password });
      navigate("/login", {
        state: { message: "Account created successfully! Please log in." },
      });
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to create account.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <div className="signup-cont">
        <div className="signup-card">
          <h2 className="form-title">Create Account</h2>

          <form onSubmit={handleSubmit}>
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

            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="unique-input form-control mb-3"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              minLength={6}
            />

            {error && <p className="text-danger small text-center">{error}</p>}

            <button
              type="submit"
              className="btn btn-outline-danger w-75 d-block mx-auto"
              disabled={submitting}
            >
              {submitting ? "Creating account…" : "Sign Up"}
            </button>

            <p className="text-center mt-3">
              Already have an account?{" "}
              <Link to="/login" style={{ color: "rgb(224, 59, 92)" }}>
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
}
