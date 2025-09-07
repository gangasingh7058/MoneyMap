const { Router } = require("express");
const app=Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt=require("jsonwebtoken")
const dotenv=require("dotenv")
dotenv.config()
const JWT_SECRET=process.env.JWT_SECRET
const axios=require("axios")

const FINNHUB_API_KEY = "d2ucpr1r01qo4hodvh9gd2ucpr1r01qo4hodvha0" // paste your key

app.get('/',(req,res)=>{
    res.json({
        msg:"Welcome To Demo Trading"
    })
})

// Get stock quote by symbol
app.get("/quote", async (req, res) => {
    try {
      const { symbol='TSLA' } = req.query; // e.g. AAPL, TSLA
      const response = await axios.get(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
      );
      res.json(response.data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  
  module.exports=app