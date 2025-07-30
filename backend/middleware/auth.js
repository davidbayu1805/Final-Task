import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = {
  authenticate: (req, res, next) => {
    try {
      const token = req.header('Authorization');
      
      if (!token) {
        return res.status(401).json({ 
          success: false,
          message: 'Authorization token required' 
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid or expired token',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  }
};

export default authMiddleware;