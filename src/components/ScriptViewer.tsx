import { useState } from 'react';

interface ScriptViewerProps {
  script?: string;
  projectName: string;
  missionNumber: number;
}

export function ScriptViewer({ script, projectName, missionNumber }: ScriptViewerProps) {
  const [showModal, setShowModal] = useState(false);

  if (!script) return null;

  return (
    <>
      {/* Script Button - tiny & discrete */}
      <button
        onClick={() => setShowModal(true)}
        className="w-7 h-7 rounded-full bg-military-800/60 border border-military-600/50 hover:bg-amber-900/50 hover:border-amber-500/50 transition-all duration-300 flex items-center justify-center opacity-60 hover:opacity-100"
        title="View Script"
      >
        <span className="text-xs">📜</span>
      </button>

      {/* Script Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm animate-fadeIn p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative w-full max-w-2xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Container */}
            <div className="relative bg-gradient-to-br from-military-900 to-military-950 border-2 border-amber-500/50 rounded-2xl overflow-hidden shadow-2xl shadow-amber-500/10">

              {/* Header */}
              <div className="relative bg-gradient-to-r from-amber-900/50 to-orange-900/50 border-b border-amber-500/30 px-6 py-4">
                {/* Scan line effect */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_50%,rgba(251,191,36,0.2)_50%,transparent_100%)] bg-[length:100%_4px]" />
                </div>

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center">
                      <span className="text-xl">📜</span>
                    </div>
                    <div>
                      <div className="military-font text-amber-400 tracking-wider">
                        PRESENTATION SCRIPT
                      </div>
                      <div className="mono-font text-xs text-amber-500/70">
                        MISSION {String(missionNumber).padStart(2, '0')} // {projectName}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowModal(false)}
                    className="w-8 h-8 rounded-full bg-military-800 border border-military-600 flex items-center justify-center text-military-400 hover:text-white hover:border-amber-500 transition-all"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Script Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="relative">
                  {/* Left border accent */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 via-orange-500 to-amber-500/50 rounded-full" />

                  {/* Script text */}
                  <div className="pl-6 space-y-4">
                    {script.split('\n\n').map((paragraph, idx) => (
                      <div key={idx} className="relative">
                        {paragraph.startsWith('•') || paragraph.includes('\n•') ? (
                          // Bullet points
                          <div className="space-y-2">
                            {paragraph.split('\n').map((line, lineIdx) => (
                              <p
                                key={lineIdx}
                                className={`text-military-200 leading-relaxed ${
                                  line.startsWith('•') ? 'pl-4 text-amber-200/90' : ''
                                }`}
                              >
                                {line}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p className="text-military-200 leading-relaxed text-lg">
                            {paragraph}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="relative bg-gradient-to-r from-military-900 to-military-950 border-t border-amber-500/20 px-6 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="mono-font text-xs text-green-500">SCRIPT READY</span>
                  </div>
                  <span className="mono-font text-xs text-military-600">
                    ESC or CLICK OUTSIDE TO CLOSE
                  </span>
                </div>
              </div>

              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-amber-500/50" />
              <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-amber-500/50" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-amber-500/50" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-amber-500/50" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
