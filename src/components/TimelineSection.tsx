import { months } from '../data/projects';
import { useData } from '../context/DataContext';

export function TimelineSection() {
  const { projects, profileInfo } = useData();
  return (
    <section className="flex-shrink-0 w-screen h-screen flex flex-col items-center justify-center relative px-8 bg-military-950">
      {/* Timeline connector */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-military-700/50"/>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-military-500 border-4 border-military-950"/>
      
      <h2 className="military-font text-4xl md:text-5xl text-military-500 mb-4 text-center">
        2025 FULL OPERATION
      </h2>
      <p className="mono-font text-military-300 mb-12 text-center">ANNUAL MISSION TIMELINE</p>
      
      {/* Year Timeline */}
      <div className="w-full max-w-5xl">
        {/* Month headers */}
        <div className="flex mb-4">
          {months.map((m, i) => (
            <div key={i} className="flex-1 text-center">
              <span className="mono-font text-xs text-military-500">{m}</span>
            </div>
          ))}
        </div>
        
        {/* Timeline container */}
        <div className="relative h-64 border border-military-700/30 rounded-xl bg-military-950/50 overflow-hidden">
          {/* Grid lines */}
          <div className="absolute inset-0 flex">
            {months.map((_, i) => (
              <div key={i} className="flex-1 border-r border-military-700/20"/>
            ))}
          </div>
          
          {/* Project bars */}
          <div className="absolute inset-0 p-4 flex flex-col justify-around">
            {projects.map((project) => {
              // Intermittent project - show scattered blocks with icon and name
              if (project.intermittentMonths) {
                return (
                  <div key={project.id} className="relative h-12 flex items-center">
                    {/* Intermittent blocks with icon and name */}
                    {project.intermittentMonths.map((month, idx) => {
                      const leftPercent = (month / 12) * 100;
                      const widthPercent = (2 / 12) * 100; // 2 months width for text
                      return (
                        <div
                          key={month}
                          className="absolute h-10 rounded-lg flex items-center px-2 border-2 transition-all hover:scale-105"
                          style={{
                            left: `${leftPercent}%`,
                            width: `${widthPercent - 0.5}%`,
                            borderColor: project.color,
                            background: `linear-gradient(90deg, ${project.color}40, ${project.color}10)`
                          }}
                        >
                          <span
                            className="text-xs font-bold whitespace-nowrap overflow-hidden"
                            style={{ color: project.color }}
                          >
                            {project.icon} {idx === 0 ? project.name : 'MTI'}
                          </span>
                        </div>
                      );
                    })}
                    {/* Dashed line connecting blocks */}
                    <div
                      className="absolute h-0.5 top-1/2 -translate-y-1/2 -z-10"
                      style={{
                        left: `${(project.intermittentMonths[0] / 12) * 100}%`,
                        width: `${((project.intermittentMonths[project.intermittentMonths.length - 1] - project.intermittentMonths[0] + 1) / 12) * 100}%`,
                        borderTop: `2px dashed ${project.color}40`
                      }}
                    />
                  </div>
                );
              }

              // Regular continuous project bar
              const startPercent = (project.startMonth / 12) * 100;
              const widthPercent = ((project.endMonth - project.startMonth + 1) / 12) * 100;

              return (
                <div key={project.id} className="relative h-12 flex items-center">
                  <div
                    className="absolute h-10 rounded-lg flex items-center px-3 border-2 transition-all hover:scale-105"
                    style={{
                      left: `${startPercent}%`,
                      width: `${widthPercent}%`,
                      borderColor: project.color,
                      background: `linear-gradient(90deg, ${project.color}40, ${project.color}10)`
                    }}
                  >
                    <span
                      className="text-sm font-bold whitespace-nowrap"
                      style={{ color: project.color }}
                    >
                      {project.icon} {project.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Stats Summary */}
        <div className="flex justify-center gap-12 mt-12">
          {[
            { value: projects.length.toString(), label: "MISSIONS" },
            { value: "12", label: "MONTHS" },
            { value: "100%", label: "DEPLOYED" },
            { value: "∞", label: "ONGOING" }
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="military-font text-4xl text-military-500">{stat.value}</div>
              <div className="mono-font text-sm text-military-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <div className="military-font text-2xl text-military-500 mb-2">⬢ TANK</div>
        <p className="mono-font text-xs text-military-700">{profileInfo.footer}</p>
      </div>

      {/* Next Section Indicator - 2026 Goals */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
        <div className="w-px h-24 bg-gradient-to-b from-transparent via-military-500 to-transparent"/>
        <div className="flex items-center gap-2 text-military-500/80 mono-font text-xs animate-pulse">
          <span
            className="rotate-90 origin-center whitespace-nowrap"
            style={{
              background: 'linear-gradient(90deg, #00f5ff, #ff00ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            2026 GOALS
          </span>
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-cyan-400 animate-bounce">
          <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
        </svg>
        <div className="w-px h-24 bg-gradient-to-b from-transparent via-purple-500 to-transparent"/>
      </div>
    </section>
  );
}
