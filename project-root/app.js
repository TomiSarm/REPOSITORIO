import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import initializeProductRoutes from './routes/products.js';
import initializeCartRoutes from './routes/carts.js';
import initializeViewRoutes from './routes/views.router.js';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8080;

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

// Leer productos desde el archivo JSON
const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf-8'));

// Inicializar rutas con WebSocket
app.use('/api/products', initializeProductRoutes(io, products));
app.use('/api/carts', initializeCartRoutes(io));
app.use('/', initializeViewRoutes(io, products));

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});