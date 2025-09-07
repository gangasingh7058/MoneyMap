const { Router } = require("express");
const app=Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const dotenv=require("dotenv")
dotenv.config()

const FINNHUB_API_KEY = 'd2ucpr1r01qo4hodvh9gd2ucpr1r01qo4hodvha0';
const axios=require("axios")

// Route to get crypto quote
app.get("/crypto/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;

    // Finnhub crypto symbols are like: BINANCE:BTCUSDT, BINANCE:ETHUSDT, etc.
    const response = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
    );

    res.json({
      symbol,
      price: response.data.c, // current price
      high: response.data.h,
      low: response.data.l,
      open: response.data.o,
      prevClose: response.data.pc,
      change: response.data.d,
      changePercent: response.data.dp,
    });
  } catch (error) {
    console.error("Error fetching crypto data:", error.message);
    res.status(500).json({ error: "Failed to fetch crypto data" });
  }
});

module.exports=app