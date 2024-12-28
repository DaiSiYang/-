const mongoose = require('mongoose')

const walletSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  balance: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    enum: ['主钱包', '投资钱包', '交易钱包', '储蓄钱包'],
    default: '主钱包'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Wallet = mongoose.model('Wallet', walletSchema)

module.exports = Wallet 