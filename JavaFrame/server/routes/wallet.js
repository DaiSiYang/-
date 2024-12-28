const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Wallet = require('../models/Wallet');
const { validationResult, check } = require('express-validator');

// @route   GET /api/wallet
// @desc    获取用户的钱包列表
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const wallets = await Wallet.find({ owner: req.user.id })
      .sort({ createdAt: -1 });
    res.json(wallets);
  } catch (err) {
    console.error('获取钱包列表失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// @route   POST /api/wallet
// @desc    创建新钱包
// @access  Private
router.post('/', [
  auth,
  check('name', '钱包名称不能为空').notEmpty(),
  check('type', '钱包类型不能为空').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, type } = req.body;

    // 创建新钱包
    const wallet = new Wallet({
      name,
      type,
      owner: req.user.id,
      address: generateWalletAddress(), // 这里需要实现生成钱包地址的函数
      balance: 0
    });

    await wallet.save();
    res.json(wallet);
  } catch (err) {
    console.error('创建钱包失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 生成钱包地址的辅助函数
function generateWalletAddress() {
  // 这里应该实现真实的钱包地址生成逻辑
  // 目前使用随机字符串模拟
  const chars = '0123456789abcdef';
  let address = '0x';
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
}

module.exports = router; 