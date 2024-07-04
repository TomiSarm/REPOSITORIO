import express from 'express';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';

const app = express();
const port = 8080;

// Middleware para parsear JSON
app.use(express.json());

// Routers
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});