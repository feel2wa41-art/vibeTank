import { useEffect, useState } from 'react';

interface RadarVisualProps {
  icon: string;
  iconImage?: string;
}

export function RadarVisual({ icon, iconImage }: RadarVisualProps) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(r => (r + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-military-900 to-military-950 border-2 border-military-700/50 flex items-center justify-center">
      {/* Radar effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="w-48 h-48 rounded-full border border-military-500/30"
          style={{ 
            transform: `rotate(${rotation}deg)`,
          }}
        >
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0deg, rgba(124, 179, 66, 0.3) 30deg, transparent 60deg)'
            }}
          />
        </div>
        <div className="absolute w-32 h-32 rounded-full border border-military-500/20"/>
        <div className="absolute w-16 h-16 rounded-full border border-military-500/20"/>
      </div>
      
      {/* Center icon */}
      <div className="relative z-10">
        {iconImage ? (
          <img
            src={iconImage}
            alt="Project Logo"
            className="w-24 h-24 object-contain drop-shadow-lg"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <span className={`text-7xl ${iconImage ? 'hidden' : ''}`}>{icon}</span>
      </div>
      
      {/* Corner brackets */}
      <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-military-500"/>
      <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-military-500"/>
      <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-military-500"/>
      <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-military-500"/>
      
      {/* Status */}
      <div className="absolute bottom-4 right-12 text-military-500 text-xs mono-font animate-pulse">
        ● ACTIVE
      </div>
    </div>
  );
}
