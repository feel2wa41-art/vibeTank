import { useRef } from 'react';
import type { Project } from '../data/projects';
import { RadarVisual } from './RadarVisual';

interface ProjectSectionProps {
  project: Project;
}

const OutputIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'admin':
      return (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      );
    case 'app':
      return (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/>
        </svg>
      );
    case 'landing':
      return (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
        </svg>
      );
    case 'ios':
      return (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      );
    case 'android':
      return (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
        </svg>
      );
    default:
      return (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      );
  }
};

export function ProjectSection({ project }: ProjectSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const scrollToDetails = () => {
    detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="flex-shrink-0 w-screen h-screen relative">
      {/* Vertical timeline connector */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-military-700/50"/>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-military-500 border-4 border-military-950 z-10"/>

      {/* Scrollable content container */}
      <div ref={scrollContainerRef} className="h-full overflow-y-auto overflow-x-hidden px-16 py-24 scrollbar-hide">
        {/* Mission number */}
        <div className="mono-font text-military-500 text-sm mb-8 pl-8">
          MISSION {String(project.id).padStart(2, '0')}
        </div>

        {/* Main content - First viewport */}
        <div className="min-h-[calc(100vh-200px)] flex items-center">
          <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto w-full">
            {/* Left: Visual */}
            <RadarVisual icon={project.icon} iconImage={project.iconImage} />

            {/* Right: Info */}
            <div className="flex flex-col justify-center">
              <div className="mono-font text-military-500 text-sm mb-2">{project.period}</div>
              <h3 className="military-font text-3xl md:text-4xl text-military-500 mb-2">
                {project.name}
              </h3>
              <div className="mono-font text-sm text-military-300/70 mb-6">{project.timeline}</div>

              {/* Description card */}
              <div className="card mb-6">
                <p className="text-military-200 leading-relaxed">{project.description}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>

              {/* Features or Stats */}
              {project.features ? (
                <div className="grid grid-cols-3 gap-2">
                  {project.features.map(f => (
                    <div key={f} className="p-2 bg-military-900/30 border border-military-700/50 rounded text-center">
                      <div className="text-xs text-military-300 mono-font">{f}</div>
                    </div>
                  ))}
                </div>
              ) : project.stats ? (
                <div className="flex gap-8">
                  {project.stats.map(stat => (
                    <div key={stat.label} className="text-center">
                      <div className="military-font text-2xl text-military-500">{stat.value}</div>
                      <div className="text-xs text-military-300 mono-font">{stat.label}</div>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* View Details Button */}
              {project.details && (
                <button
                  onClick={scrollToDetails}
                  className="mt-8 flex flex-col items-center text-military-500 hover:text-military-400 transition-colors cursor-pointer group"
                >
                  <span className="mono-font text-sm mb-2 group-hover:underline">VIEW DETAILS</span>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="animate-bounce">
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Detailed content - Second viewport (scroll to see) */}
        {project.details && (
          <div ref={detailsRef} className="py-16 max-w-5xl mx-auto">
            {/* Section divider */}
            <div className="flex items-center gap-4 mb-12">
              <div className="flex-1 h-px bg-military-700/50"/>
              <span className="military-font text-xl text-military-500">MISSION DETAILS</span>
              <div className="flex-1 h-px bg-military-700/50"/>
            </div>

            {/* Overview */}
            {project.details.overview && (
              <div className="card mb-8">
                <h4 className="military-font text-lg text-military-500 mb-4">📋 OVERVIEW</h4>
                <p className="text-military-200 leading-relaxed">{project.details.overview}</p>
              </div>
            )}

            {/* Outputs / Deliverables */}
            {project.outputs && Array.isArray(project.outputs) && project.outputs.length > 0 && (
              <div className="mb-8">
                <h4 className="military-font text-lg text-military-500 mb-6">🚀 DELIVERABLES</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {project.outputs.map((output, i) => (
                    <a
                      key={i}
                      href={output.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card group hover:border-military-500 hover:bg-military-900/50 transition-all duration-300 flex flex-col items-center text-center p-4"
                    >
                      <div className="text-military-500 group-hover:text-military-400 group-hover:scale-110 transition-all duration-300 mb-3">
                        <OutputIcon type={output.icon} />
                      </div>
                      <h5 className="font-bold text-military-300 text-sm mb-1 group-hover:text-military-200">
                        {output.name}
                      </h5>
                      <p className="text-xs text-military-500 leading-tight">
                        {output.description}
                      </p>
                      <div className="mt-3 flex items-center gap-1 text-xs text-military-600 group-hover:text-military-400">
                        <span>VISIT</span>
                        <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                        </svg>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
              {/* Responsibilities */}
              {project.details.responsibilities && (
                <div className="card">
                  <h4 className="military-font text-lg text-military-500 mb-4">🎯 RESPONSIBILITIES</h4>
                  <ul className="space-y-2">
                    {project.details.responsibilities.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-military-200">
                        <span className="text-military-500 mt-1">▸</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technologies */}
              {project.details.technologies && (
                <div className="card">
                  <h4 className="military-font text-lg text-military-500 mb-4">🔧 TECHNOLOGIES</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.details.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-military-500/20 border border-military-500/50 rounded-full text-sm text-military-300 mono-font"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements */}
              {project.details.achievements && (
                <div className="card">
                  <h4 className="military-font text-lg text-military-500 mb-4">🏆 ACHIEVEMENTS</h4>
                  <ul className="space-y-2">
                    {project.details.achievements.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-military-200">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Challenges */}
              {project.details.challenges && (
                <div className="card">
                  <h4 className="military-font text-lg text-military-500 mb-4">⚡ CHALLENGES</h4>
                  <ul className="space-y-2">
                    {project.details.challenges.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-military-200">
                        <span className="text-yellow-500 mt-1">!</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Back to top button */}
            <button
              onClick={scrollToTop}
              className="mt-16 flex flex-col items-center text-military-500 hover:text-military-400 transition-colors cursor-pointer group mx-auto"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="rotate-180 group-hover:-translate-y-1 transition-transform">
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
              </svg>
              <span className="mono-font text-sm mt-2 group-hover:underline">BACK TO TOP</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
