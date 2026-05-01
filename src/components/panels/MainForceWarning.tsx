import React from 'react';
import './MainForceWarning.css';

interface Props {
  warning: {
    direction: string;
    badge: 'up' | 'down' | 'neutral';
    detail: string;
  };
  winRate: number;
  winRateLabel: string;
}

const MainForceWarning: React.FC<Props> = ({ warning, winRate, winRateLabel }) => {
  // SVG gauge chart for win rate
  const radius = 50;
  const circumference = Math.PI * radius; // half circle
  const strokeDashoffset = circumference - (winRate / 100) * circumference;

  const badgeClass = warning.badge === 'up' ? 'badge badge-up' :
                     warning.badge === 'down' ? 'badge badge-down' :
                     'badge badge-neutral';

  return (
    <div className="main-force-section" id="main-force-warning">
      {/* Main Force Warning */}
      <div className="panel mf-warning-panel">
        <div className="panel-title">主力出貨警示</div>
        <div className="panel-body" style={{ textAlign: 'center', padding: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="info-label">主力動向</span>
            <span className={badgeClass}>{warning.direction}</span>
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
            {warning.detail}
          </div>
        </div>
      </div>

      {/* Win Rate Gauge */}
      <div className="panel mf-winrate-panel">
        <div className="panel-title">短線勝率（近10日）</div>
        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px' }}>
          <div className="gauge-container">
            <svg viewBox="0 0 120 70" className="gauge-svg">
              {/* Background arc */}
              <path
                d="M 10 65 A 50 50 0 0 1 110 65"
                fill="none"
                stroke="#1a2a3a"
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Green portion (0-40%) */}
              <path
                d="M 10 65 A 50 50 0 0 1 110 65"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${circumference}`}
                strokeDashoffset={`${strokeDashoffset}`}
              />
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00cc00" />
                  <stop offset="50%" stopColor="#ffdd00" />
                  <stop offset="100%" stopColor="#ff3333" />
                </linearGradient>
              </defs>
              {/* Percentage labels */}
              <text x="10" y="68" fill="#556677" fontSize="8" textAnchor="middle">0%</text>
              <text x="110" y="68" fill="#556677" fontSize="8" textAnchor="middle">100%</text>
            </svg>
            <div className="gauge-value">
              <span className="gauge-number font-digital">{winRate}</span>
              <span className="gauge-percent">%</span>
            </div>
            <div className="gauge-label badge badge-neutral">{winRateLabel}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainForceWarning;
