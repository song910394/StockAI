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

const App: React.FC = () => {
  const [stockCode, setStockCode] = useState('2330');
  const [dashboardData, setDashboardData] = useState<DashboardData>(mockData);
  const [chartData, setChartData] = useState<KLineDataPoint[]>(mockKlineData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRealData, setIsRealData] = useState(false);

  // 載入真實資料
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

  // 初始載入
  useEffect(() => {
    loadStockData('2330');
  }, []);

  const handleSearch = useCallback((code: string) => {
    loadStockData(code);
  }, [loadStockData]);

  const d = dashboardData;

  return (
    <div className="dashboard" id="stock-dashboard">
      {/* === Row 1: Header with Search === */}
      <div className="db-header">
        <div className="db-header-inner">
          <StockSearch
            currentCode={stockCode}
            onSearch={handleSearch}
            loading={loading}
          />
          <Header stock={d.stock} />
        </div>
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
