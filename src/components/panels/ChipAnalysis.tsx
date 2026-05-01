import React from 'react';
import { ChipData } from '../../data/mockData';

interface Props {
  data: ChipData;
}

const ChipAnalysis: React.FC<Props> = ({ data }) => {
  const rows = [
    { label: '主力', ...data.mainForce },
    { label: '外資', ...data.foreign },
    { label: '投信', ...data.investment },
  ];

  return (
    <div className="panel" id="chip-analysis-panel">
      <div className="panel-title">籌碼分析（近5日）</div>
      <div className="panel-body">
        {rows.map((row, i) => (
          <div className="info-row" key={i}>
            <span className="info-label">{row.label}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className={
                row.badge === 'up' ? 'badge badge-up' :
                row.badge === 'down' ? 'badge badge-down' :
                'badge badge-neutral'
              }>{row.direction}</span>
              <span className="font-mono text-sm" style={{
                color: row.badge === 'up' ? 'var(--color-up)' :
                       row.badge === 'down' ? 'var(--color-down)' :
                       'var(--color-yellow)'
              }}>{row.detail}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChipAnalysis;
