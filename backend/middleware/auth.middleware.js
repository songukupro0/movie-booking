const jwt = require('jsonwebtoken');

/**
 * Middleware xác thực JWT token.
 * Lấy token từ header: Authorization: Bearer <token>
 * Nếu hợp lệ, gắn thông tin user vào req.user và cho đi tiếp.
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // gắn payload (id, role, email, ...) vào request
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
  }
};

module.exports = { verifyToken };
