/**
 * 技術指標計算工具
 * 從歷史K線資料計算 MA、KD、MACD 等指標
 */

import { HistoryDataPoint } from './stockApi';
import type { DashboardData, KLineDataPoint } from '../data/mockData';

// ============================================================
// 移動平均線 (MA)
// ============================================================
export function calcMA(data: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j];
      }
      result.push(Math.round((sum / period) * 100) / 100);
    }
  }
  return result;
}

// ============================================================
// KD 指標 (KDJ)
// ============================================================
export function calcKD(
  highs: number[],
  lows: number[],
  closes: number[],
  period: number = 9,
): { k: number[]; d: number[] } {
  const k: number[] = [];
  const d: number[] = [];
  let prevK = 50;
  let prevD = 50;

  for (let i = 0; i < closes.length; i++) {
    if (i < period - 1) {
      k.push(50);
      d.push(50);
      continue;
    }

    let highestHigh = -Infinity;
    let lowestLow = Infinity;
    for (let j = i - period + 1; j <= i; j++) {
      if (highs[j] > highestHigh) highestHigh = highs[j];
      if (lows[j] < lowestLow) lowestLow = lows[j];
    }

    const rsv = highestHigh === lowestLow
      ? 50
      : ((closes[i] - lowestLow) / (highestHigh - lowestLow)) * 100;

    const curK = (2 / 3) * prevK + (1 / 3) * rsv;
    const curD = (2 / 3) * prevD + (1 / 3) * curK;

    k.push(Math.round(curK * 100) / 100);
    d.push(Math.round(curD * 100) / 100);

    prevK = curK;
    prevD = curD;
  }

  return { k, d };
}

// ============================================================
// MACD 指標
// ============================================================
export function calcMACD(
  closes: number[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9,
): { dif: number[]; macd: number[]; osc: number[] } {
  const emaFast = calcEMA(closes, fastPeriod);
  const emaSlow = calcEMA(closes, slowPeriod);

  const dif: number[] = [];
  for (let i = 0; i < closes.length; i++) {
    dif.push(Math.round((emaFast[i] - emaSlow[i]) * 100) / 100);
  }

  const macd = calcEMA(dif, signalPeriod);
  const osc = dif.map((v, i) => Math.round((v - macd[i]) * 2 * 100) / 100);

  return { dif, macd, osc };
}

function calcEMA(data: number[], period: number): number[] {
  const result: number[] = [];
  const multiplier = 2 / (period + 1);

  result.push(data[0]);
  for (let i = 1; i < data.length; i++) {
    result.push((data[i] - result[i - 1]) * multiplier + result[i - 1]);
  }

  return result;
}

// ============================================================
// 從真實資料生成 DashboardData
// ============================================================
export function buildDashboardFromRealData(
  quote: {
    code: string;
    name: string;
    price: number;
    open: number;
    high: number;
    low: number;
    prevClose: number;
    change: number;
    changePercent: number;
    volume: number;
    date: string;
    time: string;
    innerBid: number;
    outerBid: number;
    innerBidPercent: number;
    outerBidPercent: number;
  },
  history: HistoryDataPoint[],
  institutional: {
    foreign: { net: number };
    investment: { net: number };
    dealer: { net: number };
  },
): DashboardData {
  const closes = history.map(d => d.close);
  const highs = history.map(d => d.high);
  const lows = history.map(d => d.low);
  const volumes = history.map(d => d.volume);

  // 計算技術指標
  const ma5 = calcMA(closes, 5);
  const ma20 = calcMA(closes, 20);
  const ma60 = calcMA(closes, 60);
  const kd = calcKD(highs, lows, closes);
  const macdData = calcMACD(closes);

  const lastIdx = closes.length - 1;
  const currentMA5 = ma5[lastIdx] || 0;
  const currentMA20 = ma20[lastIdx] || 0;
  const currentMA60 = ma60[lastIdx] || 0;
  const currentK = kd.k[lastIdx] || 50;
  const currentD = kd.d[lastIdx] || 50;
  const currentDIF = macdData.dif[lastIdx] || 0;
  const currentMACD = macdData.macd[lastIdx] || 0;
  const currentOSC = macdData.osc[lastIdx] || 0;

  const isUp = quote.change >= 0;

  // 趨勢判斷
  const trendDirection = currentMA5 > currentMA20 && currentMA20 > currentMA60 ? '多頭趨勢' :
    currentMA5 < currentMA20 && currentMA20 < currentMA60 ? '空頭趨勢' : '盤整格局';

  // MA 狀態
  const maStatus = currentMA5 > currentMA20 && currentMA20 > currentMA60
    ? `多頭排列 (5>20>60)`
    : currentMA5 < currentMA20 && currentMA20 < currentMA60
    ? `空頭排列 (5<20<60)`
    : '交叉糾結';

  // KD 判斷
  const kdStatus = currentK > 80 ? 'KD高檔鈍化' :
    currentK < 20 ? 'KD低檔鈍化' :
    currentK > currentD ? 'K上穿D，多方訊號' : 'K下穿D，空方訊號';

  // MACD 判斷
  const macdStatus = currentDIF > 0 && currentOSC > 0 ? '多頭擴張' :
    currentDIF > 0 && currentOSC < 0 ? '正值收斂' :
    currentDIF < 0 && currentOSC < 0 ? '空頭擴張' : '負值收斂';

  // 成交量判斷
  const avgVol5 = volumes.slice(-5).reduce((a, b) => a + b, 0) / 5;
  const avgVol20 = volumes.slice(-20).reduce((a, b) => a + b, 0) / Math.min(20, volumes.length);
  const volStatus = quote.volume > avgVol5 * 1.3 ? '量能放大' :
    quote.volume < avgVol5 * 0.7 ? '量能略縮' : '量能平穩';

  // 量價關係
  const pvRelation = isUp && quote.volume > avgVol5
    ? '價漲量增（健康）'
    : isUp && quote.volume < avgVol5
    ? '價漲量縮（短線整理）'
    : !isUp && quote.volume > avgVol5
    ? '價跌量增（賣壓沉重）'
    : '價跌量縮（惜售）';

  // 壓力/支撐
  const recentHighs = highs.slice(-20);
  const recentLows = lows.slice(-20);
  const resistance1 = Math.max(...recentHighs);
  const resistance2 = Math.max(...highs.slice(-60));
  const support1 = currentMA20;
  const support2 = currentMA60;

  // 外資/投信判斷
  const foreignNet = institutional.foreign.net;
  const investmentNet = institutional.investment.net;

  // 短線勝率 (近10日漲的天數比例)
  const last10Closes = closes.slice(-11);
  let upDays = 0;
  for (let i = 1; i < last10Closes.length; i++) {
    if (last10Closes[i] > last10Closes[i - 1]) upDays++;
  }
  const winRate = Math.round((upDays / 10) * 100);
  const winRateLabel = winRate >= 70 ? '強勢偏多' :
    winRate >= 50 ? '中等偏多' :
    winRate >= 30 ? '中等偏空' : '弱勢偏空';

  // 隔日操作劇本
  const currentPrice = quote.price;
  const scenarioUp = {
    title: '開高走高',
    entryPrice: `${Math.round(currentPrice * 1.005)} ~ ${Math.round(currentPrice * 1.015)}`,
    stopLoss: `${Math.round(currentPrice * 0.97)}`,
    targetPrice: `${Math.round(currentPrice * 1.03)} / ${Math.round(currentPrice * 1.05)}`,
  };
  const scenarioFlat = {
    title: '震盪整理',
    entryPrice: `${Math.round(currentPrice * 0.99)} ~ ${Math.round(currentPrice * 1.005)}`,
    stopLoss: `${Math.round(currentPrice * 0.965)}`,
    targetPrice: `${Math.round(currentPrice * 1.02)} / ${Math.round(currentPrice * 1.04)}`,
  };
  const scenarioDown = {
    title: '開低回測',
    entryPrice: `${Math.round(currentPrice * 0.97)} ~ ${Math.round(currentPrice * 0.985)}`,
    stopLoss: `${Math.round(currentPrice * 0.95)}`,
    targetPrice: `${Math.round(currentPrice * 1.01)} / ${Math.round(currentPrice * 1.03)}`,
  };

  // 整體結論
  const conclusion = trendDirection === '多頭趨勢'
    ? `股價處於多頭趨勢${volStatus === '量能略縮' ? '高檔整理' : ''}，${volStatus}，守穩支撐區仍有挑戰新高機會，短線操作宜靈活控管風險。`
    : trendDirection === '空頭趨勢'
    ? `股價處於空頭趨勢，量能${volStatus}，需關注支撐能否守穩，建議減碼或觀望為主。`
    : `股價處於盤整格局，方向尚未明確，等待突破或跌破關鍵位再行操作。`;

  return {
    stock: {
      code: quote.code,
      name: quote.name,
      industry: '', // 需另外查
      price: quote.price,
      change: quote.change,
      changePercent: quote.changePercent,
      open: quote.open,
      high: quote.high,
      low: quote.low,
      close: quote.price,
      volume: quote.volume,
      buyVolume: 0,
      sellVolume: 0,
      innerBid: quote.innerBid,
      outerBid: quote.outerBid,
      innerBidPercent: quote.innerBidPercent,
      outerBidPercent: quote.outerBidPercent,
      date: quote.date,
      time: quote.time,
      tradeAmount: 0,
      ma5: currentMA5,
      ma20: currentMA20,
      ma60: currentMA60,
    },
    techAnalysis: {
      trendDirection,
      trendBadge: trendDirection === '多頭趨勢' ? 'up' : trendDirection === '空頭趨勢' ? 'down' : 'neutral',
      maStatus,
      maBadge: maStatus.includes('多頭') ? 'up' : maStatus.includes('空頭') ? 'down' : 'neutral',
      kdIndicator: kdStatus,
      kdBadge: currentK > 50 ? 'up' : currentK < 50 ? 'down' : 'neutral',
      macd: macdStatus,
      macdBadge: currentDIF > 0 ? 'up' : 'down',
      volumeStatus: volStatus,
      volumeBadge: volStatus.includes('放大') ? 'up' : volStatus.includes('略縮') ? 'neutral' : 'neutral',
      priceVolumeRelation: pvRelation,
      priceVolumeBadge: pvRelation.includes('健康') ? 'up' : pvRelation.includes('賣壓') ? 'down' : 'neutral',
    },
    industryOverview: [
      `股票代碼: ${quote.code}`,
      `昨收: ${quote.prevClose}`,
      `成交量: ${quote.volume} 張`,
      `均量(5日): ${Math.round(avgVol5)} 張`,
    ],
    companyProfile: [
      `MA5: ${currentMA5}`,
      `MA20: ${currentMA20}`,
      `MA60: ${currentMA60}`,
      `K值: ${Math.round(currentK)}, D值: ${Math.round(currentD)}`,
    ],
    chipData: {
      mainForce: {
        direction: foreignNet + investmentNet > 0 ? '買超' : foreignNet + investmentNet < 0 ? '賣超' : '中性',
        badge: foreignNet + investmentNet > 0 ? 'up' : foreignNet + investmentNet < 0 ? 'down' : 'neutral',
        detail: `(${foreignNet + investmentNet} 張)`,
      },
      foreign: {
        direction: foreignNet > 0 ? '買超' : foreignNet < 0 ? '賣超' : '持平',
        badge: foreignNet > 0 ? 'up' : foreignNet < 0 ? 'down' : 'neutral',
        detail: `${Math.abs(foreignNet)} 張`,
      },
      investment: {
        direction: investmentNet > 0 ? '買超' : investmentNet < 0 ? '賣超' : '持平',
        badge: investmentNet > 0 ? 'up' : investmentNet < 0 ? 'down' : 'neutral',
        detail: `${Math.abs(investmentNet)} 張`,
      },
    },
    chipConcentration: '',
    chipStability: '',
    keyPriceLevel: {
      resistance: `${Math.round(resistance1)} / ${Math.round(resistance2)}`,
      support: `${Math.round(support1)} / ${Math.round(support2)}`,
    },
    priceVolumeStructure: {
      status: pvRelation.includes('健康') ? '量價配合' : '價量背離',
      detail: pvRelation,
      maDetail: `MA20乖離約${((quote.price - currentMA20) / currentMA20 * 100).toFixed(2)}%`,
      mainAction: `外資${foreignNet > 0 ? '買超' : '賣超'} ${Math.abs(foreignNet)} 張`,
      operationNote: `DIF: ${currentDIF.toFixed(2)}, OSC: ${currentOSC.toFixed(2)}`,
    },
    bidAskStructure: {
      innerCount: quote.innerBid,
      innerPercent: quote.innerBidPercent,
      outerCount: quote.outerBid,
      outerPercent: quote.outerBidPercent,
      summary: quote.outerBidPercent > 50 ? '外盤大於內盤，買盤較積極' : '內盤大於外盤，賣壓較重',
    },
    mainForceWarning: {
      direction: foreignNet > 100 ? '偏多' : foreignNet < -100 ? '偏空' : '中性偏多',
      badge: foreignNet > 100 ? 'up' : foreignNet < -100 ? 'down' : 'neutral',
      detail: `外資${foreignNet > 0 ? '買超' : '賣超'} ${Math.abs(foreignNet)} 張`,
    },
    shortTermWinRate: winRate,
    shortTermWinRateLabel: winRateLabel,
    klinePatterns: generateKLinePatterns(history),
    patternAnalysis: detectPatterns(history),
    multiTimeframe: [
      {
        period: '日K',
        trendDirection: trendDirection.includes('多頭') ? '多空' : '空多',
        strength: volStatus.includes('放大') ? '強' : '中',
        bias: trendDirection.includes('多頭') ? '偏多' : trendDirection.includes('空頭') ? '偏空' : '中性',
      },
      {
        period: '週K',
        trendDirection: currentMA20 > currentMA60 ? '多空' : '空多',
        strength: '中強',
        bias: currentMA20 > currentMA60 ? '偏多' : '偏空',
      },
      {
        period: '月K',
        trendDirection: quote.price > currentMA60 ? '多空' : '空多',
        strength: quote.price > currentMA60 ? '強' : '弱',
        bias: quote.price > currentMA60 ? '偏多' : '偏空',
      },
    ],
    tradingScenarios: [scenarioUp, scenarioFlat, scenarioDown],
    overallConclusion: conclusion,
  };
}

// ============================================================
// K線型態辨識
// ============================================================
function generateKLinePatterns(history: HistoryDataPoint[]) {
  if (history.length < 2) return [];

  const last = history[history.length - 1];
  const prev = history[history.length - 2];
  const patterns = [];

  const bodySize = Math.abs(last.close - last.open);
  const upperShadow = last.high - Math.max(last.close, last.open);
  const lowerShadow = Math.min(last.close, last.open) - last.low;
  const isRed = last.close > last.open;

  if (isRed && bodySize > (last.high - last.low) * 0.6) {
    patterns.push({ name: '長紅K', status: '成立', description: '今日長紅上漲' });
  }
  if (!isRed && bodySize > (last.high - last.low) * 0.6) {
    patterns.push({ name: '長黑K', status: '成立', description: '今日長黑下跌' });
  }
  if (upperShadow > bodySize * 1.5) {
    patterns.push({ name: '帶上影線', status: '成立', description: '上檔賣壓仍在' });
  }
  if (lowerShadow > bodySize * 1.5) {
    patterns.push({ name: '帶下影線', status: '成立', description: '下檔有承接' });
  }
  if (last.close > prev.close) {
    patterns.push({ name: '高檔回升', status: '成立', description: '收盤價高於前日' });
  }
  if (last.volume < prev.volume * 0.7) {
    patterns.push({ name: '量縮整理', status: '成立', description: '量能略縮，等待攻勢' });
  }

  return patterns.length > 0 ? patterns : [
    { name: '普通K線', status: '觀察', description: '無明顯型態' },
  ];
}

// ============================================================
// W底/M頭型態偵測
// ============================================================
function detectPatterns(history: HistoryDataPoint[]) {
  const closes = history.slice(-60).map(d => d.close);

  // 簡易 W/M 偵測
  let wStatus = '觀察中';
  let mStatus = '觀察中';

  if (closes.length >= 30) {
    const mid = Math.floor(closes.length / 2);
    const firstHalf = closes.slice(0, mid);
    const secondHalf = closes.slice(mid);

    const firstMin = Math.min(...firstHalf);
    const secondMin = Math.min(...secondHalf);
    const midMax = Math.max(...closes.slice(Math.floor(mid * 0.7), Math.floor(mid * 1.3)));

    // W 底：兩個低點 + 中間高點
    if (Math.abs(firstMin - secondMin) / firstMin < 0.05 && midMax > firstMin * 1.05) {
      wStatus = 'W底形成中';
    }

    const firstMax = Math.max(...firstHalf);
    const secondMax = Math.max(...secondHalf);
    const midMin = Math.min(...closes.slice(Math.floor(mid * 0.7), Math.floor(mid * 1.3)));

    // M 頭：兩個高點 + 中間低點
    if (Math.abs(firstMax - secondMax) / firstMax < 0.05 && midMin < firstMax * 0.95) {
      mStatus = 'M頭觀察中';
    }
  }

  return {
    wBottom: { status: 'W底型態', description: wStatus },
    mTop: { status: 'M頭型態', description: mStatus },
  };
}

/**
 * 將歷史資料轉為 KLineDataPoint 格式
 */
export function historyToKLineData(history: HistoryDataPoint[]): KLineDataPoint[] {
  return history.map(d => ({
    date: d.date,
    open: d.open,
    close: d.close,
    low: d.low,
    high: d.high,
    volume: d.volume,
  }));
}
