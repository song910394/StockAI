import React from 'react';
import { TechAnalysis as TechAnalysisType } from '../../data/mockData';

interface Props {
  data: TechAnalysisType;
}

const badgeClass = (badge: 'up' | 'down' | 'neutral') => {
  if (badge === 'up') return 'badge badge-up';
  if (badge === 'down') return 'badge badge-down';
  return 'badge badge-neutral';
};

const TechAnalysis: React.FC<Props> = ({ data }) => {
  const rows = [
    { label: '趨勢方向', value: data.trendDirection, badge: data.trendBadge },
    { label: 'MA狀態', value: data.maStatus, badge: data.maBadge },
    { label: 'KD指標', value: data.kdIndicator, badge: data.kdBadge },
    { label: 'MACD', value: data.macd, badge: data.macdBadge },
    { label: '成交量', value: data.volumeStatus, badge: data.volumeBadge },
    { label: '價量關係', value: data.priceVolumeRelation, badge: data.priceVolumeBadge },
  ];

  return (
    <div className="panel" id="tech-analysis-panel">
      <div className="panel-title">技術分析總覽</div>
      <div className="panel-body">
        {rows.map((row, i) => (
          <div className="info-row" key={i}>
            <span className="info-label">{row.label}</span>
            <span className={badgeClass(row.badge)}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechAnalysis;
