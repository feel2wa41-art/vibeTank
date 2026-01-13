import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProjectSection } from './components/ProjectSection';
import { TimelineSection } from './components/TimelineSection';
import { Goals2026Section } from './components/Goals2026Section';
import { MovingTank } from './components/Tank';
import { TrackLine } from './components/TrackLine';
import { IntroScreen } from './components/IntroScreen';
import { AdminPage } from './pages/AdminPage';
import { DataProvider, useData } from './context/DataContext';
import { useHorizontalScroll } from './hooks/useHorizontalScroll';

function Portfolio() {
  const [showIntro, setShowIntro] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const { projects } = useData();
  const { containerRef, progress, tankX, currentPage, scrollNext, scrollPrev } = useHorizontalScroll();
  const totalPages = projects.length + 3; // Hero + Projects + Timeline + Goals2026

  // Show admin page
  if (showAdmin) {
    return <AdminPage onBack={() => setShowAdmin(false)} />;
  }

  // Show intro screen first
  if (showIntro) {
    return <IntroScreen onEnter={() => setShowIntro(false)} />;
  }

  return (
    <div className="h-screen overflow-hidden bg-military-950">
      <Navbar progress={progress} onHomeClick={() => setShowIntro(true)} />
      <MovingTank x={tankX} />
      <TrackLine />

      {/* Admin Button */}
      <button
        onClick={() => setShowAdmin(true)}
        className="fixed bottom-4 right-4 z-50 w-10 h-10 rounded-full bg-military-900/80 border border-military-700 text-military-500 hover:bg-military-500 hover:text-military-950 transition-all duration-300 flex items-center justify-center backdrop-blur-sm text-lg"
        aria-label="Admin Panel"
        title="Admin Panel"
      >
        ⚙️
      </button>

      {/* Navigation Buttons */}
      {currentPage > 0 && (
        <button
          onClick={scrollPrev}
          className="fixed left-6 top-1/2 -translate-y-1/2 z-50 w-14 h-14 rounded-full bg-military-900/80 border border-military-500/50 text-military-500 hover:bg-military-500 hover:text-military-950 transition-all duration-300 flex items-center justify-center backdrop-blur-sm group"
          aria-label="Previous page"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>
      )}

      {currentPage < totalPages - 1 && (
        <button
          onClick={scrollNext}
          className="fixed right-6 top-1/2 -translate-y-1/2 z-50 w-14 h-14 rounded-full bg-military-900/80 border border-military-500/50 text-military-500 hover:bg-military-500 hover:text-military-950 transition-all duration-300 flex items-center justify-center backdrop-blur-sm group"
          aria-label="Next page"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform">
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
          </svg>
        </button>
      )}

      {/* Horizontal Scroll Container */}
      <div
        ref={containerRef}
        className="flex h-screen overflow-x-auto overflow-y-hidden"
        style={{ scrollBehavior: 'smooth' }}
      >
        <HeroSection />

        {projects.map((project) => (
          <ProjectSection
            key={project.id}
            project={project}
          />
        ))}

        <TimelineSection />

        {/* 2026 Goals - Final Section */}
        <Goals2026Section />
      </div>
    </div>
  );
}

function App() {
  return (
    <DataProvider>
      <Portfolio />
    </DataProvider>
  );
}

export default App;
