import mongoose from 'mongoose';
import bcrypt from 'bcrypt'; 

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }, // Referencia al carrito
  role: { type: String, default: 'user' } // Por defecto 'user', pero puede cambiar
});

// Método para hacer hash de la contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
  next();
});

const User = mongoose.model('User', userSchema);

export default User;