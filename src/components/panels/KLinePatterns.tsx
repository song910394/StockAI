import React from 'react';
import { KLinePattern } from '../../data/mockData';

interface Props {
  patterns: KLinePattern[];
}

const KLinePatterns: React.FC<Props> = ({ patterns }) => {
  return (
    <div className="panel" id="kline-patterns-panel">
      <div className="panel-title">K線型態表</div>
      <div className="panel-body" style={{ padding: '4px 8px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-dim)' }}>
              <th style={{ textAlign: 'left', padding: '4px 6px', color: 'var(--text-label)', fontWeight: 500, fontSize: '10px' }}>型態</th>
              <th style={{ textAlign: 'center', padding: '4px 6px', color: 'var(--text-label)', fontWeight: 500, fontSize: '10px' }}>狀態</th>
              <th style={{ textAlign: 'left', padding: '4px 6px', color: 'var(--text-label)', fontWeight: 500, fontSize: '10px' }}>說明</th>
            </tr>
          </thead>
          <tbody>
            {patterns.map((p, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(0,100,180,0.06)' }}>
                <td style={{ padding: '3px 6px', color: 'var(--text-primary)', fontWeight: 600 }}>{p.name}</td>
                <td style={{ padding: '3px 6px', textAlign: 'center' }}>
                  <span className="badge badge-up" style={{ fontSize: '9px' }}>{p.status}</span>
                </td>
                <td style={{ padding: '3px 6px', color: 'var(--text-secondary)', fontSize: '10px' }}>{p.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KLinePatterns;
