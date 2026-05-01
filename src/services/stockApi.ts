/**
 * 前端 API Service
 * 與後端 proxy server 通訊，取得股票即時報價與歷史資料
 */

const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3005/api';

export interface QuoteResponse {
  code: string;
  name: string;
  market: string;
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
}

export interface HistoryDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface InstitutionalData {
  foreign: { buy: number; sell: number; net: number };
  investment: { buy: number; sell: number; net: number };
  dealer: { buy: number; sell: number; net: number };
}

/**
 * 取得即時報價
 */
export async function fetchQuote(code: string): Promise<QuoteResponse> {
  const res = await fetch(`${API_BASE}/quote/${code}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || '取得報價失敗');
  }
  return res.json();
}

/**
 * 取得歷史K線資料
 */
export async function fetchHistory(code: string, months: number = 3): Promise<HistoryDataPoint[]> {
  const res = await fetch(`${API_BASE}/history/${code}?months=${months}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || '取得歷史資料失敗');
  }
  const data = await res.json();
  return data.data || [];
}

/**
 * 取得三大法人買賣超
 */
export async function fetchInstitutional(code: string): Promise<InstitutionalData> {
  const res = await fetch(`${API_BASE}/institutional/${code}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || '取得法人資料失敗');
  }
  return res.json();
}
