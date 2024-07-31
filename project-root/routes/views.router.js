import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

const initializeViewRoutes = (io, products) => {
  router.get('/', (req, res) => {
    res.render('home', { products });
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
      const index = products.findIndex(p => p.id === id);
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