import React, { useState, useCallback } from 'react';
import './StockSearch.css';

interface StockSearchProps {
  currentCode: string;
  onSearch: (code: string) => void;
  loading: boolean;
}

const StockSearch: React.FC<StockSearchProps> = ({ currentCode, onSearch, loading }) => {
  const [inputValue, setInputValue] = useState(currentCode);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const code = inputValue.trim();
    if (code && code !== currentCode) {
      onSearch(code);
    }
  }, [inputValue, currentCode, onSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const code = inputValue.trim();
      if (code) {
        onSearch(code);
      }
    }
  }, [inputValue, onSearch]);

  return (
    <div className="stock-search" id="stock-search">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-group">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input font-mono"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="輸入股票代碼 (如 2330)"
            maxLength={6}
            disabled={loading}
          />
          <button
            type="submit"
            className="search-btn"
            disabled={loading || !inputValue.trim()}
          >
            {loading ? (
              <span className="loading-spinner" />
            ) : (
              '查詢'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StockSearch;
