import dotenv from 'dotenv';


dotenv.config();

export default {
  port: process.env.PORT || 8081,
  mongoUri: process.env.MONGO_URI || 'mongodb+srv://tomasarmiento51342679:Tomi51342679@cluster0.g0a3d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  jwtSecret: process.env.JWT_SECRET || '91b5fd8f1d1fba8fdfd1a789e9d7d51fa848d0b162cdd44721399e0b3d9b26f4f8a6', 
  sessionSecret: process.env.SESSION_SECRET || 'f8d1be6aafcd1e87f8a12dbb2c6aa7f3c4db3b6b0fd10e8bbad93877e9a5d661'
};