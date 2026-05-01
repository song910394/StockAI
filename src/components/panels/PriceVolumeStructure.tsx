import React from 'react';

interface Props {
  data: {
    status: string;
    detail: string;
    maDetail: string;
    mainAction: string;
    operationNote: string;
  };
}

const PriceVolumeStructure: React.FC<Props> = ({ data }) => {
  return (
    <div className="panel" id="price-volume-panel">
      <div className="panel-title">量價結構分析</div>
      <div className="panel-body">
        <div className="info-row">
          <span className="info-label">量價背離</span>
          <span className="badge badge-neutral">{data.status}</span>
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', padding: '3px 0' }}>
          {data.detail}
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', padding: '3px 0' }}>
          {data.maDetail}
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', padding: '3px 0' }}>
          {data.mainAction}
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', padding: '3px 0' }}>
          {data.operationNote}
        </div>
      </div>
    </div>
  );
};

export default PriceVolumeStructure;
