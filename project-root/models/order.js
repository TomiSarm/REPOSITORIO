import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number
  }],
  total: Number,
  status: { type: String, default: 'Pendiente' }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;