import React from 'react';
import { TradingScenario } from '../../data/mockData';
import './NextDayScenarios.css';

interface Props {
  scenarios: TradingScenario[];
}

const scenarioColors = [
  { bg: 'rgba(255,50,50,0.06)', border: 'rgba(255,50,50,0.3)', title: '#ff4444', icon: '📈' },
  { bg: 'rgba(255,220,0,0.06)', border: 'rgba(255,220,0,0.3)', title: '#ffdd00', icon: '📊' },
  { bg: 'rgba(0,200,255,0.06)', border: 'rgba(0,200,255,0.3)', title: '#00ccff', icon: '📉' },
];

const NextDayScenarios: React.FC<Props> = ({ scenarios }) => {
  return (
    <div className="panel" id="next-day-scenarios-panel">
      <div className="panel-title">隔日操作劇本（04/30）</div>
      <div className="panel-body scenarios-grid">
        {scenarios.map((s, i) => {
          const c = scenarioColors[i] || scenarioColors[0];
          return (
            <div
              key={i}
              className="scenario-card"
              style={{
                background: c.bg,
                borderColor: c.border,
              }}
            >
              <div className="scenario-header" style={{ color: c.title }}>
                <span>{c.icon}</span>
                <span>{s.title}</span>
              </div>
              <div className="scenario-detail">
                <div className="scenario-row">
                  <span className="scenario-label">進場價</span>
                  <span className="scenario-value font-mono">{s.entryPrice}</span>
                </div>
                <div className="scenario-row">
                  <span className="scenario-label">停損價</span>
                  <span className="scenario-value font-mono text-down">{s.stopLoss}</span>
                </div>
                <div className="scenario-row">
                  <span className="scenario-label">目標價</span>
                  <span className="scenario-value font-mono text-up">{s.targetPrice}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NextDayScenarios;
