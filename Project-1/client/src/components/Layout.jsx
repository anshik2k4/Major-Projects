import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children, searchQuery, onSearch }) {
  return (
    <>
      <Navbar searchQuery={searchQuery} onSearch={onSearch} />
      <div className="container">{children}</div>
      <Footer />
    </>
  );
}
