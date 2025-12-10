export default function KidsTheme({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen kids-gradient-bg">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="kids-bubble" style={{ left: '5%', top: '12%', width: '140px', height: '140px', animationDelay: '0s' }} />
        <div className="kids-bubble" style={{ left: '78%', top: '20%', width: '110px', height: '110px', animationDelay: '0.8s' }} />
        <div className="kids-bubble" style={{ left: '18%', top: '70%', width: '160px', height: '160px', animationDelay: '1.4s' }} />
        <div className="kids-bubble" style={{ left: '60%', top: '75%', width: '120px', height: '120px', animationDelay: '2s' }} />
        <div className="kids-star" style={{ left: '12%', top: '40%', animationDelay: '0.6s' }} />
        <div className="kids-star" style={{ left: '88%', top: '48%', animationDelay: '1.2s' }} />
        <div className="kids-star" style={{ left: '35%', top: '18%', animationDelay: '1.8s' }} />
      </div>
      {children}
    </div>
  )
}
