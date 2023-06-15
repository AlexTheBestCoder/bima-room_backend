// routes/cart.js
const express = require("express");
const router = express.Router();
const CartItem = require("../models/CartItemsModels");

const generateCartId = () => {
  // Génère un identifiant unique
  const timestamp = Date.now().toString(36); // Convertit le timestamp en base 36
  const randomString = Math.random().toString(36).substring(2, 15); // Génère une chaîne de caractères aléatoire
  const cartId = timestamp + randomString; // Concatène le timestamp et la chaîne aléatoire

  return cartId;
};

// Ajouter un produit au panier
router.post("/add", async (req, res) => {
  const { title, price, image, category } = req.body;
  let cartId = req.cookies.cartId; // Récupère l'identifiant du panier depuis les cookies

  if (!cartId) {
    // Si l'identifiant du panier n'est pas déjà stocké dans les cookies, générez un nouvel identifiant
    cartId = generateCartId();
    res.cookie("cartId", cartId, { maxAge: 86400000 }); // Stocke l'identifiant du panier dans les cookies pendant 24 heures (en millisecondes)
  }

  try {
    const cartItem = new CartItem({
      cartId,
      title,
      price,
      image,
      category,
    });

    await cartItem.save();
    res.status(201).json(cartItem);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de l'ajout du produit au panier", error });
  }
});

// Récupérer les produits du panier
router.get("/", async (req, res) => {
  const cartId = req.cookies.cartId;

  try {
    const cartItems = await CartItem.find({ cartId });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des produits du panier",
      error,
    });
  }
});

module.exports = router;
