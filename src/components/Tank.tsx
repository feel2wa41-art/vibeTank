interface TankProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function Tank({ size = 'md', animated = true }: TankProps) {
  const sizes = {
    sm: { width: 100, height: 50, viewBox: "0 0 120 60" },
    md: { width: 180, height: 70, viewBox: "0 0 200 80" },
    lg: { width: 240, height: 100, viewBox: "0 0 200 80" }
  };

  const { width, height, viewBox } = sizes[size];

  return (
    <svg width={width} height={height} viewBox={viewBox}>
      {/* Tank Body */}
      <rect x="30" y="35" width="120" height="30" fill="#4a5d23" rx="4"/>
      <rect x="40" y="25" width="80" height="20" fill="#3d4d1c" rx="3"/>
      
      {/* Turret */}
      <rect x="60" y="12" width="50" height="20" fill="#4a5d23" rx="4"/>
      
      {/* Cannon */}
      <rect x="110" y="18" width="60" height="8" fill="#3d4d1c" rx="2"/>
      <rect x="165" y="15" width="12" height="14" fill="#2d3a15" rx="2"/>
      
      {/* Tracks */}
      <ellipse cx="45" cy="65" rx="18" ry="12" fill="#2d3a15"/>
      <ellipse cx="135" cy="65" rx="18" ry="12" fill="#2d3a15"/>
      <rect x="45" y="53" width="90" height="24" fill="#2d3a15"/>
      
      {/* Inner wheels */}
      <ellipse cx="45" cy="65" rx="12" ry="8" fill="#1a2310"/>
      <ellipse cx="135" cy="65" rx="12" ry="8" fill="#1a2310"/>
      
      {/* Track wheels */}
      {[55, 75, 95, 115].map((cx, i) => (
        <circle key={i} cx={cx} cy={65} r={6} fill="#3d4d1c" stroke="#1a2310" strokeWidth="1">
          {animated && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`0 ${cx} 65`}
              to={`360 ${cx} 65`}
              dur="1s"
              repeatCount="indefinite"
            />
          )}
        </circle>
      ))}
      
      {/* Star emblem */}
      <polygon 
        points="85,30 87,35 92,35 88,38 90,43 85,40 80,43 82,38 78,35 83,35" 
        fill="#7cb342"
      />
    </svg>
  );
}

export function MovingTank({ x }: { x: number }) {
  return (
    <div 
      className="fixed bottom-8 z-50"
      style={{ 
        left: `${x}px`,
        filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
        transition: 'left 0.3s ease-out'
      }}
    >
      <svg width="100" height="50" viewBox="0 0 120 60">
        <rect x="15" y="25" width="70" height="25" fill="#4a5d23" rx="3"/>
        <rect x="20" y="20" width="50" height="15" fill="#3d4d1c" rx="2"/>
        <rect x="35" y="10" width="30" height="15" fill="#4a5d23" rx="3"/>
        <rect x="65" y="14" width="40" height="6" fill="#3d4d1c" rx="1"/>
        <rect x="100" y="12" width="8" height="10" fill="#2d3a15" rx="1"/>
        <ellipse cx="25" cy="50" rx="12" ry="8" fill="#2d3a15"/>
        <ellipse cx="75" cy="50" rx="12" ry="8" fill="#2d3a15"/>
        <rect x="25" y="42" width="50" height="16" fill="#2d3a15"/>
        {[30, 45, 60].map((cx, i) => (
          <circle key={i} cx={cx} cy={50} r={4} fill="#3d4d1c" stroke="#1a2310" strokeWidth="1">
            <animateTransform 
              attributeName="transform" 
              type="rotate" 
              from={`0 ${cx} 50`} 
              to={`360 ${cx} 50`} 
              dur="0.5s" 
              repeatCount="indefinite"
            />
          </circle>
        ))}
        {/* Dust effect */}
        <circle cx="8" cy="52" r="4" fill="#8b7355" opacity="0.5">
          <animate attributeName="cx" values="8;-10;8" dur="0.8s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.5;0;0.5" dur="0.8s" repeatCount="indefinite"/>
        </circle>
      </svg>
    </div>
  );
}
