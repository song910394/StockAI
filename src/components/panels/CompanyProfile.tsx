import React from 'react';

interface Props {
  items: string[];
}

const CompanyProfile: React.FC<Props> = ({ items }) => {
  return (
    <div className="panel" id="company-profile-panel">
      <div className="panel-title">公司概況</div>
      <div className="panel-body">
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.map((item, i) => (
            <li key={i} style={{
              padding: '3px 0',
              fontSize: '11px',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '6px',
            }}>
              <span style={{ color: 'var(--color-cyan)', fontSize: '8px', marginTop: '3px' }}>●</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CompanyProfile;
