import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import initializeProductRoutes from './routes/products.js';
import initializeCartRoutes from './routes/carts.js';

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

io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Inicializar rutas con WebSocket
app.use('/api/products', initializeProductRoutes(io));
app.use('/api/carts', initializeCartRoutes(io));

// Rutas para las vistas
app.get('/', (req, res) => {
  res.render('home', { products });
});

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { products });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.emit('initialize', products);

  socket.on('createProduct', (data) => {
    const { title, description, code, price, status = true, stock, category, thumbnails = [] } = data;
    const newProduct = {
      id: nextId++,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails
    };
    products.push(newProduct);
    io.emit('productAdded', newProduct);
  });

  socket.on('deleteProduct', (id) => {
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      const deletedProduct = products.splice(index, 1)[0];
      io.emit('productDeleted', deletedProduct);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});