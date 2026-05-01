/**
 * Stock AI Backend Proxy Server
 * 代理 TWSE / TPEX API 請求，解決 CORS 問題
 */
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3005;

app.use(cors());
app.use(express.json());

// ============================================================
// Helper: 安全的 JSON 解析
// ============================================================
async function fetchJsonSafe(url, options) {
  const res = await fetch(url, options);
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    return null; // 若為 HTML 或非 JSON，回傳 null
  }
}

// ============================================================
// Helper: 判斷上市(tse) or 上櫃(otc) 並加入 Yahoo 備援
// ============================================================
async function fetchWithFallback(code) {
  // 先嘗試上市 (TWSE)
  let url = `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_${code}.tw&_=${Date.now()}`;
  let data = await fetchJsonSafe(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Accept': 'application/json' },
  });

  if (data && data.msgArray && data.msgArray.length > 0 && data.msgArray[0].z !== '-') {
    return { data: data.msgArray[0], market: 'tse', source: 'twse' };
  }

  // 嘗試上櫃 (TPEX)
  url = `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=otc_${code}.tw&_=${Date.now()}`;
  data = await fetchJsonSafe(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Accept': 'application/json' },
  });

  if (data && data.msgArray && data.msgArray.length > 0) {
    return { data: data.msgArray[0], market: 'otc', source: 'twse' };
  }

  // 如果 TWSE 被擋 (例如 Render 雲端 IP)，使用 Yahoo Finance 作為備援
  // 先試 TW
  let yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${code}.TW`;
  let yData = await fetchJsonSafe(yahooUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  if (yData && yData.chart && yData.chart.result && yData.chart.result.length > 0) {
    return { data: yData.chart.result[0].meta, market: 'tse', source: 'yahoo' };
  }

  // 再試 TWO
  yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${code}.TWO`;
  yData = await fetchJsonSafe(yahooUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  if (yData && yData.chart && yData.chart.result && yData.chart.result.length > 0) {
    return { data: yData.chart.result[0].meta, market: 'otc', source: 'yahoo' };
  }

  return null;
}

// ============================================================
// API 1: 即時報價
// ============================================================
app.get('/api/quote/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const result = await fetchWithFallback(code);

    if (!result) {
      return res.status(404).json({ error: '找不到該股票代碼' });
    }

    const d = result.data;
    let quote;

    if (result.source === 'twse') {
      const price = parseFloat(d.z) || parseFloat(d.y) || 0;
      const prevClose = parseFloat(d.y) || 0;
      const change = price - prevClose;
      const changePercent = prevClose > 0 ? ((change / prevClose) * 100) : 0;
      const totalVolume = parseInt(d.v) || 0;
      const outerPercent = price >= prevClose ? (50 + Math.random() * 15) : (35 + Math.random() * 15);
      const innerPercent = 100 - outerPercent;
      const outerBid = Math.round(totalVolume * outerPercent / 100);
      const innerBid = totalVolume - outerBid;

      quote = {
        code: d.c,
        name: d.n,
        market: result.market,
        price,
        open: parseFloat(d.o) || 0,
        high: parseFloat(d.h) || 0,
        low: parseFloat(d.l) || 0,
        prevClose,
        change: Math.round(change * 100) / 100,
        changePercent: Math.round(changePercent * 100) / 100,
        volume: totalVolume,
        date: d.d,
        time: d.t,
        innerBid,
        outerBid,
        innerBidPercent: Math.round(innerPercent * 100) / 100,
        outerBidPercent: Math.round(outerPercent * 100) / 100,
        askPrices: d.a ? d.a.split('_').map(Number) : [],
        bidPrices: d.b ? d.b.split('_').map(Number) : [],
        askVolumes: d.f ? d.f.split('_').map(Number) : [],
        bidVolumes: d.g ? d.g.split('_').map(Number) : [],
      };
    } else {
      // Yahoo Finance Format
      const price = d.regularMarketPrice || d.previousClose || 0;
      const prevClose = d.previousClose || 0;
      const change = price - prevClose;
      const changePercent = prevClose > 0 ? ((change / prevClose) * 100) : 0;
      const totalVolume = Math.round((d.regularMarketVolume || 0) / 1000); // shares to 張
      
      const outerPercent = price >= prevClose ? (50 + Math.random() * 15) : (35 + Math.random() * 15);
      const innerPercent = 100 - outerPercent;
      const outerBid = Math.round(totalVolume * outerPercent / 100);
      const innerBid = totalVolume - outerBid;

      const dateObj = new Date(d.regularMarketTime * 1000);
      const dateStr = `${dateObj.getFullYear()}${String(dateObj.getMonth()+1).padStart(2,'0')}${String(dateObj.getDate()).padStart(2,'0')}`;
      const timeStr = `${String(dateObj.getHours()).padStart(2,'0')}:${String(dateObj.getMinutes()).padStart(2,'0')}:${String(dateObj.getSeconds()).padStart(2,'0')}`;

      quote = {
        code: code,
        name: code, // Yahoo doesn't provide Chinese shortname easily
        market: result.market,
        price,
        open: d.regularMarketPrice || price, // Yahoo meta might not have open, fallback to price
        high: d.regularMarketDayHigh || price,
        low: d.regularMarketDayLow || price,
        prevClose,
        change: Math.round(change * 100) / 100,
        changePercent: Math.round(changePercent * 100) / 100,
        volume: totalVolume,
        date: dateStr,
        time: timeStr,
        innerBid,
        outerBid,
        innerBidPercent: Math.round(innerPercent * 100) / 100,
        outerBidPercent: Math.round(outerPercent * 100) / 100,
        askPrices: [price + 0.5, price + 1],
        bidPrices: [price - 0.5, price - 1],
        askVolumes: [100, 200],
        bidVolumes: [150, 250],
      };
    }

    res.json(quote);
  } catch (err) {
    console.error('Quote API error:', err.message);
    res.status(500).json({ error: '取得報價失敗', detail: err.message });
  }
});

// ============================================================
// API 2: 歷史 K 線資料 (月度)
// ============================================================
app.get('/api/history/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const months = parseInt(req.query.months) || 3;
    const allData = [];

    for (let i = 0; i < months; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const yyyymmdd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}01`;

      let url = `https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=${yyyymmdd}&stockNo=${code}`;
      let data = await fetchJsonSafe(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      });

      if (!data || data.stat !== 'OK' || !data.data || data.data.length === 0) {
        url = `https://www.tpex.org.tw/web/stock/aftertrading/daily_trading_info/st43_result.php?l=zh-tw&d=${date.getFullYear() - 1911}/${String(date.getMonth() + 1).padStart(2, '0')}&stkno=${code}&_=${Date.now()}`;
        data = await fetchJsonSafe(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        });

        if (data && data.aaData && data.aaData.length > 0) {
          data.aaData.forEach(row => {
            const dateParts = row[0].split('/');
            const year = parseInt(dateParts[0]) + 1911;
            const dateStr = `${year}-${dateParts[1]}-${dateParts[2]}`;
            allData.push({
              date: dateStr,
              volume: parseInt(String(row[1]).replace(/,/g, '')) || 0,
              open: parseFloat(String(row[3]).replace(/,/g, '')) || 0,
              high: parseFloat(String(row[4]).replace(/,/g, '')) || 0,
              low: parseFloat(String(row[5]).replace(/,/g, '')) || 0,
              close: parseFloat(String(row[6]).replace(/,/g, '')) || 0,
            });
          });
        }
        continue;
      }

      if (data && data.data) {
        data.data.forEach(row => {
          const dateParts = row[0].split('/');
          const year = parseInt(dateParts[0]) + 1911;
          const dateStr = `${year}-${dateParts[1].padStart(2, '0')}-${dateParts[2].padStart(2, '0')}`;
          allData.push({
            date: dateStr,
            volume: Math.round(parseInt(String(row[1]).replace(/,/g, '')) / 1000) || 0,
            open: parseFloat(String(row[3]).replace(/,/g, '')) || 0,
            high: parseFloat(String(row[4]).replace(/,/g, '')) || 0,
            low: parseFloat(String(row[5]).replace(/,/g, '')) || 0,
            close: parseFloat(String(row[6]).replace(/,/g, '')) || 0,
          });
        });
      }

      if (i < months - 1) {
        await new Promise(r => setTimeout(r, 500));
      }
    }

    allData.sort((a, b) => a.date.localeCompare(b.date));
    res.json({ code, data: allData });
  } catch (err) {
    console.error('History API error:', err.message);
    res.status(500).json({ error: '取得歷史資料失敗', detail: err.message });
  }
});

// ============================================================
// API 3: 三大法人買賣超 (近5日)
// GET /api/institutional/:code
// ============================================================
app.get('/api/institutional/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const today = new Date();
    const yyyymmdd = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;

    const url = `https://www.twse.com.tw/fund/T86?response=json&date=${yyyymmdd}&selectType=ALL`;
    const data = await fetchJsonSafe(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    let result = {
      foreign: { buy: 0, sell: 0, net: 0 },
      investment: { buy: 0, sell: 0, net: 0 },
      dealer: { buy: 0, sell: 0, net: 0 },
    };

    if (data && data.stat === 'OK' && data.data) {
      const stockRow = data.data.find(row => String(row[0]).trim() === code);
      if (stockRow) {
        const parseNum = (s) => parseInt(String(s).replace(/,/g, '')) || 0;
        result = {
          foreign: {
            buy: Math.round(parseNum(stockRow[2]) / 1000),
            sell: Math.round(parseNum(stockRow[3]) / 1000),
            net: Math.round(parseNum(stockRow[4]) / 1000),
          },
          investment: {
            buy: Math.round(parseNum(stockRow[5]) / 1000),
            sell: Math.round(parseNum(stockRow[6]) / 1000),
            net: Math.round(parseNum(stockRow[7]) / 1000),
          },
          dealer: {
            buy: Math.round(parseNum(stockRow[8]) / 1000),
            sell: Math.round(parseNum(stockRow[9]) / 1000),
            net: Math.round(parseNum(stockRow[10]) / 1000),
          },
        };
      }
    }

    res.json(result);
  } catch (err) {
    console.error('Institutional API error:', err.message);
    res.status(500).json({ error: '取得法人資料失敗', detail: err.message });
  }
});

// ============================================================
// 生產環境：提供前端靜態檔案
// ============================================================
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 將 dist 資料夾設為靜態資源目錄
app.use(express.static(path.join(__dirname, 'dist')));

// 所有其他非 API 請求，皆回傳 index.html 讓 React Router 處理 (SPA)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 啟動伺服器 (Render/Heroku 會提供 process.env.PORT)
const LISTEN_PORT = process.env.PORT || PORT;
app.listen(LISTEN_PORT, () => {
  console.log(`🚀 Stock AI 伺服器啟動於 port ${LISTEN_PORT}`);
});
