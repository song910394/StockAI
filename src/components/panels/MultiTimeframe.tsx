import React from 'react';
import { MultiTimeframe as MultiTimeframeType } from '../../data/mockData';

interface Props {
  data: MultiTimeframeType[];
}

const MultiTimeframe: React.FC<Props> = ({ data }) => {
  return (
    <div className="panel" id="multi-timeframe-panel">
      <div className="panel-title">多週期分析</div>
      <div className="panel-body" style={{ padding: '4px 8px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-dim)' }}>
              <th style={{ textAlign: 'left', padding: '4px 6px', color: 'var(--text-label)', fontWeight: 500, fontSize: '10px' }}>週期</th>
              <th style={{ textAlign: 'center', padding: '4px 6px', color: 'var(--text-label)', fontWeight: 500, fontSize: '10px' }}>趨勢方向</th>
              <th style={{ textAlign: 'center', padding: '4px 6px', color: 'var(--text-label)', fontWeight: 500, fontSize: '10px' }}>多空強度</th>
              <th style={{ textAlign: 'center', padding: '4px 6px', color: 'var(--text-label)', fontWeight: 500, fontSize: '10px' }}>偏多</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(0,100,180,0.06)' }}>
                <td style={{ padding: '4px 6px', color: 'var(--text-primary)', fontWeight: 600 }}>{row.period}</td>
                <td style={{ padding: '4px 6px', textAlign: 'center' }}>
                  <span className="badge badge-up" style={{ fontSize: '9px' }}>{row.trendDirection}</span>
                </td>
                <td style={{ padding: '4px 6px', textAlign: 'center' }}>
                  <span style={{
                    color: row.strength === '強' ? 'var(--color-up)' :
                           row.strength === '中強' ? 'var(--color-orange)' :
                           'var(--color-yellow)',
                    fontWeight: 600,
                  }}>{row.strength}</span>
                </td>
                <td style={{ padding: '4px 6px', textAlign: 'center' }}>
                  <span className="badge badge-up" style={{ fontSize: '9px' }}>{row.bias}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', padding: '4px 0', marginTop: '4px' }}>
          均線多頭排列，短線仍在上升通道，日線級仍上升通道
        </div>
      </div>
    </div>
  );
};

export default MultiTimeframe;
