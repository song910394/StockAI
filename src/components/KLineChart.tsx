import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { KLineDataPoint, StockData } from '../data/mockData';
import './KLineChart.css';

interface KLineChartProps {
  data: KLineDataPoint[];
  stock: StockData;
}

const KLineChart: React.FC<KLineChartProps> = ({ data, stock }) => {
  const option = useMemo(() => {
    const categoryData = data.map(d => d.date);
    const ohlcData = data.map(d => [d.open, d.close, d.low, d.high]);
    const volumeData = data.map(d => ({
      value: d.volume,
      itemStyle: {
        color: d.close >= d.open ? 'rgba(255,50,50,0.7)' : 'rgba(0,200,0,0.7)',
      },
    }));

    // Calculate MAs
    const calcMA = (period: number) => {
      const result: (number | null)[] = [];
      for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
          result.push(null);
        } else {
          let sum = 0;
          for (let j = 0; j < period; j++) {
            sum += data[i - j].close;
          }
          result.push(Math.round((sum / period) * 100) / 100);
        }
      }
      return result;
    };

    return {
      backgroundColor: 'transparent',
      animation: false,
      grid: [
        {
          left: 60,
          right: 14,
          top: 30,
          height: '55%',
        },
        {
          left: 60,
          right: 14,
          top: '75%',
          height: '18%',
        },
      ],
      xAxis: [
        {
          type: 'category',
          data: categoryData,
          boundaryGap: true,
          axisLine: { lineStyle: { color: '#1a3050' } },
          axisLabel: {
            color: '#667788',
            fontSize: 9,
            formatter: (value: string) => {
              const parts = value.split('-');
              return `${parts[1]}/${parts[2]}`;
            },
          },
          splitLine: { show: false },
          axisTick: { show: false },
        },
        {
          type: 'category',
          gridIndex: 1,
          data: categoryData,
          axisLine: { lineStyle: { color: '#1a3050' } },
          axisLabel: { show: false },
          splitLine: { show: false },
          axisTick: { show: false },
        },
      ],
      yAxis: [
        {
          type: 'value',
          scale: true,
          axisLine: { lineStyle: { color: '#1a3050' } },
          axisLabel: {
            color: '#667788',
            fontSize: 10,
            formatter: (v: number) => v.toFixed(0),
          },
          splitLine: {
            lineStyle: { color: 'rgba(0,100,180,0.08)', type: 'dashed' },
          },
        },
        {
          type: 'value',
          gridIndex: 1,
          scale: true,
          axisLine: { lineStyle: { color: '#1a3050' } },
          axisLabel: {
            color: '#556677',
            fontSize: 9,
          },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: 'K線',
          type: 'candlestick',
          data: ohlcData,
          itemStyle: {
            color: '#ff3333',
            color0: '#00cc00',
            borderColor: '#ff3333',
            borderColor0: '#00cc00',
          },
          markPoint: {
            symbol: 'rect',
            symbolSize: [1, 1],
            data: [
              {
                name: '近期高點',
                coord: [data.length - 8, 931],
                value: 931,
                itemStyle: { color: 'transparent' },
                label: {
                  show: true,
                  formatter: '近期高點\n931',
                  color: '#ffdd00',
                  fontSize: 10,
                  fontWeight: 'bold',
                  backgroundColor: 'rgba(255,220,0,0.1)',
                  borderColor: 'rgba(255,220,0,0.4)',
                  borderWidth: 1,
                  borderRadius: 3,
                  padding: [4, 8],
                  position: 'top',
                },
              },
            ],
          },
          markLine: {
            silent: true,
            symbol: 'none',
            lineStyle: { type: 'dashed', width: 1 },
            data: [
              {
                yAxis: 931,
                lineStyle: { color: 'rgba(255,100,0,0.4)' },
                label: {
                  formatter: '高檔回落區',
                  color: '#ff8800',
                  fontSize: 9,
                  position: 'insideEndTop',
                },
              },
              {
                yAxis: 720,
                lineStyle: { color: 'rgba(0,200,255,0.3)' },
                label: {
                  formatter: '短線支撐區 720附近',
                  color: '#00ccff',
                  fontSize: 9,
                  position: 'insideEndTop',
                },
              },
            ],
          },
        },
        {
          name: 'MA5',
          type: 'line',
          data: calcMA(5),
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 1.2, color: '#ffffff' },
        },
        {
          name: 'MA20',
          type: 'line',
          data: calcMA(20),
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 1.2, color: '#ffdd00' },
        },
        {
          name: 'MA60',
          type: 'line',
          data: calcMA(60),
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 1.2, color: '#ff44aa' },
        },
        {
          name: '成交量',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: volumeData,
          barWidth: '60%',
        },
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: { color: '#666' },
        },
        backgroundColor: 'rgba(10,20,40,0.95)',
        borderColor: 'rgba(0,150,255,0.4)',
        textStyle: { color: '#ddd', fontSize: 11 },
      },
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0, 1],
          start: 30,
          end: 100,
        },
      ],
    };
  }, [data]);

  return (
    <div className="kline-chart-container panel" id="kline-chart">
      <div className="kline-header">
        <span className="kline-title">日K線圖</span>
        <div className="ma-legend">
          <span className="ma-item">
            <span className="ma-dot" style={{ background: '#ffffff' }} />
            MA5 <span className="font-mono" style={{ color: '#ffffff' }}>{stock.ma5}</span>
          </span>
          <span className="ma-item">
            <span className="ma-dot" style={{ background: '#ffdd00' }} />
            MA20 <span className="font-mono" style={{ color: '#ffdd00' }}>{stock.ma20}</span>
          </span>
          <span className="ma-item">
            <span className="ma-dot" style={{ background: '#ff44aa' }} />
            MA60 <span className="font-mono" style={{ color: '#ff44aa' }}>{stock.ma60}</span>
          </span>
        </div>
      </div>
      <div className="kline-ohlc-info">
        <span>開 <span className="font-mono">{stock.open.toFixed(2)}</span></span>
        <span>高 <span className="font-mono text-up">{stock.high}</span></span>
        <span>低 <span className="font-mono text-down">{stock.low}</span></span>
        <span>收 <span className="font-mono text-up">{stock.close.toFixed(2)}</span></span>
        <span className="text-up">▲ {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)</span>
        <span>量 <span className="font-mono text-yellow">{stock.volume.toLocaleString()}</span></span>
      </div>
      <ReactECharts
        option={option}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};

export default KLineChart;
