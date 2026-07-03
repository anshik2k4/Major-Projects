import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";

export default function Navbar({ searchQuery = "", onSearch }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const toast = useToast();

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = new FormData(form).get("q")?.toString().trim() || "";
    if (onSearch) {
      onSearch(q);
      return;
    }
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    navigate(params.toString() ? `/?${params}` : "/");
  }

  async function handleLogout() {
    try {
      await logout();
      toast.success("Logged out successfully! See you soon.");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Failed to log out.");
      navigate("/");
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light stayhub-navbar">
      <div className="container-fluid px-3 px-lg-4">
        <div className="d-flex align-items-center flex-shrink-0 gap-2 gap-md-3">
          <Link
            className="navbar-brand stayhub-brand fw-bold mb-0 d-inline-flex align-items-center gap-2"
            to="/"
          >
            <img
              src="/images/stayhub-icon.svg"
              alt=""
              className="stayhub-logo-mark"
              width="40"
              height="40"
              decoding="async"
            />
            <span className="stayhub-wordmark">StayHub</span>
          </Link>

          {user && (
            <Link
              className="btn btn-add-stay d-inline-flex align-items-center"
              to="/listing/new"
              title="Add a new listing"
            >
              <i className="fas fa-plus-circle btn-add-stay__icon" aria-hidden="true" />
              <span className="btn-add-stay__text">Add your Stay</span>
            </Link>
          )}
        </div>

        <button
          className="navbar-toggler stayhub-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse mt-3 mt-lg-0" id="navbarNav">
          <form
            className="navbar-search-form mx-lg-auto my-2 my-lg-0"
            role="search"
            aria-label="Search stays"
            onSubmit={handleSubmit}
          >
            <div className="input-group navbar-search-input-group">
              <input
                type="search"
                name="q"
                className="form-control navbar-search-field"
                placeholder="Search by place, title…"
                defaultValue={searchQuery}
                key={searchQuery}
                autoComplete="off"
                maxLength={120}
                aria-label="Search listings"
              />
              <button className="btn btn-search-submit" type="submit" aria-label="Search">
                <i className="fas fa-search me-md-1" aria-hidden="true" />
                <span className="d-none d-md-inline">Search</span>
              </button>
            </div>
          </form>

          <ul className="navbar-nav stayhub-nav-actions ms-lg-3 align-items-center gap-lg-1 pt-2 pt-lg-0 border-top border-lg-0 mt-2 mt-lg-0">
            {user ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle stayhub-nav-user fw-semibold"
                  href="#"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-user-circle me-1" aria-hidden="true" />
                  {user.username}
                </a>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0">
                  <li>
                    <button
                      type="button"
                      className="dropdown-item fw-semibold text-danger"
                      onClick={handleLogout}
                    >
                      <i className="fas fa-sign-out-alt me-2" aria-hidden="true" />
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    to="/login"
                    className="btn btn-outline-danger stayhub-auth-btn px-3 py-2"
                  >
                    <i className="fas fa-sign-in-alt me-1" aria-hidden="true" />
                    Login
                  </Link>
                </li>
                <li className="nav-item ms-2">
                  <Link to="/signup" className="btn btn-danger stayhub-auth-btn px-3 py-2">
                    <i className="fas fa-user-plus me-1" aria-hidden="true" />
                    Signup
                  </Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <button
                type="button"
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
                title="Toggle dark mode"
              >
                <i className={`fas ${isDark ? "fa-moon" : "fa-sun"}`} aria-hidden="true" />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
