import React from 'react';

interface Props {
  data: {
    innerCount: number;
    innerPercent: number;
    outerCount: number;
    outerPercent: number;
    summary: string;
  };
}

const BidAskStructure: React.FC<Props> = ({ data }) => {
  return (
    <div className="panel" id="bid-ask-panel">
      <div className="panel-title">內外盤結構</div>
      <div className="panel-body">
        <div className="info-row">
          <span className="info-label">內盤 (賣盤)</span>
          <span className="info-value">
            <span className="text-down font-mono">{data.innerCount.toLocaleString()}</span>
            <span className="text-dim" style={{ marginLeft: '6px', fontSize: '10px' }}>{data.innerPercent}%</span>
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">外盤 (買盤)</span>
          <span className="info-value">
            <span className="text-up font-mono">{data.outerCount.toLocaleString()}</span>
            <span className="text-dim" style={{ marginLeft: '6px', fontSize: '10px' }}>{data.outerPercent}%</span>
          </span>
        </div>
        {/* Bar visualization */}
        <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', margin: '6px 0', background: '#1a1a2e' }}>
          <div style={{ width: `${data.innerPercent}%`, background: 'linear-gradient(90deg, #006600, #00cc00)' }} />
          <div style={{ width: `${data.outerPercent}%`, background: 'linear-gradient(90deg, #cc0000, #ff3333)' }} />
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', padding: '2px 0' }}>
          {data.summary}
        </div>
      </div>
    </div>
  );
};

export default BidAskStructure;
