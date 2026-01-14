import { useState } from 'react';

interface AiTankButtonProps {
  aiImage?: string;
  projectName: string;
}

export function AiTankButton({ aiImage, projectName }: AiTankButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (!aiImage) return;

    setIsLoading(true);
    // 2초 로딩 후 팝업 표시
    setTimeout(() => {
      setIsLoading(false);
      setShowModal(true);
    }, 2000);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // AI 이미지가 없으면 버튼 표시 안함
  if (!aiImage) return null;

  return (
    <>
      {/* AI TANK 버튼 */}
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="group relative px-6 py-3 bg-gradient-to-r from-cyan-900/80 to-green-900/80 border-2 border-cyan-500/50 rounded-xl hover:border-cyan-400 hover:from-cyan-800/80 hover:to-green-800/80 transition-all duration-300 overflow-hidden disabled:cursor-wait"
      >
        {/* 배경 글로우 효과 */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* 스캔라인 효과 */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_50%,rgba(0,255,255,0.1)_50%,transparent_100%)] bg-[length:100%_4px] animate-pulse" />
        </div>

        <div className="relative flex items-center gap-3">
          {isLoading ? (
            <>
              {/* 로딩 스피너 */}
              <div className="w-6 h-6 relative">
                <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-full" />
                <div className="absolute inset-0 border-2 border-transparent border-t-cyan-400 rounded-full animate-spin" />
                <div className="absolute inset-1 border border-transparent border-t-green-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.5s' }} />
              </div>
              <span className="military-font text-cyan-400 tracking-wider animate-pulse">
                ANALYZING...
              </span>
            </>
          ) : (
            <>
              {/* 탱크 아이콘 */}
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                🤖
              </span>
              <div className="flex flex-col items-start">
                <span className="military-font text-cyan-400 text-sm tracking-widest group-hover:text-cyan-300">
                  AI TANK
                </span>
                <span className="mono-font text-[10px] text-green-500/70 group-hover:text-green-400">
                  CLICK TO GENERATE
                </span>
              </div>
            </>
          )}
        </div>

        {/* 코너 장식 */}
        <div className="absolute top-1 left-1 w-2 h-2 border-l border-t border-cyan-500/50" />
        <div className="absolute top-1 right-1 w-2 h-2 border-r border-t border-cyan-500/50" />
        <div className="absolute bottom-1 left-1 w-2 h-2 border-l border-b border-cyan-500/50" />
        <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-cyan-500/50" />
      </button>

      {/* 팝업 모달 */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={closeModal}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] mx-4 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="absolute -top-12 left-0 right-0 flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <span className="military-font text-cyan-400 tracking-wider">AI TANK OUTPUT</span>
                <span className="mono-font text-xs text-green-500">// {projectName}</span>
              </div>
              <button
                onClick={closeModal}
                className="text-military-500 hover:text-white transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>

            {/* 이미지 컨테이너 */}
            <div className="relative bg-military-900 border-2 border-cyan-500/50 rounded-xl overflow-hidden shadow-2xl shadow-cyan-500/20">
              {/* 스캔라인 오버레이 */}
              <div className="absolute inset-0 pointer-events-none z-10 opacity-10">
                <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_50%,rgba(0,255,255,0.3)_50%,transparent_100%)] bg-[length:100%_4px]" />
              </div>

              {/* 코너 브래킷 */}
              <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-cyan-500 z-20" />
              <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-cyan-500 z-20" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-cyan-500 z-20" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-cyan-500 z-20" />

              {/* 이미지 */}
              <img
                src={aiImage}
                alt={`AI Generated - ${projectName}`}
                className="w-full h-auto max-h-[80vh] object-contain"
              />

              {/* 하단 상태바 */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="mono-font text-xs text-green-500">GENERATION COMPLETE</span>
                  </div>
                  <span className="mono-font text-xs text-military-500">
                    POWERED BY AI TANK
                  </span>
                </div>
              </div>
            </div>

            {/* 닫기 안내 */}
            <div className="absolute -bottom-10 left-0 right-0 text-center">
              <span className="mono-font text-xs text-military-600">
                CLICK ANYWHERE TO CLOSE
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
