import dotenv from 'dotenv';


dotenv.config();

export default {
  port: process.env.PORT || 8081,
  mongoUri: process.env.MONGO_URI || 'mongodb+srv://tomasarmiento51342679:Tomi51342679@cluster0.g0a3d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  jwtSecret: process.env.JWT_SECRET || 'claveSecreta', 
  sessionSecret: process.env.SESSION_SECRET || 'sesionSecreta'
};