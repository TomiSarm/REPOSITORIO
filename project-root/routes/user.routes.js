import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Ruta para obtener los datos del usuario logueado
router.get('/current', authMiddleware, (req, res) => {
  res.json({
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    age: req.user.age,
    role: req.user.role
  });
});

export default router;