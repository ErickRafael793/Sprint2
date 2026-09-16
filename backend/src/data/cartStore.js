let cart = [];

function getItems() {
  return cart;
}

function addItem(product, quantity) {
  const existing = cart.find(
    (item) => item.product.id === product.id
  );

  if (existing) {
    existing.quantity += quantity;

    return {
      item: existing,
      wasUpdated: true
    };
  }

  const newItem = { product, quantity };
  cart.push(newItem);

  return {
    item: newItem,
    wasUpdated: false
  };
}

function updateQuantity(productId, quantity) {
  const item = cart.find(
    (item) => item.product.id === productId
  );

  if (!item) {
    return null;
  }

  item.quantity = quantity;
  return item;
}

function removeItem(productId) {
  const initialLength = cart.length;

  cart = cart.filter(
    (item) => item.product.id !== productId
  );

  return cart.length < initialLength;
}

module.exports = {
  getItems,
  addItem,
  updateQuantity,
  removeItem
};