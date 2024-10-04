import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import Product from '../models/Product.js';

const router = Router();

const initializeProductRoutes = (io) => {

router.get('/', async (req, res) => {
  try {
    const products = await Product.find(); 
    console.log(products); 

    res.render('home', { products }); 
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).send('Error retrieving products');
  }
});

router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort = '', query = '' } = req.query;

    let sortOption = {};
    if (sort === 'asc') {
      sortOption = { price: 1 };  
    } else if (sort === 'desc') {
      sortOption = { price: -1 }; 
    }

    const queryOptions = query ? { $or: [{ category: query }, { status: query === 'true' }] } : {};

    const products = await Product.find(queryOptions)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    
      console.log(products);
      
    const totalProducts = await Product.countDocuments(queryOptions);
    const totalPages = Math.ceil(totalProducts / limit);

  

    res.render('home', {
      products,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null
    });
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).send('Error retrieving products');
  }
});


router.put('/:pid', (req, res) => {
const product = product.find(p => p.id === parseInt(req.params.pid));
if (product) {
Object.assign(product, req.body);
fs.writeFileSync(path.join(__dirname, '..', 'data', 'products.json'), JSON.stringify(products, null, 2));
io.emit('productUpdated', product);
res.json(product);
} else {
res.status(404).send('Product not found');
}
});


router.delete('/:pid', (req, res) => {
const index = Product.findIndex(p => p.id === parseInt(req.params.pid));
if (index !== -1) {
const deletedProduct = Product.splice(index, 1)[0];
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