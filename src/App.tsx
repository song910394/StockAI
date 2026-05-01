import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import StockSearch from './components/StockSearch';
import KLineChart from './components/KLineChart';
import TechAnalysis from './components/panels/TechAnalysis';
import IndustryOverview from './components/panels/IndustryOverview';
import CompanyProfile from './components/panels/CompanyProfile';
import ChipAnalysis from './components/panels/ChipAnalysis';
import KeyPriceLevels from './components/panels/KeyPriceLevels';
import PriceVolumeStructure from './components/panels/PriceVolumeStructure';
import BidAskStructure from './components/panels/BidAskStructure';
import MainForceWarning from './components/panels/MainForceWarning';
import KLinePatterns from './components/panels/KLinePatterns';
import PatternAnalysis from './components/panels/PatternAnalysis';
import MultiTimeframe from './components/panels/MultiTimeframe';
import NextDayScenarios from './components/panels/NextDayScenarios';
import FooterSummary from './components/FooterSummary';
import { fetchQuote, fetchHistory, fetchInstitutional } from './services/stockApi';
import { buildDashboardFromRealData, historyToKLineData } from './services/technicalAnalysis';
import { mockData, klineData as mockKlineData, DashboardData, KLineDataPoint } from './data/mockData';
import './App.css';

import FavoritesBar from './components/FavoritesBar';

const App: React.FC = () => {
  const [stockCode, setStockCode] = useState('2330');
  const [dashboardData, setDashboardData] = useState<DashboardData>(mockData);
  const [chartData, setChartData] = useState<KLineDataPoint[]>(mockKlineData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRealData, setIsRealData] = useState(false);

  // Raw data state for partial updates
  const [rawHistory, setRawHistory] = useState<any[]>([]);
  const [rawInst, setRawInst] = useState<any>(null);

  // Favorites state
  const [favorites, setFavorites] = useState<{ code: string, name: string }[]>(() => {
    try {
      const saved = localStorage.getItem('stockAI_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Auto-refresh state
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('stockAI_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback(() => {
    setFavorites(prev => {
      const isFav = prev.some(f => f.code === stockCode);
      if (isFav) {
        return prev.filter(f => f.code !== stockCode);
      } else {
        return [...prev, { code: stockCode, name: dashboardData.stock.name }];
      }
    });
  }, [stockCode, dashboardData.stock.name]);

  const removeFavorite = useCallback((codeToRemove: string) => {
    setFavorites(prev => prev.filter(f => f.code !== codeToRemove));
  }, []);

  // 載入真實資料 (完整載入)
  const loadStockData = useCallback(async (code: string) => {
    setLoading(true);
    setError(null);

    try {
      // 並行請求三個 API
      const [quote, history, institutional] = await Promise.all([
        fetchQuote(code),
        fetchHistory(code, 3),
        fetchInstitutional(code),
      ]);

      if (history.length === 0) {
        throw new Error('無歷史資料，請確認股票代碼是否正確');
      }

      setRawHistory(history);
      setRawInst(institutional);

      // 從真實資料建立 DashboardData
      const data = buildDashboardFromRealData(quote, history, institutional);
      const kData = historyToKLineData(history);

      setDashboardData(data);
      setChartData(kData);
      setStockCode(code);
      setIsRealData(true);
    } catch (err: any) {
      console.error('載入資料失敗:', err);
      setError(err.message || '載入資料失敗，請確認後端服務是否已啟動 (node server.js)');
    } finally {
      setLoading(false);
    }
  }, []);

  // 背景更新報價 (只抓 Quote)
  const refreshQuoteOnly = useCallback(async () => {
    if (!isRealData || rawHistory.length === 0) return;
    try {
      const quote = await fetchQuote(stockCode);
      const data = buildDashboardFromRealData(quote, rawHistory, rawInst);
      setDashboardData(data);
    } catch (err) {
      console.error('背景更新報價失敗:', err);
    }
  }, [stockCode, isRealData, rawHistory, rawInst]);

  // Auto-refresh interval
  useEffect(() => {
    let intervalId: number;
    if (autoRefresh) {
      intervalId = window.setInterval(refreshQuoteOnly, 10000); // 10秒輪詢
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefresh, refreshQuoteOnly]);

  // 初始載入
  useEffect(() => {
    loadStockData('2330');
  }, []);

  const handleSearch = useCallback((code: string) => {
    loadStockData(code);
  }, [loadStockData]);

  const d = dashboardData;
  const isCurrentFavorite = favorites.some(f => f.code === stockCode);

  return (
    <div className="dashboard" id="stock-dashboard">
      {/* === Row 1: Header with Search === */}
      <div className="db-header">
        <div className="db-header-inner">
          <StockSearch
            currentCode={stockCode}
            onSearch={handleSearch}
            loading={loading}
            isFavorite={isCurrentFavorite}
            onToggleFavorite={toggleFavorite}
            autoRefresh={autoRefresh}
            onToggleAutoRefresh={() => setAutoRefresh(!autoRefresh)}
          />
          <Header stock={d.stock} />
        </div>
        <FavoritesBar 
          favorites={favorites} 
          currentCode={stockCode} 
          onSelect={handleSearch} 
          onRemove={removeFavorite} 
        />
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner-lg" />
            <div className="loading-text">載入 {stockCode} 資料中...</div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button className="error-close" onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* Data source indicator */}
      {!isRealData && !loading && (
        <div className="data-source-banner">
          📋 目前顯示 Mock 資料。請啟動後端服務 (node server.js) 以串接正式資料。
        </div>
      )}

      {/* === Row 2: Main Content === */}
      <div className="db-main">
        <div className="db-left-col">
          <div className="db-chart-wrap">
            <KLineChart data={chartData} stock={d.stock} />
          </div>
          <div className="db-mf-row">
            <MainForceWarning
              warning={d.mainForceWarning}
              winRate={d.shortTermWinRate}
              winRateLabel={d.shortTermWinRateLabel}
            />
          </div>
        </div>

        <div className="db-right-col">
          <div className="db-row-a">
            <div className="db-tech-wrap">
              <TechAnalysis data={d.techAnalysis} />
            </div>
            <div className="db-industry-company">
              <IndustryOverview items={d.industryOverview} />
              <CompanyProfile items={d.companyProfile} />
            </div>
          </div>

          <div className="db-row-b">
            <ChipAnalysis data={d.chipData} />
            <KeyPriceLevels data={d.keyPriceLevel} />
            <PriceVolumeStructure data={d.priceVolumeStructure} />
            <BidAskStructure data={d.bidAskStructure} />
          </div>
        </div>
      </div>

      {/* === Row 3: Bottom Panels === */}
      <div className="db-bottom">
        <KLinePatterns patterns={d.klinePatterns} />
        <PatternAnalysis data={d.patternAnalysis} />
        <MultiTimeframe data={d.multiTimeframe} />
        <NextDayScenarios scenarios={d.tradingScenarios} />
      </div>

      {/* === Row 4: Footer === */}
      <div className="db-footer">
        <FooterSummary conclusion={d.overallConclusion} />
      </div>
    </div>
  );
};

export default App;
