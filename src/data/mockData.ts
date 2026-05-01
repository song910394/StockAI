// Mock data based on the provided dashboard screenshots
// Stock: 3583 辛耘

export interface StockData {
  code: string;
  name: string;
  industry: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  buyVolume: number; // 量 (買)
  sellVolume: number; // 量 (賣)
  innerBid: number; // 內盤
  outerBid: number; // 外盤
  innerBidPercent: number;
  outerBidPercent: number;
  date: string;
  time: string;
  tradeAmount: number; // 成交金額
  ma5: number;
  ma20: number;
  ma60: number;
}

export interface TechAnalysis {
  trendDirection: string;
  trendBadge: 'up' | 'down' | 'neutral';
  maStatus: string;
  maBadge: 'up' | 'down' | 'neutral';
  kdIndicator: string;
  kdBadge: 'up' | 'down' | 'neutral';
  macd: string;
  macdBadge: 'up' | 'down' | 'neutral';
  volumeStatus: string;
  volumeBadge: 'up' | 'down' | 'neutral';
  priceVolumeRelation: string;
  priceVolumeBadge: 'up' | 'down' | 'neutral';
}

export interface ChipData {
  mainForce: { direction: string; badge: 'up' | 'down' | 'neutral'; detail: string };
  foreign: { direction: string; badge: 'up' | 'down' | 'neutral'; detail: string };
  investment: { direction: string; badge: 'up' | 'down' | 'neutral'; detail: string };
}

export interface KeyPriceLevel {
  resistance: string;
  support: string;
}

export interface KLinePattern {
  name: string;
  status: string;
  description: string;
}

export interface PatternAnalysis {
  wBottom: {
    status: string;
    description: string;
  };
  mTop: {
    status: string;
    description: string;
  };
}

export interface MultiTimeframe {
  period: string;
  trendDirection: string;
  strength: string;
  bias: string;
}

export interface TradingScenario {
  title: string;
  entryPrice: string;
  stopLoss: string;
  targetPrice: string;
}

export interface DashboardData {
  stock: StockData;
  techAnalysis: TechAnalysis;
  industryOverview: string[];
  companyProfile: string[];
  chipData: ChipData;
  chipConcentration: string;
  chipStability: string;
  keyPriceLevel: KeyPriceLevel;
  priceVolumeStructure: {
    status: string;
    detail: string;
    maDetail: string;
    mainAction: string;
    operationNote: string;
  };
  bidAskStructure: {
    innerCount: number;
    innerPercent: number;
    outerCount: number;
    outerPercent: number;
    summary: string;
  };
  mainForceWarning: {
    direction: string;
    badge: 'up' | 'down' | 'neutral';
    detail: string;
  };
  shortTermWinRate: number;
  shortTermWinRateLabel: string;
  klinePatterns: KLinePattern[];
  patternAnalysis: PatternAnalysis;
  multiTimeframe: MultiTimeframe[];
  tradingScenarios: TradingScenario[];
  overallConclusion: string;
}

// =====================================================
// K-Line Chart Data (OHLCV)
// =====================================================
export interface KLineDataPoint {
  date: string;
  open: number;
  close: number;
  low: number;
  high: number;
  volume: number;
}

function generateKLineData(): KLineDataPoint[] {
  const data: KLineDataPoint[] = [];
  const startDate = new Date('2025-02-10');
  let basePrice = 335;

  // Phase 1: 底部盤整 (Feb)
  for (let i = 0; i < 15; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    const change = (Math.random() - 0.45) * 15;
    const open = basePrice + (Math.random() - 0.5) * 8;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * 10;
    const low = Math.min(open, close) - Math.random() * 10;
    data.push({
      date: date.toISOString().split('T')[0],
      open: Math.round(open * 100) / 100,
      close: Math.round(close * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      volume: Math.round(1000 + Math.random() * 2000),
    });
    basePrice = close;
  }

  // Phase 2: 上升趨勢 (Mar)
  basePrice = 350;
  for (let i = 15; i < 35; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    const change = (Math.random() - 0.3) * 20;
    const open = basePrice + (Math.random() - 0.5) * 8;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * 12;
    const low = Math.min(open, close) - Math.random() * 8;
    data.push({
      date: date.toISOString().split('T')[0],
      open: Math.round(open * 100) / 100,
      close: Math.round(close * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      volume: Math.round(1500 + Math.random() * 3000),
    });
    basePrice = close > 0 ? close : basePrice;
  }

  // Phase 3: 強勢拉升 (Late Mar ~ Apr)
  basePrice = 500;
  for (let i = 35; i < 50; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    const change = (Math.random() - 0.25) * 35;
    const open = basePrice + (Math.random() - 0.5) * 12;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * 18;
    const low = Math.min(open, close) - Math.random() * 10;
    data.push({
      date: date.toISOString().split('T')[0],
      open: Math.round(open * 100) / 100,
      close: Math.round(close * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      volume: Math.round(2000 + Math.random() * 4000),
    });
    basePrice = close > 0 ? close : basePrice;
  }

  // Phase 4: 衝高至 931 後回落 (Apr mid)
  basePrice = 700;
  for (let i = 50; i < 58; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    const progress = (i - 50) / 8;
    const targetPrice = progress < 0.5 ? 700 + progress * 462 : 931 - (progress - 0.5) * 300;
    const open = targetPrice + (Math.random() - 0.5) * 20;
    const close = targetPrice + (Math.random() - 0.5) * 20;
    const high = Math.max(open, close) + Math.random() * 15;
    const low = Math.min(open, close) - Math.random() * 15;
    data.push({
      date: date.toISOString().split('T')[0],
      open: Math.round(Math.max(open, 650) * 100) / 100,
      close: Math.round(Math.max(close, 650) * 100) / 100,
      high: Math.round(Math.min(high, 935) * 100) / 100,
      low: Math.round(Math.max(low, 640) * 100) / 100,
      volume: Math.round(3000 + Math.random() * 5000),
    });
    basePrice = close;
  }

  // Phase 5: 回調到 720 附近然後反彈 (Late Apr)
  basePrice = 780;
  for (let i = 58; i < 68; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    const progress = (i - 58) / 10;
    const targetPrice = progress < 0.6 ? 780 - progress * 100 : 720 + (progress - 0.6) * 130;
    const open = targetPrice + (Math.random() - 0.5) * 15;
    const close = targetPrice + (Math.random() - 0.5) * 15;
    const high = Math.max(open, close) + Math.random() * 12;
    const low = Math.min(open, close) - Math.random() * 12;
    data.push({
      date: date.toISOString().split('T')[0],
      open: Math.round(Math.max(open, 700) * 100) / 100,
      close: Math.round(Math.max(close, 700) * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(Math.max(low, 690) * 100) / 100,
      volume: Math.round(2500 + Math.random() * 4000),
    });
  }

  // Last point: 4/29 收盤
  data.push({
    date: '2025-04-29',
    open: 729,
    close: 772,
    high: 791,
    low: 721,
    volume: 3949,
  });

  return data;
}

export const klineData = generateKLineData();

// =====================================================
// Dashboard Mock Data: 3583 辛耘
// =====================================================
export const mockData: DashboardData = {
  stock: {
    code: '3583',
    name: '辛耘',
    industry: '半導體設備業',
    price: 772.0,
    change: 34.0,
    changePercent: 4.61,
    open: 729.0,
    high: 791,
    low: 721,
    close: 772.0,
    volume: 3949,
    buyVolume: 7,
    sellVolume: 8,
    innerBid: 1720,
    outerBid: 2229,
    innerBidPercent: 43.53,
    outerBidPercent: 56.47,
    date: '04/29',
    time: '14:30',
    tradeAmount: 0,
    ma5: 768.29,
    ma20: 738.0,
    ma60: 665.0,
  },
  techAnalysis: {
    trendDirection: '多頭趨勢',
    trendBadge: 'up',
    maStatus: '多頭排列 (5>20>60)',
    maBadge: 'up',
    kdIndicator: 'KD高檔鈍化',
    kdBadge: 'neutral',
    macd: '正值收斂',
    macdBadge: 'up',
    volumeStatus: '量能略縮',
    volumeBadge: 'neutral',
    priceVolumeRelation: '價漲量縮 (短線整理)',
    priceVolumeBadge: 'neutral',
  },
  industryOverview: [
    '半導體設備業',
    '受惠先進製程擴產需求',
    '產業景氣維持高檔',
    '設備族群表現強勢',
  ],
  companyProfile: [
    '半導體濕製程設備領導',
    '技術領先，毛利率佳',
    '訂單能見度高',
    '營運成長趨勢明確',
  ],
  chipData: {
    mainForce: { direction: '進出互見', badge: 'neutral', detail: '(-52 張)' },
    foreign: { direction: '買超', badge: 'up', detail: '86 張' },
    investment: { direction: '買超', badge: 'up', detail: '' },
  },
  chipConcentration: '籌碼集中度',
  chipStability: '籌碼穩定度',
  keyPriceLevel: {
    resistance: '893 / 931',
    support: '720 / 665',
  },
  priceVolumeStructure: {
    status: '價量背離',
    detail: '價漲量縮，短線需留意',
    maDetail: '均MA20乖離約+4.61%，偏高',
    mainAction: '主力進出互見，籌碼整理中',
    operationNote: '操作聯想中',
  },
  bidAskStructure: {
    innerCount: 1720,
    innerPercent: 43.53,
    outerCount: 2229,
    outerPercent: 56.47,
    summary: '外盤大於內盤，買盤較積極',
  },
  mainForceWarning: {
    direction: '中性偏多',
    badge: 'neutral',
    detail: '主力推出互見，籌碼趨於穩定',
  },
  shortTermWinRate: 62,
  shortTermWinRateLabel: '中等偏多',
  klinePatterns: [
    { name: '長紅K', status: '成立', description: '今日長紅上漲' },
    { name: '高檔回落', status: '成立', description: '高點後回到開盤價附近' },
    { name: '多方排列', status: '成立', description: '均線多頭排列支撐' },
    { name: '帶上影線', status: '成立', description: '上檔賣壓仍在' },
    { name: '量縮整理', status: '成立', description: '量能略縮，等待攻勢' },
  ],
  patternAnalysis: {
    wBottom: {
      status: 'W底型態',
      description: '未形成標準W底',
    },
    mTop: {
      status: 'M頭型態',
      description: '未出現標準M頭，高點仍需要觀察',
    },
  },
  multiTimeframe: [
    { period: '日K', trendDirection: '多空', strength: '強', bias: '偏多' },
    { period: '週K', trendDirection: '多空', strength: '中強', bias: '偏多' },
    { period: '月K', trendDirection: '多空', strength: '強', bias: '偏多' },
  ],
  tradingScenarios: [
    {
      title: '開高走高',
      entryPrice: '775 ~ 780',
      stopLoss: '755',
      targetPrice: '820 / 860',
    },
    {
      title: '震盪整理',
      entryPrice: '750 ~ 770',
      stopLoss: '735',
      targetPrice: '800 / 830',
    },
    {
      title: '開低回測',
      entryPrice: '725 ~ 735',
      stopLoss: '710',
      targetPrice: '760 / 790',
    },
  ],
  overallConclusion:
    '股價處於多頭趨勢高檔整理，量縮等待方向，守穩支撐區仍有挑戰新高機會，短線操作宜靈活控管風險。',
};
