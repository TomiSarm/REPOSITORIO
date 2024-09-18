import jwt from 'jsonwebtoken';
import User from '../models/user.js';

// Middleware para verificar JWT y extraer usuario
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token; // Extraer el token de la cookie
  if (!token) return res.status(401).json({ message: 'Acceso no autorizado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: 'Usuario no encontrado' });
    req.user = user; // Guardar el usuario en la solicitud
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

export default authMiddleware;