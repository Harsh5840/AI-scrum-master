'use client'

export function SignalWave({ className = '' }: { className?: string }) {
  return (
    <div className={`signal-wave relative overflow-hidden ${className}`} aria-hidden>
      <svg viewBox="0 0 640 280" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="signalStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
            <stop offset="45%" stopColor="hsl(var(--primary))" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="signalFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.28" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[40, 80, 120, 160, 200, 240].map((y) => (
          <line key={y} x1="0" y1={y} x2="640" y2={y} className="signal-grid" />
        ))}
        {[80, 160, 240, 320, 400, 480, 560].map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2="280" className="signal-grid" />
        ))}
        <path
          className="signal-fill"
          d="M0 168 C 48 168 64 92 96 92 S 144 210 176 168 S 224 70 256 118 S 304 220 336 168 S 384 48 416 100 S 464 230 496 176 S 544 86 576 132 S 616 168 640 168 L 640 280 L 0 280 Z"
        />
        <path
          className="signal-line"
          d="M0 168 C 48 168 64 92 96 92 S 144 210 176 168 S 224 70 256 118 S 304 220 336 168 S 384 48 416 100 S 464 230 496 176 S 544 86 576 132 S 616 168 640 168"
        />
        <circle className="signal-pip" cx="336" cy="168" r="5" />
      </svg>
      <div className="signal-sweep" />
    </div>
  )
}
