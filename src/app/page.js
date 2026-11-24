import HeroMain from "./components/HeroMain";
import LearningForm from "./components/LearningForm";
import TradingProgram from "./components/TradingProgram";
import VideoTestimonials from "./components/VideoTestimonials";
import GallerySection from "./event/GallerySection";

export const metadata = { alternates: { canonical: "/" }, openGraph: { url: "/" } };


function Hero() {
  return (
    <div className="min-h-screen bg-brand-light text-brand-brown overflow-x-clip">
      <main id="main-content" tabIndex={-1}>
        <HeroMain />
        <VideoTestimonials />
        <TradingProgram />
        <GallerySection />
        <LearningForm />
      </main>
    </div>
  );
}

export default Hero;
