const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['send', 'receive', 'exchange', 'stake'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
})

const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction 