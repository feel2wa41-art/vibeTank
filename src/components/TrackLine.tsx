export function TrackLine() {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-military-950 to-transparent z-40 pointer-events-none">
      <div className="absolute bottom-6 left-0 right-0 h-2 bg-military-900">
        <div className="absolute inset-0 flex">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="flex-1 border-r border-military-950"/>
          ))}
        </div>
      </div>
    </div>
  );
}
