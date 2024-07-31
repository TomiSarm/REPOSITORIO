import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();
let nextId = 1;

const initializeProductRoutes = (io, products) => {
  // Listar todos los productos
  router.get('/', (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
    res.json(products.slice(0, limit));
  });

  // Obtener un producto por id
  router.get('/:pid', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.pid));
    if (product) {
      res.json(product);
    } else {
      res.status(404).send('Product not found');
    }
  });

  // Agregar un nuevo producto
  router.post('/', (req, res) => {
    const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;
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
    fs.writeFileSync(path.join(__dirname, '..', 'data', 'products.json'), JSON.stringify(products, null, 2));
    io.emit('productAdded', newProduct);
    res.status(201).json(newProduct);
  });

  // Actualizar un producto
  router.put('/:pid', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.pid));
    if (product) {
      Object.assign(product, req.body);
      fs.writeFileSync(path.join(__dirname, '..', 'data', 'products.json'), JSON.stringify(products, null, 2));
      io.emit('productUpdated', product);
      res.json(product);
    } else {
      res.status(404).send('Product not found');
    }
  });

  // Eliminar un producto
  router.delete('/:pid', (req, res) => {
    const index = products.findIndex(p => p.id === parseInt(req.params.pid));
    if (index !== -1) {
      const deletedProduct = products.splice(index, 1)[0];
      fs.writeFileSync(path.join(__dirname, '..', 'data', 'products.json'), JSON.stringify(products, null, 2));
      io.emit('productDeleted', deletedProduct);
      res.status(204).send();
    } else {
      res.status(404).send('Product not found');
    }
  });

  return router;
};

export default initializeProductRoutes;