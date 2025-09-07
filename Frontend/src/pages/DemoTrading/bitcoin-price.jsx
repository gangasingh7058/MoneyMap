import { useEffect, useState } from "react";
import axios from "axios";

function BitcoinPriceViewer() {
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

export default BitcoinPriceViewer;
