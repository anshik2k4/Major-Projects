export default function Footer() {
  return (
    <footer className="bg-white border-top py-3 mt-auto">
      <div className="container-fluid px-4">
        <div className="footer-info d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 small">
          <div className="d-flex flex-wrap gap-2">
            <p className="mb-0">&copy; 2026 StayHub, Inc.</p>
            <p className="mb-0">
              <a href="#" className="text-dark text-decoration-none">
                · Privacy
              </a>
            </p>
            <p className="mb-0">
              <a href="#" className="text-dark text-decoration-none">
                · Terms
              </a>
            </p>
          </div>
          <div className="d-flex align-items-center gap-3">
            <a href="#" className="text-dark text-decoration-none d-flex align-items-center gap-1">
              <i className="fa-solid fa-globe" /> English (IN)
            </a>
            <a href="#" className="text-dark text-decoration-none d-flex align-items-center gap-1">
              <i className="fa-solid fa-indian-rupee-sign" /> INR
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
