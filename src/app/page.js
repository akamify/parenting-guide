"use client";

import HeroMain from "./components/HeroMain";
import LearningForm from "./components/LearningForm";
import TradingProgram from "./components/TradingProgram";
import VideoTestimonials from "./components/VideoTestimonials";
import GallerySection from "./event/GallerySection";


function Hero() {
  return (
    <div className="min-h-screen bg-brand-light text-brand-brown overflow-x-clip">
      <main>
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
