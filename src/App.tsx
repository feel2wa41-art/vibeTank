import { useState, lazy, Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProjectSection } from './components/ProjectSection';
import { TimelineSection } from './components/TimelineSection';
import { Goals2026Section } from './components/Goals2026Section';
import { MovingTank } from './components/Tank';
import { TrackLine } from './components/TrackLine';
// Lazy load heavy components
const IntroScreen = lazy(() => import('./components/IntroScreen'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const AiChat = lazy(() => import('./components/AiChat'));
import { DataProvider, useData } from './context/DataContext';
import { useHorizontalScroll } from './hooks/useHorizontalScroll';

// Admin password from environment variable (default: 'tank2025')
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'tank2025';

// Loading fallback component for Suspense
const LoadingFallback = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="fixed inset-0 z-50 bg-military-950 flex items-center justify-center">
    <div className="text-center">
      <div className="text-4xl mb-4 animate-pulse">⏳</div>
      <p className="mono-font text-military-500">{message}</p>
      <div className="w-64 h-2 bg-military-900 border border-military-700 mt-4 overflow-hidden">
        <div className="h-full bg-military-500 animate-pulse" style={{ width: '60%' }} />
      </div>
    </div>
  </div>
);

function Portfolio() {
  const [showIntro, setShowIntro] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const { projects } = useData();
  const { containerRef, progress, tankX, currentPage, scrollNext, scrollPrev } = useHorizontalScroll();
  const totalPages = projects.length + 3; // Hero + Projects + Timeline + Goals2026

  // Handle password submission
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setShowAdmin(true);
      setShowPasswordModal(false);
      setPassword('');
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPassword('');
    }
  };

  // Close password modal
  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPassword('');
    setPasswordError(false);
  };

  // Show admin page
  if (showAdmin) {
    return (
      <Suspense fallback={<LoadingFallback message="Loading Admin Panel..." />}>
        <AdminPage onBack={() => setShowAdmin(false)} />
      </Suspense>
    );
  }

  // Show intro screen first
  if (showIntro) {
    return (
      <Suspense fallback={<LoadingFallback message="Initializing Mission..." />}>
        <IntroScreen onEnter={() => setShowIntro(false)} />
      </Suspense>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-military-950">
      <Navbar progress={progress} onHomeClick={() => setShowIntro(true)} />
      <MovingTank x={tankX} />
      <TrackLine />

      {/* AI Chat Button */}
      <button
        onClick={() => setShowChat(true)}
        className="fixed bottom-4 right-16 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-600 to-green-600 border border-cyan-500/50 text-white hover:from-cyan-500 hover:to-green-500 transition-all duration-300 flex items-center justify-center backdrop-blur-sm text-xl shadow-lg hover:shadow-cyan-500/30 hover:scale-110"
        aria-label="AI Chat"
        title="Chat with TANK AI"
      >
        🤖
      </button>

      {/* Admin Button */}
      <button
        onClick={() => setShowPasswordModal(true)}
        className="fixed bottom-4 right-4 z-50 w-10 h-10 rounded-full bg-military-900/80 border border-military-700 text-military-500 hover:bg-military-500 hover:text-military-950 transition-all duration-300 flex items-center justify-center backdrop-blur-sm text-lg"
        aria-label="Admin Panel"
        title="Admin Panel"
      >
        ⚙️
      </button>

      {/* AI Chat Modal */}
      <Suspense fallback={null}>
        <AiChat isOpen={showChat} onClose={() => setShowChat(false)} />
      </Suspense>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-military-900 border border-military-600 rounded-xl p-6 w-80 shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-3xl mb-2">🔐</div>
              <h2 className="military-font text-xl text-military-500">ADMIN ACCESS</h2>
              <p className="mono-font text-xs text-military-400 mt-1">Enter password to continue</p>
            </div>

            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(false);
                }}
                placeholder="Password"
                autoFocus
                className={`w-full px-4 py-3 bg-military-800 border rounded-lg text-white text-center mono-font tracking-widest ${
                  passwordError ? 'border-red-500 shake' : 'border-military-600'
                }`}
              />

              {passwordError && (
                <p className="text-red-400 text-xs text-center mt-2 mono-font">
                  ❌ Incorrect password
                </p>
              )}

              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  className="flex-1 px-4 py-2 bg-military-800 border border-military-600 rounded-lg text-military-400 hover:bg-military-700 transition mono-font text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-military-500 text-military-950 rounded-lg font-bold hover:bg-military-400 transition"
                >
                  Enter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
