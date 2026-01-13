import { useState, useEffect, useRef } from 'react';

export function Goals2026Section() {
  const [loaded, setLoaded] = useState(false);
  const [activeGoal, setActiveGoal] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => setLoaded(true), 300);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!loaded) return;

    const interval = setInterval(() => {
      setActiveGoal(prev => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, [loaded]);

  // Particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particleCount = 60;
    const particles: {x: number; y: number; vx: number; vy: number; size: number; color: string}[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 2 + 0.5,
        color: ['#00f5ff', '#ff00ff', '#ffff00', '#00ff88'][Math.floor(Math.random() * 4)]
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 15, 10, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(124, 179, 66, ${0.15 - dist / 600})`;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const goals = [
    {
      id: 1,
      title: "MTI MAINTENANCE",
      subtitle: "Claude AI Integration",
      description: "Achieving complete mastery of MTI system maintenance through Claude AI. Building intelligent automation and predictive maintenance.",
      icon: "🤖",
      color: "#00f5ff",
      features: ["AI Diagnostics", "Auto-Recovery", "Predictive Analytics", "Zero-Downtime"]
    },
    {
      id: 2,
      title: "LECTURE SYSTEM",
      subtitle: "Next-Gen Education",
      description: "Revolutionary learning management system with AI tutoring, real-time collaboration, and immersive content delivery.",
      icon: "🎓",
      color: "#ff00ff",
      features: ["AI Tutor", "VR/AR Learning", "Real-time Analytics", "Adaptive Curriculum"]
    },
    {
      id: 3,
      title: "KB FINANCIAL KPI",
      subtitle: "Enterprise Intelligence",
      description: "Building cutting-edge KPI management system for KB Financial Group with real-time dashboards and AI-driven insights.",
      icon: "📊",
      color: "#ffff00",
      features: ["Live Dashboards", "AI Predictions", "Auto Reports", "Goal Tracking"]
    },
    {
      id: 4,
      title: "AI EXPANSION",
      subtitle: "IT Innovation & Growth",
      description: "Expanding IT capabilities through AI solutions, machine learning, automation, and intelligent systems.",
      icon: "🚀",
      color: "#00ff88",
      features: ["ML Integration", "Process Automation", "Smart Analytics", "AI Consulting"]
    }
  ];

  return (
    <section
      ref={sectionRef}
      className="flex-shrink-0 w-screen h-screen relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a0f0a 0%, #050a05 50%, #0a1510 100%)' }}
    >
      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Hex grid pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%237CB342' fill-opacity='0.15'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      {/* Scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(124, 179, 66, 0.03) 2px, rgba(124, 179, 66, 0.03) 4px)'
        }}
      />

      {/* Left connector */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-military-700/50"/>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 border-4 border-military-950"/>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-8 py-16">
        {/* Header */}
        <div className={`text-center mb-8 transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <p className="mono-font text-sm tracking-[0.4em] text-cyan-400/80 uppercase mb-3">
            ◆ NEXT LEVEL OBJECTIVES ◆
          </p>
          <h2
            className="military-font text-5xl md:text-7xl font-black mb-3"
            style={{
              background: 'linear-gradient(135deg, #00f5ff, #ff00ff, #ffff00)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 60px rgba(0, 245, 255, 0.3)'
            }}
          >
            2026 GOALS
          </h2>
          <p className="mono-font text-military-300 text-sm">MISSION ROADMAP</p>
        </div>

        {/* Goals Grid - 2x2 */}
        <div className={`grid grid-cols-2 gap-4 max-w-4xl w-full mb-8 transition-all duration-1000 delay-300 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {goals.map((goal, index) => (
            <div
              key={goal.id}
              onClick={() => setActiveGoal(index)}
              className={`relative p-5 rounded-xl cursor-pointer transition-all duration-500 border-2 ${
                activeGoal === index
                  ? 'scale-[1.02] shadow-2xl'
                  : 'hover:scale-[1.01]'
              }`}
              style={{
                borderColor: activeGoal === index ? goal.color : 'rgba(124, 179, 66, 0.2)',
                background: activeGoal === index
                  ? `linear-gradient(135deg, rgba(10, 15, 10, 0.95), rgba(${goal.color === '#00f5ff' ? '0, 245, 255' : goal.color === '#ff00ff' ? '255, 0, 255' : goal.color === '#ffff00' ? '255, 255, 0' : '0, 255, 136'}, 0.1))`
                  : 'rgba(10, 15, 10, 0.8)',
                boxShadow: activeGoal === index ? `0 0 30px ${goal.color}30` : 'none'
              }}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-3">
                <div
                  className="text-3xl"
                  style={{
                    filter: activeGoal === index ? `drop-shadow(0 0 15px ${goal.color})` : 'none'
                  }}
                >
                  {goal.icon}
                </div>
                <span
                  className="mono-font text-xs px-2 py-1 rounded-full border"
                  style={{ borderColor: goal.color, color: goal.color, opacity: 0.8 }}
                >
                  Q{goal.id}
                </span>
              </div>

              {/* Title */}
              <h3
                className="military-font text-lg font-bold mb-1"
                style={{ color: goal.color }}
              >
                {goal.title}
              </h3>
              <p className="mono-font text-military-400 text-xs mb-2">{goal.subtitle}</p>

              {/* Description - only show for active */}
              <p className={`text-military-300 text-xs leading-relaxed mb-3 transition-all duration-300 ${
                activeGoal === index ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'
              }`}>
                {goal.description}
              </p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-1">
                {goal.features.map((feature, fi) => (
                  <div
                    key={fi}
                    className="flex items-center gap-1.5 text-xs mono-font"
                  >
                    <span
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: goal.color }}
                    />
                    <span className="text-military-400">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Progress indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden rounded-b-xl">
                <div
                  className="h-full transition-all duration-1000"
                  style={{
                    width: activeGoal === index ? '100%' : '0%',
                    background: `linear-gradient(90deg, ${goal.color}, transparent)`
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Timeline Preview */}
        <div className={`w-full max-w-4xl transition-all duration-1000 delay-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 via-yellow-500 to-green-500 opacity-60" />

            <div className="flex justify-between relative">
              {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter, i) => (
                <div
                  key={quarter}
                  className="flex flex-col items-center cursor-pointer transition-transform hover:scale-110"
                  onClick={() => setActiveGoal(i)}
                >
                  <div
                    className={`w-3 h-3 rounded-full border-2 z-10 transition-all duration-300 ${
                      activeGoal === i ? 'scale-150' : ''
                    }`}
                    style={{
                      borderColor: goals[i].color,
                      backgroundColor: activeGoal === i ? goals[i].color : '#0a0f0a',
                      boxShadow: activeGoal === i ? `0 0 20px ${goals[i].color}` : 'none'
                    }}
                  />
                  <div
                    className="military-font text-sm mt-3 transition-colors"
                    style={{ color: activeGoal === i ? goals[i].color : '#7CB342' }}
                  >
                    {quarter}
                  </div>
                  <div className="mono-font text-[10px] text-military-500 mt-0.5 text-center max-w-[80px]">
                    {goals[i].title.split(' ')[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`mt-8 text-center transition-all duration-1000 delay-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          <div
            className="military-font text-xl mb-1"
            style={{
              background: 'linear-gradient(90deg, #00f5ff, #ff00ff, #ffff00, #00ff88)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            TANK × 2026
          </div>
          <p className="mono-font text-military-500 text-xs">
            READY TO EXECUTE • ALL SYSTEMS GO
          </p>
        </div>
      </div>

      {/* Right side decoration */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
        <div className="w-px h-24 bg-gradient-to-b from-transparent via-cyan-500 to-transparent"/>
        <div className="mono-font text-cyan-400 text-xs tracking-widest rotate-90 origin-center">2026</div>
        <div className="w-px h-24 bg-gradient-to-b from-transparent via-purple-500 to-transparent"/>
      </div>
    </section>
  );
}
