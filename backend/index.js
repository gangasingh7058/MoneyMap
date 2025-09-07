const express = require('express')
const cors = require('cors')
const app = express()
const dotenv = require('dotenv')
dotenv.config()

const PORT = process.env.PORT || 3000

// Import routes
const authRoutes = require('./routes/Auth/auth.js')
const mentorRoutes = require('./routes/Mentor/mentor.js')
const userRoutes = require('./routes/User/user.js')
const demoTradingRoutes = require('./routes/DemoTrading/stock_price.js')
const walletRoutes = require('./routes/DemoTrading/wallet.js')
const tradesRoutes = require('./routes/DemoTrading/trades.js')

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/mentor', mentorRoutes)
app.use('/api/user', userRoutes)
app.use('/api/demo-trading', demoTradingRoutes)
app.use('/api/wallet', walletRoutes)
app.use('/api/trades', tradesRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Gene Education Platform API is running!' })
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
