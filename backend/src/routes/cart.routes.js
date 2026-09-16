const express = require('express');
const cartStore = require('../data/cartStore');

const router = express.Router();

// GET /carts
router.get('/', (req, res) => {
  res.json(cartStore.getItems());
});

// POST /carts
router.post('/', (req, res) => {
  const { product, quantity } = req.body;

  if (!product || !quantity) {
    return res.status(400).json({
      error: 'product y quantity son requeridos'
    });
  }

  const result = cartStore.addItem(product, quantity);
  res.status(201).json(result);
});

// PUT /carts/:productId
router.put('/:productId', (req, res) => {
  const productId = Number(req.params.productId);
  const { quantity } = req.body;

  const updated = cartStore.updateQuantity(productId, quantity);

  if (!updated) {
    return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
  }

  res.json(updated);
});

// DELETE /carts/:productId
router.delete('/:productId', (req, res) => {
  const productId = Number(req.params.productId);

  const removed = cartStore.removeItem(productId);

  if (!removed) {
    return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
  }

  res.json({ success: true });
});

module.exports = router;