import { Tank } from './Tank';
import { useData } from '../context/DataContext';

export function HeroSection() {
  const { profileInfo } = useData();
  return (
    <section className="flex-shrink-0 w-screen h-screen flex items-center justify-center relative">
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: 'linear-gradient(rgba(124, 179, 66, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(124, 179, 66, 0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>
      
      <div className="text-center z-10 px-8">
        <p className="mono-font text-sm tracking-[0.5em] text-military-500 uppercase mb-6">
          ◆ {profileInfo.role} ◆
        </p>
        
        <h1 
          className="military-font text-7xl md:text-9xl text-military-500 tracking-wider mb-4"
          style={{ textShadow: '0 0 60px rgba(124, 179, 66, 0.5)' }}
        >
          {profileInfo.name}
        </h1>
        
        <div className="flex justify-center mb-6">
          <Tank size="md" animated />
        </div>
        
        <p className="text-lg text-military-300 font-light tracking-wide mb-8">
          「 {profileInfo.tagline} 」
        </p>
        
        <div className="flex items-center justify-center gap-2 text-military-500/60 mono-font text-sm animate-pulse">
          <span>SCROLL</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
          </svg>
        </div>
      </div>
      
      {/* Year watermark */}
      <div 
        className="absolute right-8 top-1/2 -translate-y-1/2 mono-font text-[12rem] font-bold text-military-700/10 hidden lg:block"
        style={{ writingMode: 'vertical-rl' }}
      >
        {profileInfo.year}
      </div>
      
      {/* Start marker */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 lg:hidden">
        <div className="w-px h-32 bg-gradient-to-b from-transparent via-military-500 to-transparent"/>
        <div className="mono-font text-military-500 text-xs tracking-widest rotate-90">START</div>
        <div className="w-px h-32 bg-gradient-to-b from-transparent via-military-500 to-transparent"/>
      </div>
    </section>
  );
}
