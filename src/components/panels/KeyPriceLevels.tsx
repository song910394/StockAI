import React from 'react';
import { KeyPriceLevel as KeyPriceLevelType } from '../../data/mockData';

interface Props {
  data: KeyPriceLevelType;
}

const KeyPriceLevels: React.FC<Props> = ({ data }) => {
  return (
    <div className="panel" id="key-price-levels-panel">
      <div className="panel-title">關鍵價位</div>
      <div className="panel-body">
        <div className="info-row">
          <span className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              background: 'var(--color-up)',
              borderRadius: '2px',
            }} />
            壓力區
          </span>
          <span className="info-value text-up text-bold" style={{ fontSize: '14px' }}>{data.resistance}</span>
        </div>
        <div className="info-row">
          <span className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              background: 'var(--color-down)',
              borderRadius: '2px',
            }} />
            支撐區
          </span>
          <span className="info-value text-down text-bold" style={{ fontSize: '14px' }}>{data.support}</span>
        </div>
        <div style={{
          marginTop: '6px',
          padding: '4px 8px',
          background: 'rgba(0,100,180,0.08)',
          borderRadius: '3px',
          fontSize: '10px',
          color: 'var(--text-secondary)',
        }}>
          守住支撐 → 多方格局不變
        </div>
      </div>
    </div>
  );
};

export default KeyPriceLevels;
