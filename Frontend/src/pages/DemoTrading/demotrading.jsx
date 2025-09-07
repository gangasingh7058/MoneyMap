import { useEffect, useState, useRef } from "react";
import axios from "axios";

function QuoteViewer() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [virtualBalance, setVirtualBalance] = useState(12450.78);
  const [balanceChange, setBalanceChange] = useState({ amount: 245.12, percentage: 2.01 });
  const [portfolio, setPortfolio] = useState([
    {
      id: 1,
      name: 'DummyCoin A',
      symbol: 'DUCA',
      amount: 2500,
      currentValue: 3250,
      change: 150,
      changePercent: 4.8,
      icon: '₿'
    },
    {
      id: 2,
      name: 'DummyCoin B',
      symbol: 'DUCB',
      amount: 2500,
      currentValue: 3250,
      change: 150,
      changePercent: 4.8,
      icon: '₿'
    }
  ]);

  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = 'http://localhost:8000';

  const [selectedCoin, setSelectedCoin] = useState(null);
  const [chartTimeframe, setChartTimeframe] = useState('1D');
  const [tradingStats, setTradingStats] = useState({
    totalTrades: 0,
    winRate: 0,
    totalProfit: 0,
    bestTrade: 0,
    worstTrade: 0
  });
  const [orderAmount, setOrderAmount] = useState('');
  const [orderPrice, setOrderPrice] = useState('');
  const chartContainerRef = useRef(null);

  // Fetch market data from backend
  const fetchMarketData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/demo-trading/market-data`);
      
      if (response.data.success) {
        setMarketData(response.data.data);
        if (!selectedCoin && response.data.data.length > 0) {
          setSelectedCoin(response.data.data[0]);
        }
      } else {
        setError('Failed to fetch market data');
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch portfolio data
  const fetchPortfolioData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/demo-trading/portfolio`);
      
      if (response.data.success) {
        setPortfolio(response.data.portfolio);
      }
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    }
  };

  // Fetch trading statistics
  const fetchTradingStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/demo-trading/trading-stats`);
      
      if (response.data.success) {
        setTradingStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching trading stats:', error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchMarketData();
    fetchPortfolioData();
    fetchTradingStats();
    
    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchMarketData();
      fetchPortfolioData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Update selected coin when market data changes
  useEffect(() => {
    if (marketData.length > 0 && !selectedCoin) {
      setSelectedCoin(marketData[0]);
    }
  }, [marketData, selectedCoin]);

  // Update order price when selected coin changes
  useEffect(() => {
    if (selectedCoin) {
      setOrderPrice(selectedCoin.price?.toFixed(2) || '0.00');
    }
  }, [selectedCoin]);

  // Calculate total when amount or price changes
  const calculateTotal = () => {
    const amount = parseFloat(orderAmount) || 0;
    const price = parseFloat(orderPrice) || 0;
    return (amount * price).toFixed(2);
  };

  const handleBuySell = (coinId, action) => {
    const coin = marketData.find(c => c.id === coinId);
    if (!coin) return;

    const amount = 100; // Fixed amount for demo
    const cost = amount * coin.price;

    if (action === 'buy') {
      if (virtualBalance >= cost) {
        setVirtualBalance(prev => prev - cost);
        // Add to portfolio or update existing
        setPortfolio(prev => {
          const existing = prev.find(p => p.name === coin.name);
          if (existing) {
            return prev.map(p => 
              p.name === coin.name 
                ? { ...p, amount: p.amount + amount, currentValue: p.currentValue + cost }
                : p
            );
          } else {
            return [...prev, {
              id: Date.now(),
              name: coin.name,
              symbol: coin.symbol,
              amount: amount,
              currentValue: cost,
              change: 0,
              changePercent: 0,
              icon: coin.icon
            }];
          }
        });
      }
    } else if (action === 'sell') {
      const portfolioItem = portfolio.find(p => p.name === coin.name);
      if (portfolioItem && portfolioItem.amount >= amount) {
        setVirtualBalance(prev => prev + cost);
        setPortfolio(prev => 
          prev.map(p => 
            p.name === coin.name 
              ? { ...p, amount: p.amount - amount, currentValue: p.currentValue - cost }
              : p
          ).filter(p => p.amount > 0)
        );
      }
    }
  };

  // TradingChart Component
  const TradingChart = ({ coin, timeframe }) => {
    const generateChartData = () => {
      const data = [];
      const basePrice = coin.price;
      const points = 50;
      
      for (let i = 0; i < points; i++) {
        const variation = (Math.random() - 0.5) * 0.1;
        const price = basePrice + (basePrice * variation);
        data.push({
          x: i * 6, // 6px spacing
          y: 80 + (variation * 40) // Center around y=80
        });
      }
      return data;
    };

    const chartData = generateChartData();
    const pathData = chartData.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');

    return (
      <div className="trading-chart">
        <svg viewBox="0 0 300 160" className="price-chart">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={coin.color} stopOpacity="0.3"/>
              <stop offset="100%" stopColor={coin.color} stopOpacity="0"/>
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[20, 40, 60, 80, 100, 120, 140].map(y => (
            <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="#f3f4f6" strokeWidth="1" />
          ))}
          {[0, 60, 120, 180, 240, 300].map(x => (
            <line key={x} x1={x} y1="0" x2={x} y2="160" stroke="#f3f4f6" strokeWidth="1" />
          ))}
          
          {/* Price area */}
          <path
            d={`${pathData} L ${chartData[chartData.length - 1].x} 160 L 0 160 Z`}
            fill="url(#chartGradient)"
          />
          
          {/* Price line */}
          <path
            d={pathData}
            fill="none"
            stroke={coin.color}
            strokeWidth="2"
          />
          
          {/* Data points */}
          {chartData.filter((_, i) => i % 5 === 0).map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="3"
              fill={coin.color}
              className="chart-point"
            />
          ))}
        </svg>
        
        <div className="chart-controls">
          <div className="volume-bars">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className="volume-bar"
                style={{
                  height: `${Math.random() * 40 + 10}px`,
                  backgroundColor: Math.random() > 0.5 ? '#22c55e' : '#ef4444'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const tabs = ['Dashboard'];

  return (
    <div className="crypto-sim">
      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="logo">
            <div className="logo-icon">🍃</div>
            <span className="logo-text">CRYPTO <span className="sim">SIM</span></span>
          </div>
          <div className="balance-card">
            <div className="balance-label">Virtual Balance</div>
            <div className="balance-amount">{virtualBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</div>
            {/* <div className="balance-change positive">
              +{balanceChange.amount} ({balanceChange.percentage}%)
            </div> */}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="nav-tabs">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`nav-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="main-content">
          <div className="left-section">
            {error && <div className="error-message">{error}</div>}
            
            {loading ? (
              <div className="loading-message">Loading market data...</div>
            ) : (
              <>
                {/* Trading Chart Section */}
                <div className="section chart-section">
                  <div className="chart-header">
                    <div className="coin-selector">
                      {marketData.map(coin => (
                        <button
                          key={coin.id}
                          className={`coin-tab ${selectedCoin?.id === coin.id ? 'active' : ''}`}
                          onClick={() => setSelectedCoin(coin)}
                        >
                          <span className="coin-icon-small" style={{ backgroundColor: coin.color }}>
                            {coin.icon}
                          </span>
                          {coin.name}
                        </button>
                      ))}
                    </div>
                <div className="timeframe-selector">
                  {['1H', '4H', '1D', '1W', '1M'].map(tf => (
                    <button
                      key={tf}
                      className={`timeframe-btn ${chartTimeframe === tf ? 'active' : ''}`}
                      onClick={() => setChartTimeframe(tf)}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
              
              {selectedCoin && (
                <div className="price-info">
                  <div className="current-price">
                    <span className="price-value">${selectedCoin.price?.toFixed(2) || '0.00'}</span>
                    <span className={`price-change ${selectedCoin.changePercent > 0 ? 'positive' : 'negative'}`}>
                      {selectedCoin.changePercent > 0 ? '+' : ''}{selectedCoin.changePercent?.toFixed(2) || '0.00'}% (${selectedCoin.change24h?.toFixed(2) || '0.00'})
                    </span>
                  </div>
                  <div className="price-stats">
                    <div className="stat">
                      <span className="stat-label">24h High</span>
                      <span className="stat-value">${selectedCoin.high24h?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">24h Low</span>
                      <span className="stat-value">${selectedCoin.low24h?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Volume</span>
                      <span className="stat-value">{selectedCoin.volume}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Market Cap</span>
                      <span className="stat-value">{selectedCoin.marketCap}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="chart-container" ref={chartContainerRef}>
                {selectedCoin && <TradingChart coin={selectedCoin} timeframe={chartTimeframe} />}
              </div>

              <div className="trading-panel">
                <div className="order-form">
                  <div className="order-tabs">
                    <button className="order-tab active">Buy</button>
                    <button className="order-tab">Sell</button>
                  </div>
                  <div className="order-inputs">
                    <div className="input-group">
                      <label>Amount</label>
                      <input 
                        type="number" 
                        placeholder="0.00" 
                        className="order-input"
                        value={orderAmount}
                        onChange={(e) => setOrderAmount(e.target.value)}
                      />
                    </div>
                    <div className="input-group">
                      <label>Price</label>
                      <input 
                        type="number" 
                        className="order-input"
                        value={orderPrice}
                        onChange={(e) => setOrderPrice(e.target.value)}
                      />
                    </div>
                    <div className="input-group">
                      <label>Total</label>
                      <input 
                        type="number" 
                        className="order-input" 
                        value={calculateTotal()}
                        disabled 
                      />
                    </div>
                  </div>
                  <button className="place-order-btn buy-btn">
                    Place Buy Order
                  </button>
                </div>
              </div>
            </div>

            {/* Market Overview */}
            <div className="section">
              <h2 className="section-title">Market Overview</h2>
              <div className="market-table">
                <div className="table-header">
                  <div className="col">Coin</div>
                  <div className="col">Price</div>
                  <div className="col">24h Change</div>
                  <div className="col">Volume</div>
                  <div className="col">Market Cap</div>
                  <div className="col">Trade</div>
                </div>
                {marketData.map(coin => (
                  <div key={coin.id} className="table-row" onClick={() => setSelectedCoin(coin)}>
                    <div className="col coin-info">
                      <div className="coin-icon" style={{ backgroundColor: coin.color }}>
                        {coin.icon}
                      </div>
                      <div>
                        <div className="coin-name">{coin.name}</div>
                        <div className="coin-symbol">({coin.symbol})</div>
                      </div>
                    </div>
                    <div className="col price">${coin.price?.toFixed(2) || '0.00'}</div>
                    <div className={`col change-percent ${coin.changePercent > 0 ? 'positive' : 'negative'}`}>
                      {coin.changePercent > 0 ? '+' : ''}{coin.changePercent?.toFixed(2) || '0.00'}%
                    </div>
                    <div className="col volume">{coin.volume}</div>
                    <div className="col market-cap">{coin.marketCap}</div>
                    <div className="col trade-buttons">
                      <button 
                        className="trade-btn buy"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuySell(coin.id, 'buy');
                        }}
                      >
                        Buy
                      </button>
                      <button 
                        className="trade-btn sell"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuySell(coin.id, 'sell');
                        }}
                      >
                        Sell
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* My Portfolio */}
            <div className="section">
              <h2 className="section-title">My Portfolio</h2>
              <div className="portfolio-grid">
                {portfolio.map(item => (
                  <div key={item.id} className="portfolio-card">
                    <div className="portfolio-header">
                      <div className="coin-icon">{item.icon}</div>
                      <div>
                        <div className="portfolio-coin-name">{item.name}</div>
                        <div className="portfolio-amount">{item.amount.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="portfolio-value">
                      <div className="current-value">Current Value: <span className="value">${item.currentValue?.toFixed(2) || '0.00'}</span></div>
                      <div className={`portfolio-change ${item.change >= 0 ? 'positive' : 'negative'}`}>
                        {item.change >= 0 ? '+' : ''}${item.change?.toFixed(2) || '0.00'} ({item.changePercent?.toFixed(2) || '0.00'}%)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </>
            )}
          </div>

          <div className="right-section">
            {/* Trading Statistics */}
            <div className="stats-section">
              <h3 className="section-title">Trading Statistics</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-info">
                    <div className="stat-label">Total Trades</div>
                    <div className="stat-value">{tradingStats.totalTrades}</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🎯</div>
                  <div className="stat-info">
                    <div className="stat-label">Win Rate</div>
                    <div className="stat-value positive">{tradingStats.winRate}%</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <div className="stat-label">Total Profit</div>
                    <div className="stat-value positive">${tradingStats.totalProfit}</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📈</div>
                  <div className="stat-info">
                    <div className="stat-label">Best Trade</div>
                    <div className="stat-value positive">${tradingStats.bestTrade}</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📉</div>
                  <div className="stat-info">
                    <div className="stat-label">Worst Trade</div>
                    <div className="stat-value negative">${tradingStats.worstTrade}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Book */}
            <div className="orderbook-section">
              <h3 className="section-title">Order Book</h3>
              <div className="orderbook">
                <div className="orderbook-header">
                  <span>Price</span>
                  <span>Amount</span>
                  <span>Total</span>
                </div>
                <div className="sell-orders">
                  <div className="order-row sell">
                    <span className="price">1.32</span>
                    <span className="amount">1,250</span>
                    <span className="total">1,650</span>
                  </div>
                  <div className="order-row sell">
                    <span className="price">1.31</span>
                    <span className="amount">2,100</span>
                    <span className="total">2,751</span>
                  </div>
                  <div className="order-row sell">
                    <span className="price">1.30</span>
                    <span className="amount">850</span>
                    <span className="total">1,105</span>
                  </div>
                </div>
                <div className="spread">
                  <span className="spread-label">Spread: 0.01 (0.77%)</span>
                </div>
                <div className="buy-orders">
                  <div className="order-row buy">
                    <span className="price">1.29</span>
                    <span className="amount">1,800</span>
                    <span className="total">2,322</span>
                  </div>
                  <div className="order-row buy">
                    <span className="price">1.28</span>
                    <span className="amount">950</span>
                    <span className="total">1,216</span>
                  </div>
                  <div className="order-row buy">
                    <span className="price">1.27</span>
                    <span className="amount">1,500</span>
                    <span className="total">1,905</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Portfolio Performance Chart */}
            <div className="performance-section">
              <h3 className="section-title">Portfolio Performance</h3>
              <div className="performance-chart">
                <svg className="chart" viewBox="0 0 300 150">
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#22c55e" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <path
                    d="M20,120 Q60,100 100,80 T180,60 T260,40"
                    fill="url(#gradient)"
                    stroke="#22c55e"
                    strokeWidth="2"
                  />
                  <circle cx="20" cy="120" r="3" fill="#22c55e" />
                  <circle cx="100" cy="80" r="3" fill="#22c55e" />
                  <circle cx="180" cy="60" r="3" fill="#22c55e" />
                  <circle cx="260" cy="40" r="3" fill="#22c55e" />
                </svg>
                <div className="chart-labels">
                  <span>1W</span>
                  <span>1M</span>
                  <span>3M</span>
                  <span>1Y</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .crypto-sim {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 20px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: #22c55e;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .logo-text {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
        }

        .sim {
          color: #22c55e;
        }

        .balance-card {
          background: #f0fdf4;
          border: 2px solid #22c55e;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          min-width: 200px;
        }

        .balance-label {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 5px;
        }

        .balance-amount {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 5px;
        }

        .balance-change {
          font-size: 14px;
          font-weight: 600;
        }

        .balance-change.positive {
          color: #22c55e;
        }

        .nav-tabs {
          display: flex;
          gap: 0;
          margin-bottom: 30px;
          border-bottom: 2px solid #f3f4f6;
        }

        .nav-tab {
          background: none;
          border: none;
          padding: 15px 30px;
          font-size: 16px;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          transition: all 0.3s ease;
        }

        .nav-tab.active {
          color: #22c55e;
          border-bottom-color: #22c55e;
        }

        .main-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
        }

        /* Chart Section Styles */
        .chart-section {
          background: white;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e7eb;
        }

        .coin-selector {
          display: flex;
          gap: 8px;
        }

        .coin-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          color: #6b7280;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .coin-tab.active {
          background: #22c55e;
          color: white;
          border-color: #22c55e;
        }

        .coin-icon-small {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: white;
        }

        .timeframe-selector {
          display: flex;
          gap: 4px;
          background: #f3f4f6;
          border-radius: 8px;
          padding: 4px;
        }

        .timeframe-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          background: transparent;
          color: #6b7280;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .timeframe-btn.active {
          background: white;
          color: #22c55e;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .price-info {
          margin-bottom: 24px;
        }

        .current-price {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .price-value {
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
        }

        .price-change {
          font-size: 16px;
          font-weight: 600;
        }

        .price-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-label {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
        }

        .stat-value {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
        }

        .trading-chart {
          margin-bottom: 24px;
        }

        .price-chart {
          width: 100%;
          height: 300px;
          border-radius: 8px;
          background: #fafafa;
        }

        .chart-point {
          cursor: pointer;
          transition: r 0.3s ease;
        }

        .chart-point:hover {
          r: 5;
        }

        .chart-controls {
          margin-top: 16px;
        }

        .volume-bars {
          display: flex;
          align-items: end;
          gap: 2px;
          height: 60px;
          padding: 8px;
          background: #f9fafb;
          border-radius: 6px;
        }

        .volume-bar {
          width: 12px;
          border-radius: 2px;
          opacity: 0.7;
          transition: opacity 0.3s ease;
        }

        .volume-bar:hover {
          opacity: 1;
        }

        .trading-panel {
          background: #f9fafb;
          border-radius: 12px;
          padding: 20px;
        }

        .order-form {
          max-width: 300px;
        }

        .order-tabs {
          display: flex;
          margin-bottom: 16px;
          background: #e5e7eb;
          border-radius: 8px;
          padding: 2px;
        }

        .order-tab {
          flex: 1;
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          background: transparent;
          color: #6b7280;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .order-tab.active {
          background: white;
          color: #22c55e;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .order-inputs {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .input-group label {
          font-size: 12px;
          font-weight: 600;
          color: #374151;
        }

        .order-input {
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.3s ease;
        }

        .order-input:focus {
          outline: none;
          border-color: #22c55e;
        }

        .order-input:disabled {
          background: #f3f4f6;
          color: #6b7280;
        }

        .place-order-btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .buy-btn {
          background: #22c55e;
          color: white;
        }

        .buy-btn:hover {
          background: #16a34a;
        }

        .section {
          margin-bottom: 30px;
        }

        .section-title {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 20px;
        }

        .market-table {
          background: #f9fafb;
          border-radius: 12px;
          overflow: hidden;
        }

        .table-header {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
          gap: 20px;
          padding: 15px 20px;
          background: #f3f4f6;
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .table-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
          gap: 20px;
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
          align-items: center;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .table-row:hover {
          background: #f9fafb;
        }

        .table-row:last-child {
          border-bottom: none;
        }

        .coin-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .coin-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        }

        .coin-name {
          font-weight: 600;
          color: #1f2937;
        }

        .coin-symbol {
          font-size: 12px;
          color: #6b7280;
        }

        .price {
          font-weight: 600;
          color: #1f2937;
        }

        .change-24h {
          font-weight: 600;
        }

        .change-percent {
          font-weight: 600;
        }

        .positive {
          color: #22c55e;
        }

        .negative {
          color: #ef4444;
        }

        .loading-message {
          text-align: center;
          padding: 3rem;
          color: #6b7280;
          font-size: 1.2rem;
          background: white;
          border-radius: 12px;
          margin-bottom: 2rem;
        }

        .error-message {
          background-color: #fee2e2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          text-align: center;
        }

        .trade-buttons {
          display: flex;
          gap: 8px;
        }

        .trade-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .trade-btn.buy {
          background: #22c55e;
          color: white;
        }

        .trade-btn.buy:hover {
          background: #16a34a;
        }

        .trade-btn.sell {
          background: #374151;
          color: white;
        }

        .trade-btn.sell:hover {
          background: #1f2937;
        }

        .portfolio-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        /* Right Section Styles */
        .stats-section, .orderbook-section, .performance-section {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
        }

        .stat-icon {
          font-size: 24px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-radius: 8px;
        }

        .stat-info {
          flex: 1;
        }

        .stat-card .stat-label {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .stat-card .stat-value {
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
        }

        .orderbook {
          font-size: 12px;
        }

        .orderbook-header {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
          font-weight: 600;
          color: #6b7280;
        }

        .order-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
          padding: 6px 0;
          font-weight: 500;
        }

        .order-row.sell .price {
          color: #ef4444;
        }

        .order-row.buy .price {
          color: #22c55e;
        }

        .spread {
          text-align: center;
          padding: 8px 0;
          border-top: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
          margin: 8px 0;
        }

        .spread-label {
          font-size: 11px;
          color: #6b7280;
          font-weight: 600;
        }

        .performance-chart {
          position: relative;
        }

        .performance-chart .chart {
          width: 100%;
          height: 150px;
        }

        .performance-chart .chart-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
          font-size: 11px;
          color: #6b7280;
        }

        .portfolio-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
        }

        .portfolio-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 15px;
        }

        .portfolio-coin-name {
          font-weight: 600;
          color: #1f2937;
        }

        .portfolio-amount {
          font-size: 14px;
          color: #6b7280;
        }

        .portfolio-value {
          margin-top: 15px;
        }

        .current-value {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 5px;
        }

        .value {
          font-weight: 600;
          color: #1f2937;
        }

        .portfolio-change {
          font-size: 14px;
          font-weight: 600;
        }

        .chart-section {
          background: #f9fafb;
          border-radius: 12px;
          padding: 20px;
        }

        .chart-title {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 20px;
        }

        .chart-container {
          position: relative;
        }

        .chart {
          width: 100%;
          height: 200px;
        }

        .chart-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          font-size: 12px;
          color: #6b7280;
        }

        .chart-y-labels {
          position: absolute;
          left: -10px;
          top: 0;
          height: 200px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          font-size: 12px;
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .main-content {
            grid-template-columns: 1fr;
          }

          .table-header,
          .table-row {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .portfolio-grid {
            grid-template-columns: 1fr;
          }

          .header {
            flex-direction: column;
            gap: 20px;
          }

          .chart-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .coin-selector {
            flex-wrap: wrap;
          }

          .price-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .price-value {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
}

export default QuoteViewer;
