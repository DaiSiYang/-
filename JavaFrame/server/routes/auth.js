const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

router.post('/login', async (req, res) => {
  try {
    console.log('登录请求体:', req.body);
    const { username, password } = req.body;

    // 验证请求数据
    if (!username || !password) {
      return res.status(400).json({ message: '请提供用户名和密码' });
    }

    // 查询用户
    const [users] = await db.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    console.log('查询到的用户:', users);
    const user = users[0];

    // 验证用户和密码
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 生成 token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('生成的 token:', token);

    // 返回用户信息和 token
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ message: '服务器错误，请稍后重试' });
  }
});

module.exports = router; 