import { useEffect, useState } from "react";
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

  const [marketData, setMarketData] = useState([
    {
      id: 1,
      name: 'DummyCoin A',
      symbol: 'luD',
      price: 1.30,
      change24h: 5.20,
      changePercent: 5.20,
      icon: '₿',
      color: '#f7931a'
    },
    {
      id: 2,
      name: 'DummyCoin B',
      symbol: 'luD',
      price: 1.30,
      change24h: 5.20,
      changePercent: -3.15,
      icon: '🪙',
      color: '#627eea'
    },
    {
      id: 3,
      name: 'DummyCoin A',
      symbol: 'luD',
      price: 1.30,
      change24h: 280,
      changePercent: -3.15,
      icon: '🔺',
      color: '#00d4aa'
    }
  ]);

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

  const tabs = ['Dashboard', 'Portfolio', 'History', 'Settings'];

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
            <div className="balance-amount">{virtualBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} DUC</div>
            <div className="balance-change positive">
              +{balanceChange.amount} ({balanceChange.percentage}%)
            </div>
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
            {/* Market Overview */}
            <div className="section">
              <h2 className="section-title">Market Overview</h2>
              <div className="market-table">
                <div className="table-header">
                  <div className="col">Coin</div>
                  <div className="col">Price</div>
                  <div className="col">24h</div>
                  <div className="col">Change</div>
                  <div className="col">Trade</div>
                </div>
                {marketData.map(coin => (
                  <div key={coin.id} className="table-row">
                    <div className="col coin-info">
                      <div className="coin-icon" style={{ backgroundColor: coin.color }}>
                        {coin.icon}
                      </div>
                      <div>
                        <div className="coin-name">{coin.name}</div>
                        <div className="coin-symbol">({coin.symbol})</div>
                      </div>
                    </div>
                    <div className="col price">${coin.price}</div>
                    <div className="col change-24h positive">${coin.change24h}</div>
                    <div className={`col change-percent ${coin.changePercent > 0 ? 'positive' : 'negative'}`}>
                      {coin.changePercent > 0 ? '+' : ''}{coin.changePercent}%
                    </div>
                    <div className="col trade-buttons">
                      <button 
                        className="trade-btn buy"
                        onClick={() => handleBuySell(coin.id, 'buy')}
                      >
                        Buy
                      </button>
                      <button 
                        className="trade-btn sell"
                        onClick={() => handleBuySell(coin.id, 'sell')}
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
                      <div className="current-value">Current Value: <span className="value">${item.currentValue.toLocaleString()}</span></div>
                      <div className={`portfolio-change ${item.change >= 0 ? 'positive' : 'negative'}`}>
                        {item.change >= 0 ? '+' : ''}${item.change} ({item.changePercent}%)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="right-section">
            {/* Portfolio Value History Chart */}
            <div className="chart-section">
              <h3 className="chart-title">Portfolio Value History</h3>
              <div className="chart-container">
                <svg className="chart" viewBox="0 0 300 150">
                  <polyline
                    points="20,120 60,100 100,80 140,70 180,60 220,50 260,40"
                    fill="none"
                    stroke="#4ade80"
                    strokeWidth="3"
                  />
                  <circle cx="20" cy="120" r="4" fill="#4ade80" />
                  <circle cx="60" cy="100" r="4" fill="#4ade80" />
                  <circle cx="100" cy="80" r="4" fill="#4ade80" />
                  <circle cx="140" cy="70" r="4" fill="#4ade80" />
                  <circle cx="180" cy="60" r="4" fill="#4ade80" />
                  <circle cx="220" cy="50" r="4" fill="#4ade80" />
                  <circle cx="260" cy="40" r="4" fill="#4ade80" />
                </svg>
                <div className="chart-labels">
                  <span>0.3</span>
                  <span>1.2k</span>
                  <span>5.5k</span>
                  <span>24.5k</span>
                  <span>13:30</span>
                </div>
                <div className="chart-y-labels">
                  <span>70%</span>
                  <span>60%</span>
                  <span>30%</span>
                  <span>0</span>
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
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
          gap: 20px;
          padding: 15px 20px;
          background: #f3f4f6;
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .table-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
          gap: 20px;
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
          align-items: center;
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
        }
      `}</style>
    </div>
  );
}

export default QuoteViewer;
