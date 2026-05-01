import React from 'react';
import './FavoritesBar.css';

interface FavoritesBarProps {
  favorites: { code: string, name: string }[];
  currentCode: string;
  onSelect: (code: string) => void;
  onRemove: (code: string) => void;
}

const FavoritesBar: React.FC<FavoritesBarProps> = ({ favorites, currentCode, onSelect, onRemove }) => {
  if (favorites.length === 0) return null;

  return (
    <div className="favorites-bar">
      <div className="favorites-label">⭐ 我的最愛：</div>
      <div className="favorites-list">
        {favorites.map(fav => (
          <div 
            key={fav.code} 
            className={`favorite-item ${currentCode === fav.code ? 'active' : ''}`}
            onClick={() => onSelect(fav.code)}
          >
            <span className="fav-code">{fav.code}</span>
            <span className="fav-name">{fav.name}</span>
            <button 
              className="fav-remove" 
              onClick={(e) => {
                e.stopPropagation();
                onRemove(fav.code);
              }}
              title="移除最愛"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesBar;
