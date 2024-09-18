import { Router } from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';


const router = Router();

const initializeCartRoutes = (io) => {
// Crear un nuevo carrito
router.post('/', async (req, res) => {
  try {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    io.emit('cartCreated', newCart);
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).send('Error creating cart');
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product');
    if (!cart) {
      return res.status(404).send('Carrito no encontrado');
    }

    // Calcular el total del carrito
    const cartTotal = cart.products.reduce((total, item) => total + item.product.price * item.quantity, 0);

    res.render('cart', { cart, cartTotal });
  } catch (error) {
    res.status(500).send('Error al obtener el carrito');
  }
});

router.post('/:cid/checkout', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product');
    if (!cart) {
      return res.status(404).send('Carrito no encontrado');
    }

    // Calcular el total
    const total = cart.products.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    // Crear la orden
    const order = new Order({
      user: req.body.userId, // Si tienes usuarios
      products: cart.products,
      total,
      status: 'Completado'
    });
    await order.save();

    // Vaciar el carrito
    cart.products = [];
    await cart.save();

    res.status(201).json({ message: 'Compra completada', order });
  } catch (error) {
    res.status(500).send('Error al finalizar la compra');
  }
});

// Agregar un producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).send('Cart not found');
    
    const product = await Product.findById(req.params.pid);
    if (!product) return res.status(404).send('Product not found');

    const productInCart = cart.products.find(p => p.product.toString() === req.params.pid);
    if (productInCart) {
      productInCart.quantity++;
    } else {
      cart.products.push({ product: req.params.pid, quantity: 1 });
    }
    
    await cart.save();
    io.emit('productAddedToCart', cart);
    res.json(cart);
  } catch (error) {
    res.status(500).send('Error adding product to cart');
  }
});

// Eliminar un producto de un carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).send('Cart not found');

    cart.products = cart.products.filter(p => p.product.toString() !== req.params.pid);
    await cart.save();
    io.emit('productRemovedFromCart', cart);
    res.status(204).send();
  } catch (error) {
    res.status(500).send('Error removing product from cart');
  }
});

// Actualizar carrito
router.put('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).send('Cart not found');

    cart.products = req.body.products;
    await cart.save();
    io.emit('cartUpdated', cart);
    res.json(cart);
  } catch (error) {
    res.status(500).send('Error updating cart');
  }
});

// Actualizar cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).send('Cart not found');

    const productInCart = cart.products.find(p => p.product.toString() === req.params.pid);
    if (!productInCart) return res.status(404).send('Product not found in cart');

    productInCart.quantity = quantity;
    await cart.save();
    io.emit('cartUpdated', cart);
    res.json(cart);
  } catch (error) {
    res.status(500).send('Error updating product quantity in cart');
  }
});

// Vaciar carrito
router.delete('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).send('Cart not found');

    cart.products = [];
    await cart.save();
    io.emit('cartCleared', cart);
    res.status(204).send();
  } catch (error) {
    res.status(500).send('Error clearing cart');
  }
});

return router;
};

export default initializeCartRoutes;
