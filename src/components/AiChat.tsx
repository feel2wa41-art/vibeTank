import { useRef, useEffect } from 'react';
import { useChat, type Message } from 'ai/react';

interface AiChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AiChat({ isOpen, onClose }: AiChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-military-900 border border-military-600 rounded-2xl w-full max-w-lg h-[600px] max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-military-800 to-military-900 px-4 py-3 border-b border-military-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-green-500 flex items-center justify-center text-xl">
              🤖
            </div>
            <div>
              <h2 className="military-font text-lg text-military-300">TANK AI</h2>
              <p className="text-xs text-military-500 mono-font">Gemini 2.0 Flash</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-military-800 border border-military-600 text-military-400 hover:bg-red-900 hover:border-red-600 hover:text-red-400 transition flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🎖️</div>
              <h3 className="military-font text-xl text-military-400 mb-2">Welcome, Commander!</h3>
              <p className="text-military-500 text-sm mono-font">
                I'm TANK AI, your assistant.<br />
                Ask me anything about coding, projects, or just chat!
              </p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {['Tell me about this portfolio', 'Give me coding tips', 'Career advice'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      const event = { target: { value: suggestion } } as React.ChangeEvent<HTMLInputElement>;
                      handleInputChange(event);
                    }}
                    className="px-3 py-1 bg-military-800 border border-military-600 rounded-full text-xs text-military-400 hover:bg-military-700 hover:text-military-300 transition mono-font"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message: Message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-military-500 text-military-950 rounded-br-md'
                    : 'bg-military-800 border border-military-700 text-military-200 rounded-bl-md'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs">🤖</span>
                    <span className="text-xs text-cyan-400 mono-font">TANK AI</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-military-800 border border-military-700 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs">🤖</span>
                  <span className="text-xs text-cyan-400 mono-font">TANK AI</span>
                </div>
                <div className="flex gap-1 mt-2">
                  <div className="w-2 h-2 bg-military-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-military-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-military-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-center">
              <p className="text-red-400 text-sm mono-font">⚠️ Connection error. Please try again.</p>
              <p className="text-red-500 text-xs mt-1">Check if GOOGLE_GENERATIVE_AI_API_KEY is set</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-military-700 bg-military-900">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-military-800 border border-military-600 rounded-xl text-white placeholder-military-500 mono-font text-sm focus:outline-none focus:border-military-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-3 bg-gradient-to-r from-cyan-600 to-green-600 text-white rounded-xl font-bold hover:from-cyan-500 hover:to-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '...' : '➤'}
            </button>
          </div>
          <p className="text-center text-xs text-military-600 mt-2 mono-font">
            Powered by Google Gemini • Free Tier (1,000 req/day)
          </p>
        </form>
      </div>
    </div>
  );
}
