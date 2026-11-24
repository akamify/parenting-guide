'use client';
import HeroDesktopUi from '../components/HeroDesktop'; // Adjust import path as needed
import HeroMobileUI from '../components/Hero'; // Adjust import path as needed

const HeroMain = () => {
  return (
    <section id="hero">
      <div className="lg:hidden"><HeroMobileUI /></div>
      <div className="hidden lg:block"><HeroDesktopUi /></div>
    </section>
  );
};

export default HeroMain;
