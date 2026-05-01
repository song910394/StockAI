import React from 'react';
import { StockData } from '../data/mockData';
import './Header.css';

interface HeaderProps {
  stock: StockData;
}

const Header: React.FC<HeaderProps> = ({ stock }) => {
  const isUp = stock.change >= 0;
  const changeSign = isUp ? '▲' : '▼';
  const changeClass = isUp ? 'text-up' : 'text-down';

  return (
    <header className="header" id="stock-header">
      {/* Left: Stock Info */}
      <div className="header-left">
        <div className="stock-code-name">
          <span className="stock-code font-digital">{stock.code}</span>
          <span className="stock-name">{stock.name}</span>
        </div>
        <div className="stock-price-section">
          <span className={`stock-price font-digital ${changeClass}`}>
            {stock.price.toFixed(2)}
          </span>
          <span className={`stock-change ${changeClass}`}>
            {changeSign} {Math.abs(stock.change).toFixed(2)} ({Math.abs(stock.changePercent).toFixed(2)}%)
          </span>
        </div>
      </div>

      {/* Center: Trade Info */}
      <div className="header-center">
        <div className="header-info-block">
          <div className="header-info-item">
            <span className="header-info-label">量</span>
            <span className="header-info-value">{stock.buyVolume}</span>
          </div>
          <div className="header-info-item">
            <span className="header-info-label">量</span>
            <span className="header-info-value">{stock.sellVolume}</span>
          </div>
        </div>
        <div className="header-info-block">
          <span className="header-info-label">成交量</span>
          <span className="header-info-value text-yellow font-mono">{stock.volume.toLocaleString()}</span>
        </div>
        <div className="header-info-block">
          <span className="header-info-label">時間</span>
          <span className="header-info-value font-mono">{stock.date} {stock.time}</span>
        </div>
      </div>

      {/* Right: Bid/Ask Structure */}
      <div className="header-right">
        <div className="bid-ask-summary">
          <div className="bid-info">
            <span className="bid-label">內盤</span>
            <span className="bid-value text-down font-mono">{stock.innerBid.toLocaleString()}</span>
            <span className="bid-percent text-down">({stock.innerBidPercent}%)</span>
          </div>
          <div className="bid-info">
            <span className="bid-label">外盤</span>
            <span className="bid-value text-up font-mono">{stock.outerBid.toLocaleString()}</span>
            <span className="bid-percent text-up">({stock.outerBidPercent}%)</span>
          </div>
        </div>
        <div className="bid-ask-ratio">
          <span className="ratio-label">內外盤比</span>
          <div className="ratio-bar-container">
            <div
              className="ratio-bar ratio-bar-inner"
              style={{ width: `${stock.innerBidPercent}%` }}
            />
            <div
              className="ratio-bar ratio-bar-outer"
              style={{ width: `${stock.outerBidPercent}%` }}
            />
          </div>
          <span className="ratio-value font-digital">
            <span className="text-down">{Math.round(stock.innerBidPercent)}</span>
            <span className="text-dim"> : </span>
            <span className="text-up">{Math.round(stock.outerBidPercent)}</span>
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
