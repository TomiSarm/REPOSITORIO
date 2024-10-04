router.post('/:cid/purchase', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        if (!cart) return res.status(404).send('Carrito no encontrado');

        const productsWithStock = [];
        const productsOutOfStock = [];
        let total = 0;

        for (const item of cart.products) {
            const product = item.product;
            if (product.stock >= item.quantity) {
                total += product.price * item.quantity;
                product.stock -= item.quantity;
                await product.save();
                productsWithStock.push(item);
            } else {
                productsOutOfStock.push(product.title);
            }
        }

        if (productsOutOfStock.length > 0) {
            return res.status(400).json({ message: 'Algunos productos no tienen stock suficiente', productsOutOfStock });
        }

        const ticket = new Ticket({
            code: `T-${Date.now()}`,
            amount: total,
            purchaser: req.user.email
        });

        await ticket.save();
        cart.products = [];
        await cart.save();

        res.status(201).json({ message: 'Compra completada', ticket });
    } catch (error) {
        res.status(500).send('Error al finalizar la compra');
    }
});
