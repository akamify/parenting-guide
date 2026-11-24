import Image from "next/image";
import Link from "next/link";
import WhatsAppContactButton from "./WhatsAppContactButton";

const HeroDesktop = () => {
  return (
    <div
      className="relative min-h-svh bg-[#FDFBF7] text-[#4A2B12] overflow-hidden flex flex-col font-sans"
    >
      {/* --- Background Elements --- */}
      {/* Light Professional Background Image (Soft abstract parenting/nature style) */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />

      {/* Soft Glow Orbs for Light Theme */}
      <div className="absolute -left-20 -top-20 w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute -right-20 top-1/2 w-[400px] h-[400px] bg-brand-brown/5 rounded-full blur-[100px] animate-pulse delay-700" />

      {/* --- Header --- */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm">
        <div className="backdrop-blur-xl bg-white/70 border-b border-brand-brown/5 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden ring-1 ring-brand-green/10 bg-white flex items-center justify-center p-1">
                <Image
                  src="/logo.png"
                  width={48}
                  height={48}
                  alt="Parenting Guide"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="text-brand-brown text-xl font-black leading-tight tracking-tight uppercase">
                  Parenting Guide
                </h2>
                <p className="text-brand-green text-[10px] font-black tracking-[0.2em] uppercase">
                  Expert Guidance
                </p>
              </div>
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-brand-brown text-xl font-black italic">
                PREMIUM <span className="text-brand-green">ADVICE</span>
              </div>
              <p className="text-gray-400 text-[11px] font-bold tracking-widest uppercase">
                Nurturing Future
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* --- Main Hero Content --- */}
      <main className="relative z-10 flex-1 flex items-center pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="flex flex-col space-y-6 text-center lg:text-left order-2 lg:order-1">
              <div className="space-y-4">
                <span className="inline-flex items-center py-1.5 px-4 rounded-full bg-white border border-brand-green/20 text-brand-green text-xs font-bold tracking-widest uppercase mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#2d1a0a] mr-2 animate-ping"></span>
                  Open for Consultation
                </span>
                <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[1.05] text-brand-brown">
                  Nourishing Lives,
                  <br />
                  <span className="text-brand-green">Guiding Hearts</span>
                  <br />
                  <span className="text-3xl sm:text-4xl font-bold text-gray-400 mt-2 block italic font-serif">
                    A Professional Approach
                  </span>
                </h1>
              </div>

              {/* CTA Container */}
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/80 border border-brand-brown/10 p-2 rounded-[1rem] shadow-2xl shadow-brand-brown/5 backdrop-blur-xl max-w-xl mx-auto lg:mx-0">
                <div className="flex items-center gap-4 px-6 py-2">
                  <div className="text-center sm:text-left leading-none">
                    <span className="text-brand-green font-black text-xl tracking-tighter">
                      FREE
                    </span>
                    <span className="text-gray-400 text-[10px] block font-bold uppercase tracking-widest">
                      Consultation
                    </span>
                  </div>
                </div>

                <div className="flex w-full min-w-0 items-stretch gap-2 sm:flex-1">
                  <Link
                    href="/form"
                    className="min-w-0 flex-1 rounded-2xl bg-brand-brown px-3 py-5 text-center font-black uppercase tracking-wide text-white shadow-xl transition-colors hover:bg-brand-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green lg:px-5"
                  >
                    Register Now — Free
                  </Link>
                  <WhatsAppContactButton />
                </div>
              </div>

              {/* Mentor Info Card */}
              <div className="flex items-center justify-center lg:justify-start gap-6 pt-6">
                <div className="h-14 w-[2px] bg-gradient-to-b from-transparent via-brand-green/30 to-transparent hidden sm:block" />
                <div className="text-center lg:text-left">
                  <p className="text-brand-green text-[10px] font-black tracking-[0.2em] uppercase mb-1">
                    Certified Parenting Advisor
                  </p>
                  <p className="text-gray-600 text-lg">
                    Mentor by{" "}
                    <span className="text-brand-brown font-black text-2xl block sm:inline ml-1">
                      Mr. Pravesh Gupta
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Content - Mentor Image */}
            <div className="relative order-1 lg:order-2 flex justify-center items-center">
              <div className="relative w-72 sm:w-96 lg:w-[450px] aspect-[4/5]">
                {/* Modern Abstract BG Image Layer */}
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-green/20 to-brand-brown/10 rounded-[3.5rem] -rotate-3 -z-10 scale-105 blur-sm" />

                {/* Image Wrapper */}
                <div className="relative h-full w-full rounded-[2rem] overflow-hidden border-[8px] border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] group">
                  <Image
                    src="/profile.png" // Replace with your actual mentor image
                    fill
                    sizes="(min-width: 1024px) 450px, 320px"
                    alt="Advisor Pravesh Gupta"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out"
                  />
                  {/* Glassy overlay at bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-brand-brown/40 to-transparent opacity-60" />
                </div>

                {/* Floating Stats - Light Mode */}
                <div className="absolute -left-8 top-1/4 backdrop-blur-xl bg-white/90 border border-brand-green/20 p-4 rounded-[1rem] shadow-2xl animate-bounce-slow">
                  <p className="text-2xl font-black text-brand-green leading-none">
                    500+
                  </p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase mt-1">
                    Families Helped
                  </p>
                </div>

                <div className="absolute -right-8 bottom-1/4 backdrop-blur-xl bg-white/90 border border-brand-brown/20 p-4 rounded-[1rem] shadow-2xl animate-bounce-slow delay-700">
                  <p className="text-2xl font-black text-brand-brown leading-none">
                    Expert
                  </p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase mt-1">
                    Guidance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(2deg);
          }
        }

        @keyframes btn-breath {
          0%,
          100% {
            box-shadow:
              0 10px 30px rgba(74, 43, 18, 0.2),
              0 5px 15px rgba(59, 94, 43, 0.1);
          }
          50% {
            box-shadow:
              0 20px 40px rgba(74, 43, 18, 0.4),
              0 10px 20px rgba(59, 94, 43, 0.2);
          }
        }

        .animate-btn-breath {
          animation: btn-breath 3s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HeroDesktop;
