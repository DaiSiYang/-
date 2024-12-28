const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB连接成功')
  } catch (err) {
    console.error('MongoDB连接失败:', err.message)
    process.exit(1)
  }
}

module.exports = connectDB