import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import initializeProductRoutes from './routes/products.js';
import initializeCartRoutes from './routes/carts.js';
import initializeViewRoutes from './routes/views.router.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Configurar dotenv
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8081;

// Configurar Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsear JSON
app.use(express.json());

// Configurar rutas estáticas
app.use(express.static(path.join(__dirname, 'public')));

// Configurar WebSocket
const server = createServer(app);
const io = new Server(server);

// Conectar a MongoDB
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

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});