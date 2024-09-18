import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.js'; // Ajusta la ruta según tu proyecto

const router = express.Router();

// Ruta para el registro de usuarios
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ message: 'El email ya está registrado' });

    const user = new User({
      first_name,
      last_name,
      email,    
      age,
      password // Se hará hash en el modelo
    });

    await user.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error registrando usuario' });
  }
});

// Ruta de login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

    // Generar JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ message: 'Login exitoso', token });
  } catch (error) {
    res.status(500).json({ error: 'Error en el inicio de sesión' });
  }
});

export default router;