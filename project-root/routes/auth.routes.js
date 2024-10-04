import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.js'; 

const router = express.Router();


router.post('/register', async (req, res) => {
  try {

    console.log('Datos recibidos:', req.body);
    console.log('Headers:', req.headers);

    const { first_name, last_name, email, age, password } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ message: 'El email ya está registrado' });

    const user = new User({
      first_name,
      last_name,
      email,    
      age,
      password 
    });

    await user.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error registrando usuario:', error); 
    res.status(500).json({ error: 'Error registrando usuario' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Credenciales incorrectas' });
  }

  
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  
  res.cookie('token', token, {
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'strict', 
  });

  res.status(200).json({ message: 'Autenticación exitosa' });
});
export default router;