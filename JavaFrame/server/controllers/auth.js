const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 检查用户名是否已存在
    const [existingUsers] = await db.execute(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: '用户名已存在' });
    }

    // 使用 bcrypt 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建新用户
    const [result] = await db.execute(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );

    res.status(201).json({
      message: '注册成功',
      user: {
        id: result.insertId,
        username
      }
    });
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({ message: '注册失败' });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 查询用户
    const [users] = await db.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    const user = users[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 生成 JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ message: '登录失败' });
  }
};

module.exports = {
  register,
  login
}; 