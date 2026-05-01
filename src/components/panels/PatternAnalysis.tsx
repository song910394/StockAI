import React from 'react';
import { PatternAnalysis as PatternAnalysisType } from '../../data/mockData';

interface Props {
  data: PatternAnalysisType;
}

const PatternAnalysis: React.FC<Props> = ({ data }) => {
  return (
    <div className="panel" id="pattern-analysis-panel">
      <div className="panel-title">型態分析（不套）</div>
      <div className="panel-body">
        {/* W Bottom */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontWeight: 700, color: 'var(--color-cyan)', fontSize: '12px' }}>W底型態</span>
            <span className="badge badge-neutral" style={{ fontSize: '9px' }}>{data.wBottom.status}</span>
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
            {data.wBottom.description}
          </div>
          {/* Mini W pattern visualization */}
          <svg viewBox="0 0 120 40" style={{ width: '100%', height: '36px', marginTop: '4px' }}>
            <line x1="0" y1="15" x2="120" y2="15" stroke="rgba(0,150,255,0.2)" strokeDasharray="3,3" />
            <text x="105" y="12" fill="#556677" fontSize="7">頸線壓力區</text>
            <polyline
              points="5,10 20,30 40,12 55,28 75,8 100,20 115,15"
              fill="none"
              stroke="var(--color-cyan)"
              strokeWidth="1.5"
            />
            <text x="20" y="38" fill="#556677" fontSize="7">左底</text>
            <text x="55" y="38" fill="#556677" fontSize="7">右底</text>
          </svg>
        </div>

        {/* M Top */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontWeight: 700, color: 'var(--color-magenta)', fontSize: '12px' }}>M頭型態</span>
            <span className="badge badge-neutral" style={{ fontSize: '9px' }}>{data.mTop.status}</span>
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
            {data.mTop.description}
          </div>
          {/* Mini M pattern visualization */}
          <svg viewBox="0 0 120 40" style={{ width: '100%', height: '36px', marginTop: '4px' }}>
            <line x1="0" y1="28" x2="120" y2="28" stroke="rgba(255,68,170,0.2)" strokeDasharray="3,3" />
            <text x="90" y="35" fill="#556677" fontSize="7">頸線支撐區</text>
            <polyline
              points="5,30 20,10 40,25 55,8 75,30 100,22 115,25"
              fill="none"
              stroke="var(--color-magenta)"
              strokeWidth="1.5"
            />
            <text x="20" y="7" fill="#556677" fontSize="7">頭部</text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default PatternAnalysis;
