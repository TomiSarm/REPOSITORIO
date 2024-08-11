import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import Product from '../models/Product.js';

const router = Router();

const initializeProductRoutes = (io) => {
// Listar todos los productos
// Listar productos con paginación, filtros y ordenamiento
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort = '', query = '' } = req.query;
    const sortOption = sort === 'asc' ? 'price' : (sort === 'desc' ? '-price' : '');
    const queryOptions = query ? { $or: [{ category: query }, { status: query === 'true' }] } : {};
    
    const products = await Product.find(queryOptions)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    
    const totalProducts = await Product.countDocuments(queryOptions);
    const totalPages = Math.ceil(totalProducts / limit);
    
    res.json({
      status: 'success',
      payload: products,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page: Number(page),
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
      nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null
    });
  } catch (error) {
    res.status(500).send('Error retrieving products');
  }
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