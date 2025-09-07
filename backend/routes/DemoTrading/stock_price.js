const { Router } = require("express");
const app=Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const dotenv=require("dotenv")
dotenv.config()

const FINNHUB_API_KEY = 'd2ucpr1r01qo4hodvh9gd2ucpr1r01qo4hodvha0';
const axios=require("axios")

// Get all market data for demo trading
app.get('/market-data', async (req, res) => {
  try {
    const cryptoSymbols = [
      {
        symbol: 'BINANCE:BTCUSDT',
        name: 'Bitcoin',
        icon: '₿',
        color: '#f7931a'
      },
      {
        symbol: 'BINANCE:ETHUSDT', 
        name: 'Ethereum',
        icon: '⟠',
        color: '#627eea'
      },
      {
        symbol: 'BINANCE:ADAUSDT',
        name: 'Cardano', 
        icon: '🔺',
        color: '#00d4aa'
      }
    ];

    const marketData = await Promise.all(
      cryptoSymbols.map(async (crypto, index) => {
        try {
          const response = await axios.get(
            `https://finnhub.io/api/v1/quote?symbol=${crypto.symbol}&token=${FINNHUB_API_KEY}`
          );

          const data = response.data;
          const price = data.c || 0;
          const change = data.d || 0;
          const changePercent = data.dp || 0;
          
          // Generate realistic volume and market cap based on the coin
          const volumes = ['2.5M', '1.8M', '890K'];
          const marketCaps = ['45.2B', '28.7B', '12.3B'];
          
          return {
            id: index + 1,
            name: crypto.name,
            symbol: crypto.symbol.split(':')[1] || crypto.symbol,
            price: price,
            change24h: change,
            changePercent: changePercent,
            icon: crypto.icon,
            color: crypto.color,
            volume: volumes[index],
            marketCap: marketCaps[index],
            high24h: data.h || price * 1.1,
            low24h: data.l || price * 0.9
          };
        } catch (error) {
          console.error(`Error fetching ${crypto.name} data:`, error.message);
          // Return fallback data if API fails
          return {
            id: index + 1,
            name: crypto.name,
            symbol: crypto.symbol.split(':')[1] || crypto.symbol,
            price: [45000, 3200, 0.85][index], // Fallback prices
            change24h: [1200, -150, 0.12][index],
            changePercent: [2.8, -4.5, 16.4][index],
            icon: crypto.icon,
            color: crypto.color,
            volume: ['2.5M', '1.8M', '890K'][index],
            marketCap: ['45.2B', '28.7B', '12.3B'][index],
            high24h: [46500, 3350, 0.92][index],
            low24h: [44200, 3050, 0.73][index]
          };
        }
      })
    );

    res.json({
      success: true,
      data: marketData
    });
  } catch (error) {
    console.error('Error fetching market data:', error.message);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch market data' 
    });
  }
});

// Route to get individual crypto quote
app.get("/crypto/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;

    // Finnhub crypto symbols are like: BINANCE:BTCUSDT, BINANCE:ETHUSDT, etc.
    const response = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
    );

    const data = response.data;
    
    res.json({
      success: true,
      symbol,
      price: data.c || 0, // current price
      high: data.h || 0,
      low: data.l || 0,
      open: data.o || 0,
      prevClose: data.pc || 0,
      change: data.d || 0,
      changePercent: data.dp || 0,
    });
  } catch (error) {
    console.error("Error fetching crypto data:", error.message);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch crypto data" 
    });
  }
});

// Get portfolio data (mock for now, can be enhanced with real user data)
app.get('/portfolio', async (req, res) => {
  try {
    // Mock portfolio data - in real app, fetch from database based on user
    const portfolio = [
      {
        id: 1,
        name: 'Bitcoin',
        symbol: 'BTC',
        amount: 0.5,
        currentValue: 0,
        change: 0,
        changePercent: 0,
        icon: '₿'
      },
      {
        id: 2,
        name: 'Ethereum',
        symbol: 'ETH',
        amount: 2.5,
        currentValue: 0,
        change: 0,
        changePercent: 0,
        icon: '⟠'
      }
    ];

    // Get current prices to calculate portfolio values
    const btcResponse = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=BINANCE:BTCUSDT&token=${FINNHUB_API_KEY}`
    );
    const ethResponse = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=BINANCE:ETHUSDT&token=${FINNHUB_API_KEY}`
    );

    // Update portfolio with real prices
    portfolio[0].currentValue = (btcResponse.data.c || 45000) * portfolio[0].amount;
    portfolio[0].change = (btcResponse.data.d || 0) * portfolio[0].amount;
    portfolio[0].changePercent = btcResponse.data.dp || 0;

    portfolio[1].currentValue = (ethResponse.data.c || 3200) * portfolio[1].amount;
    portfolio[1].change = (ethResponse.data.d || 0) * portfolio[1].amount;
    portfolio[1].changePercent = ethResponse.data.dp || 0;

    res.json({
      success: true,
      portfolio: portfolio
    });
  } catch (error) {
    console.error('Error fetching portfolio data:', error.message);
    res.json({
      success: false,
      error: 'Failed to fetch portfolio data'
    });
  }
});

// Get trading statistics
app.get('/trading-stats', (req, res) => {
  // Mock trading statistics - in real app, calculate from user's trading history
  res.json({
    success: true,
    stats: {
      totalTrades: 42,
      winRate: 68.5,
      totalProfit: 1250.45,
      bestTrade: 245.67,
      worstTrade: -89.23
    }
  });
});

module.exports = app