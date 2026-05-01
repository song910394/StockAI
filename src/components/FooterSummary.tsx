import React from 'react';
import './FooterSummary.css';

interface Props {
  conclusion: string;
}

const FooterSummary: React.FC<Props> = ({ conclusion }) => {
  return (
    <div className="footer-summary panel" id="footer-summary">
      <div className="footer-label">整體結論</div>
      <div className="footer-text">
        <span className="footer-dot">💡</span>
        {conclusion}
      </div>
    </div>
  );
};

export default FooterSummary;
