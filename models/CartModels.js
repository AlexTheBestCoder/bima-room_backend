const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  cartId: { type: String, required: true },
  items: [
    {
      title: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true },
      category: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
