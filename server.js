const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const ProductRoutes = require("./routes/Product.Routes");
const BlogRoutes = require("./routes/Blog.Routes");
const UserRoutes = require("./routes/User.Routes");
const CartRoutes = require("./routes/Cart.Routes");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const Cart = require("./models/CartModels");

app.use(
  cors({
    origin: "https://bima-room.vercel.app", // Remplacez par l'URL de votre frontend
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://bima-room.vercel.app"); // Remplacez par l'URL de votre frontend
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization,");

  next();
});

app.use(cookieParser());

app.use(express.json());
// app.use(bodyParser.json());

const PORT = process.env.PORT;

// Configurez la connexion à votre base de données MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connecté a la base de donnée");
  })
  .catch((error) => {
    console.error("Erreur lors de la connexion a la base donné:", error);
  });

app.use("/api", ProductRoutes);
app.use("/api", BlogRoutes);
app.use("/api", UserRoutes);
app.use("/api/cart", CartRoutes);

const mailgun = require("mailgun-js");

// Gestion de la messagerie par email

const API_KEY = process.env.API_KEY_MAILGUN;
const DOMAIN_NAME = process.env.DOMAIN_NAME_MAILGUN;

const mg = mailgun({
  apiKey: API_KEY,
  domain: DOMAIN_NAME,
});

app.head("/", (req, res) => {
  res.status(200).end();
});

app.post("/api/contact", (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;

  const data = {
    from: email,
    to: "alexcoding225@gmail.com", // Remplacez par votre adresse e-mail où vous souhaitez recevoir les messages de contact
    subject: `${subject}`,
    text: `Message de ${firstName} ${lastName} :\n\n${message}`,
  };

  mg.messages().send(data, (error, body) => {
    if (error) {
      console.error("Error sending email:", error);
      res
        .status(500)
        .json({ message: "An error occurred while sending the email." });
    } else {
      res.sendStatus(200);
    }
  });
});

const uuid = require("uuid");

// Utiliser cookie-parser pour parser les cookies
app.use(cookieParser());

// Stocker l'identifiant unique du panier dans un cookie

// Exemple de requête POST pour ajouter un produit au panier
app.post("/api/cart", async (req, res) => {
  try {
    let cartId = req.body.cartId; // Récupérer l'identifiant du panier à partir du corps de la requête

    // Vérifiez si le CartID existe dans le localStorage
    if (!cartId) {
      // Générez un nouvel identifiant de panier
      cartId = uuid.v4();
    }

    // Récupérez les détails du produit à ajouter depuis la requête
    const { title, price, image, category, quantity } = req.body;

    // Recherchez si un panier existe déjà avec le même CartID
    let cart = await Cart.findOne({ cartId });

    if (!cart) {
      // Si aucun panier n'existe, créez un nouveau panier avec le CartID
      cart = new Cart({ cartId, items: [] });
    }

    // Recherchez si le produit existe déjà dans le panier
    const existingItem = cart.items.find(
      (item) =>
        item.title === title &&
        item.price === price &&
        item.image === image &&
        item.category === category
    );

    if (existingItem) {
      // Si le produit existe déjà, mettez à jour la quantité
      existingItem.quantity += quantity;
    } else {
      // Sinon, ajoutez le produit au panier
      cart.items.push({ title, price, image, category, quantity });
    }

    // Sauvegardez le panier dans la base de données
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/cart/:cartId", async (req, res) => {
  try {
    const cartId = req.params.cartId; // Récupérer l'identifiant du panier depuis les paramètres de la requête

    // Recherchez les éléments du panier correspondant à l'identifiant
    const cartItems = await Cart.findOne({ cartId });

    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Méthode de modification de la quantité d'un élément dans le panier
app.put("/api/cart/:cartId/:itemId", async (req, res) => {
  try {
    const cartId = req.params.cartId; // Récupérer l'identifiant du panier depuis les paramètres de la requête
    const itemId = req.params.itemId; // Récupérer l'identifiant de l'élément depuis les paramètres de la requête
    const { quantity } = req.body; // Récupérer la nouvelle quantité depuis le corps de la requête

    // Recherchez le panier correspondant à l'identifiant
    const cart = await Cart.findOne({ cartId });

    if (!cart) {
      return res.status(404).json({ error: "Panier introuvable" });
    }

    // Recherchez l'élément dans le panier
    const item = cart.items.find((item) => item._id.toString() === itemId);

    if (!item) {
      return res.status(404).json({ error: "Élément introuvable" });
    }

    // Mettez à jour la quantité de l'élément
    item.quantity = quantity;

    // Sauvegardez le panier mis à jour dans la base de données
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Méthode de suppression d'un élément du panier
app.delete("/api/cart/:cartId/:itemId", async (req, res) => {
  try {
    const cartId = req.params.cartId; // Récupérer l'identifiant du panier depuis les paramètres de la requête
    const itemId = req.params.itemId; // Récupérer l'identifiant de l'élément depuis les paramètres de la requête

    // Recherchez le panier correspondant à l'identifiant
    const cart = await Cart.findOne({ cartId });

    if (!cart) {
      return res.status(404).json({ error: "Panier introuvable" });
    }

    // Recherchez l'indice de l'élément dans le panier
    const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Élément introuvable" });
    }

    // Supprimez l'élément du panier
    cart.items.splice(itemIndex, 1);

    // Sauvegardez le panier mis à jour dans la base de données
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Démarrez votre serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port : http://localhost:${PORT}`);
});
