const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const authRoutes = require('./routes/auth')
const walletRoutes = require('./routes/wallet')

const app = express()

// 连接数据库
connectDB()

// 中间件
app.use(cors())
app.use(express.json())

// 路由
app.use('/api/auth', authRoutes)
app.use('/api/wallet', walletRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`)
}) 