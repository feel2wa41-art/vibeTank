interface NavbarProps {
  progress: number;
}

export function Navbar({ progress }: NavbarProps) {
  return (
    <>
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-military-900 z-50">
        <div 
          className="h-full bg-military-500 transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Navigation */}
      <nav className="fixed top-1 left-0 w-full px-8 py-4 flex justify-between items-center z-50 bg-military-950/90 backdrop-blur-sm border-b border-military-700/30">
        <div className="military-font text-xl tracking-widest text-military-500">
          ⬢ TANK
        </div>
        <div className="mono-font text-sm text-military-300">
          ← SCROLL HORIZONTALLY →
        </div>
        <div className="mono-font text-sm text-military-500">
          GDC PM | 2025
        </div>
      </nav>
    </>
  );
}
