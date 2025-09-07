import { useEffect, useState } from "react";
import axios from "axios";

function QuoteViewer() {
  const [bitcoinPrice, setBitcoinPrice] = useState(null);
  const [priceChange, setPriceChange] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartTimeframe, setChartTimeframe] = useState('1D');

  // Fetch Bitcoin price from CoinGecko API
  const fetchBitcoinPrice = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
      
      if (response.data.bitcoin) {
        setBitcoinPrice(response.data.bitcoin.usd);
        setPriceChange(response.data.bitcoin.usd_24h_change);
      } else {
        setError('Failed to fetch Bitcoin price');
      }
    } catch (error) {
      console.error('Error fetching Bitcoin price:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBitcoinPrice();
    // Update price every 30 seconds
    const interval = setInterval(fetchBitcoinPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bitcoin-price-viewer">
      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="logo">
            <div className="logo-icon">₿</div>
            <span className="logo-text">BITCOIN <span className="tracker">TRACKER</span></span>
          </div>
        </div>

        <div className="main-content">
          {error && <div className="error-message">{error}</div>}
          
          {loading ? (
            <div className="loading-message">Loading Bitcoin price...</div>
          ) : (
            <div className="price-section">
              <div className="bitcoin-card">
                <div className="coin-header">
                  <div className="coin-icon">₿</div>
                  <div className="coin-info">
                    <h1 className="coin-name">Bitcoin</h1>
                    <p className="coin-symbol">BTC</p>
                  </div>
                </div>
                
                <div className="price-display">
                  <div className="current-price">
                    ${bitcoinPrice?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                  </div>
                  <div className={`price-change ${priceChange >= 0 ? 'positive' : 'negative'}`}>
                    {priceChange >= 0 ? '+' : ''}{priceChange?.toFixed(2) || '0.00'}% (24h)
                  </div>
                </div>
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

              <div className="refresh-section">
                <button onClick={fetchBitcoinPrice} className="refresh-btn">
                  Refresh Price
                </button>
                <p className="last-updated">Auto-updates every 30 seconds</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .bitcoin-price-viewer {
          min-height: 100vh;
          background: linear-gradient(135deg, #f7931a 0%, #ff6b35 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 20px;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .header {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 40px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .logo-icon {
          width: 50px;
          height: 50px;
          background: #f7931a;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: white;
          font-weight: bold;
        }

        .logo-text {
          font-size: 28px;
          font-weight: bold;
          color: #1f2937;
        }

        .tracker {
          color: #f7931a;
        }

        .main-content {
          text-align: center;
        }

        .loading-message {
          font-size: 1.2rem;
          color: #6b7280;
          padding: 40px;
        }

        .error-message {
          background-color: #fee2e2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 1rem 2rem;
          border-radius: 8px;
          margin-bottom: 2rem;
          font-size: 1rem;
        }

        .bitcoin-card {
          background: #f9fafb;
          border-radius: 20px;
          padding: 40px;
          margin-bottom: 30px;
          border: 2px solid #f7931a;
        }

        .coin-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-bottom: 30px;
        }

        .coin-icon {
          width: 80px;
          height: 80px;
          background: #f7931a;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          color: white;
          font-weight: bold;
        }

        .coin-info {
          text-align: left;
        }

        .coin-name {
          font-size: 2.5rem;
          font-weight: bold;
          color: #1f2937;
          margin: 0;
        }

        .coin-symbol {
          font-size: 1.2rem;
          color: #6b7280;
          margin: 5px 0 0 0;
        }

        .price-display {
          text-align: center;
        }

        .current-price {
          font-size: 3.5rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 15px;
        }

        .price-change {
          font-size: 1.5rem;
          font-weight: 600;
        }

        .price-change.positive {
          color: #22c55e;
        }

        .price-change.negative {
          color: #ef4444;
        }

        .timeframe-selector {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 30px;
        }

        .timeframe-btn {
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .timeframe-btn:hover {
          background: #e5e7eb;
        }

        .timeframe-btn.active {
          background: #f7931a;
          color: white;
          border-color: #f7931a;
        }

        .refresh-section {
          text-align: center;
        }

        .refresh-btn {
          background: #f7931a;
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease;
          margin-bottom: 15px;
        }

        .refresh-btn:hover {
          background: #e8851e;
        }

        .last-updated {
          color: #6b7280;
          font-size: 14px;
          margin: 0;
        }

        @media (max-width: 768px) {
          .container {
            padding: 20px;
          }

          .coin-header {
            flex-direction: column;
            text-align: center;
          }

          .coin-info {
            text-align: center;
          }

          .coin-name {
            font-size: 2rem;
          }

          .current-price {
            font-size: 2.5rem;
          }

          .timeframe-selector {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
}

  // Initialize wallet for new user
  const initializeWallet = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/wallet/initialize/${DEMO_USER_ID}`);
      
      if (response.data.success) {
        setUserPortfolio(response.data.data);
        setVirtualBalance(response.data.data.balance);
        
        // Show welcome message for new users
        if (response.data.message.includes('Welcome')) {
          alert(response.data.message);
        }
      }
    } catch (error) {
      console.error('Error initializing wallet:', error);
    }
  };

  // Fetch user wallet/portfolio data
  const fetchWalletData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/wallet/portfolio/${DEMO_USER_ID}`);
      
      if (response.data.success) {
        setUserPortfolio(response.data.data);
        setVirtualBalance(response.data.data.balance);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      // If wallet doesn't exist, initialize it
      await initializeWallet();
    }
  };

  // Fetch user holdings
  const fetchHoldings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/trades/holdings/${DEMO_USER_ID}`);
      
      if (response.data.success) {
        setHoldings(response.data.data);
        // Convert holdings to portfolio format for display
        const portfolioData = response.data.data.map(holding => ({
          id: holding.symbol,
          name: holding.symbol,
          symbol: holding.symbol,
          amount: holding.quantity,
          currentValue: holding.quantity * holding.avgBuyPrice,
          avgBuyPrice: holding.avgBuyPrice,
          totalInvested: holding.totalInvested,
          change: 0, // Will be calculated with current market price
          changePercent: 0,
          icon: '₿'
        }));
        setPortfolio(portfolioData);
      }
    } catch (error) {
      console.error('Error fetching holdings:', error);
    }
  };

  // Fetch trade history
  const fetchTradeHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/trades/history/${DEMO_USER_ID}?limit=10`);
      
      if (response.data.success) {
        setTradeHistory(response.data.data.trades);
      }
    } catch (error) {
      console.error('Error fetching trade history:', error);
    }
  };

  // Fetch trading statistics
  const fetchTradingStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/trades/stats/${DEMO_USER_ID}`);
      
      if (response.data.success) {
        const stats = response.data.data;
        setTradingStats({
          totalTrades: stats.totalTrades,
          winRate: stats.sellTrades > 0 ? ((stats.netPnL > 0 ? 1 : 0) * 100) : 0,
          totalProfit: stats.netPnL,
          bestTrade: stats.totalRealized > 0 ? stats.totalRealized / stats.sellTrades : 0,
          worstTrade: 0 // This would need more detailed calculation
        });
      }
    } catch (error) {
      console.error('Error fetching trading stats:', error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchMarketData();
    fetchWalletData();
    fetchHoldings();
    fetchTradeHistory();
    fetchTradingStats();
    
    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchMarketData();
      fetchWalletData();
      fetchHoldings();
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

  // Execute trade using real API
  const executeTrade = async (symbol, quantity, price, type) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/trades/execute`, {
        userId: DEMO_USER_ID,
        symbol: symbol,
        quantity: parseInt(quantity),
        price: parseFloat(price),
        type: type
      });

      if (response.data.success) {
        // Refresh data after successful trade
        await fetchWalletData();
        await fetchHoldings();
        await fetchTradeHistory();
        await fetchTradingStats();
        
        // Clear order form
        setOrderAmount('');
        setOrderPrice('');
        
        alert(`${type.charAt(0).toUpperCase() + type.slice(1)} order executed successfully!`);
      } else {
        alert(`Trade failed: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error executing trade:', error);
      alert(`Trade failed: ${error.response?.data?.message || 'Network error'}`);
    }
  };

  const handleBuySell = (coinId, action) => {
    const coin = marketData.find(c => c.id === coinId);
    if (!coin) return;

    const quantity = 1; // Fixed quantity for quick trade
    executeTrade(coin.symbol, quantity, coin.price, action);
  };

  // Handle order form submission
  const handleOrderSubmit = (type) => {
    if (!selectedCoin || !orderAmount || !orderPrice) {
      alert('Please fill in all order details');
      return;
    }
    
    executeTrade(selectedCoin.symbol, orderAmount, orderPrice, type);
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
                  <div className="order-buttons">
                    <button 
                      className="place-order-btn buy-btn"
                      onClick={() => handleOrderSubmit('buy')}
                    >
                      Place Buy Order
                    </button>
                    <button 
                      className="place-order-btn sell-btn"
                      onClick={() => handleOrderSubmit('sell')}
                    >
                      Place Sell Order
                    </button>
                  </div>
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

            {/* Trade History */}
            <div className="section">
              <h2 className="section-title">Recent Trades</h2>
              <div className="trade-history">
                {tradeHistory.length > 0 ? (
                  <div className="trades-table">
                    <div className="table-header">
                      <div className="col">Symbol</div>
                      <div className="col">Type</div>
                      <div className="col">Quantity</div>
                      <div className="col">Price</div>
                      <div className="col">Total</div>
                      <div className="col">Date</div>
                    </div>
                    {tradeHistory.map(trade => (
                      <div key={trade.id} className="table-row">
                        <div className="col">
                          <span className="symbol">{trade.symbol}</span>
                        </div>
                        <div className="col">
                          <span className={`trade-type ${trade.type}`}>
                            {trade.type.toUpperCase()}
                          </span>
                        </div>
                        <div className="col">{trade.quantity}</div>
                        <div className="col">${trade.price.toFixed(2)}</div>
                        <div className="col">${(trade.quantity * trade.price).toFixed(2)}</div>
                        <div className="col">
                          {new Date(trade.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-trades">
                    <p>No trades yet. Start trading to see your history here!</p>
                  </div>
                )}
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

        .order-buttons {
          display: flex;
          gap: 12px;
        }

        .place-order-btn {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
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

        .sell-btn {
          background: #ef4444;
          color: white;
        }

        .sell-btn:hover {
          background: #dc2626;
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

        .trade-history {
          background: white;
          border-radius: 12px;
          overflow: hidden;
        }

        .trades-table .table-header {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1.5fr;
          gap: 20px;
          padding: 15px 20px;
          background: #f3f4f6;
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .trades-table .table-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1.5fr;
          gap: 20px;
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
          align-items: center;
        }

        .trades-table .table-row:last-child {
          border-bottom: none;
        }

        .trade-type {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .trade-type.buy {
          background: #dcfce7;
          color: #16a34a;
        }

        .trade-type.sell {
          background: #fee2e2;
          color: #dc2626;
        }

        .symbol {
          font-weight: 600;
          color: #1f2937;
        }

        .no-trades {
          text-align: center;
          padding: 40px 20px;
          color: #6b7280;
        }

        .no-trades p {
          margin: 0;
          font-size: 16px;
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
