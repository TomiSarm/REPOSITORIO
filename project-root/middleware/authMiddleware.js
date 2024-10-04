import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const authMiddleware = async (req, res, next) => {
  console.log('Cookies:', req.cookies); 

  const token = req.cookies.token; 
  if (!token) {
    return res.status(401).json({ message: 'Acceso no autorizado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado:', decoded);
    const user = await User.findById(decoded.userId); 
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log('Error verificando el token:', error);
    return res.status(401).json({ message: 'Token inválido' });
  }
};


export default authMiddleware;
