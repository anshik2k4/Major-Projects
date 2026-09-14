import Header from "./components/Header";
import Hero from "./components/Hero";
import TrustStats from "./components/TrustStats";
import LogoCloud from "./components/LogoCloud";
import Services from "./components/Services";
import WhyChooseUs from "./components/WhyChooseUs";
import ProcessTimeline from "./components/ProcessTimeline";
import GeoComparison from "./components/GeoComparison";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustStats />
        <LogoCloud />
        <Services />
        <WhyChooseUs />
        <ProcessTimeline />
        <GeoComparison />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
