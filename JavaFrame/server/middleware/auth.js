const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // 打印请求头，检查 token 是否正确传递
    console.log('Authorization Header:', req.headers.authorization);
    
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: '未提供认证令牌' });
    }

    // 打印 token 信息
    console.log('Token:', token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 打印解码后的用户信息
    console.log('Decoded User:', decoded);
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error('认证失败:', error);
    res.status(401).json({ message: '认证失败' });
  }
}; 