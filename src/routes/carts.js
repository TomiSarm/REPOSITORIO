import { Router } from 'express';

const router = Router();
const carts = [];
let nextCartId = 1;

// Crear un nuevo carrito
router.post('/', (req, res) => {
  const newCart = {
    id: nextCartId++,
    products: []
  };
  carts.push(newCart);
  res.status(201).json(newCart);
});

// Listar los productos de un carrito
router.get('/:cid', (req, res) => {
  const cart = carts.find(c => c.id === parseInt(req.params.cid));
  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).send('Cart not found');
  }
});

// Agregar un producto a un carrito
router.post('/:cid/product/:pid', (req, res) => {
  const cart = carts.find(c => c.id === parseInt(req.params.cid));
  if (!cart) {
    return res.status(404).send('Cart not found');
  }

  const productId = parseInt(req.params.pid);
  const productInCart = cart.products.find(p => p.product === productId);

  if (productInCart) {
    productInCart.quantity++;
  } else {
    cart.products.push({ product: productId, quantity: 1 });
  }

  res.json(cart);
});

export default router;