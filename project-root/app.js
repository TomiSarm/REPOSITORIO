import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import initializeProductRoutes from './routes/products.js';
import initializeCartRoutes from './routes/carts.js';
import initializeViewRoutes from './routes/views.router.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import passport from 'passport'; 
import passportConfig from './config/passport.js'; 
import session from 'express-session'; 
import cookieParser from 'cookie-parser';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();
const app = express();
const port = 8081;


app.engine('handlebars', engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use(express.static(path.join(__dirname, 'public')));

passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

import authRoutes from './routes/auth.routes.js'; 
import userRoutes from './routes/user.routes.js'; 
// Configurar WebSocket
const server = createServer(app);
const io = new Server(server);


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Inicializar rutas con WebSocket
app.use('/api/products', initializeProductRoutes(io));
app.use('/api/carts', initializeCartRoutes(io));
app.use('/', initializeViewRoutes(io));
app.use('/api/auth', authRoutes); 
app.use('/api/users', passport.authenticate('jwt', { session: false }), userRoutes); 

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use((err,res) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


router.get('/', async (req, res) => {
  try {
    const products = await Product.find(); 
    res.render('home', { products }); 
  } catch (error) {
    res.status(500).send('Error al cargar los productos');
  }
});