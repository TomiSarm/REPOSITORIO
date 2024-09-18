import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import Product from '../models/Product.js';

const router = Router();

const initializeViewRoutes = (io) => {
  // Ruta para renderizar la página principal con productos desde MongoDB
  router.get('/', async (req, res) => {
    try {
      const products = await Product.find(); // Obtener los productos desde MongoDB
      res.render('home', { products }); // Renderizar la vista con los productos
    } catch (error) {
      console.error('Error al recuperar los productos:', error);
      res.status(500).send('Error al recuperar los productos');
    }
  });

  router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products });
  });

  io.on('connection', (socket) => {
    console.log('New client connected');
    socket.emit('initialize', products);

    socket.on('createProduct', (data) => {
      const { title, description, code, price, status = true, stock, category, thumbnails = [] } = data;
      const newProduct = {
        id: products.length ? products[products.length - 1].id + 1 : 1,
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
      fs.writeFileSync(path.join(__dirname, '..', 'data', 'products.json'), JSON.stringify(products, null, 2));
      io.emit('productAdded', newProduct);
    });

    socket.on('deleteProduct', (id) => {
      const index = products.findIndex((p) => p.id === id);
      if (index !== -1) {
        const deletedProduct = products.splice(index, 1)[0];
        fs.writeFileSync(path.join(__dirname, '..', 'data', 'products.json'), JSON.stringify(products, null, 2));
        io.emit('productDeleted', deletedProduct);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return router;
};

export default initializeViewRoutes;