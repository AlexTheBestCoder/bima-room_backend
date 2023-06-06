const Product = require('../models/ProductModels');

exports.createNewProduct = (req, res) => {
  const { title, price, image, category } = req.body;

 // Vérifier si l'ID de l'utilisateur est présent et valide
 if (!req.auth || !req.auth.userId) { // Utilisez req.auth.userId
  return res.status(401).json({ message: 'Utilisateur non authentifié' });
}

const userId = req.auth.userId; // Utilisez req.auth.userId

  // Créer une instance du modèle Product avec les données fournies et l'ID de l'utilisateur
  const newProduct = new Product({
    title,
    price,
    image,
    category,
    userId, // Associer l'ID de l'utilisateur au produit
  });

  // Enregistrer le nouveau produit dans la base de données
  newProduct
    .save()
    .then((product) => {
      // Effectuer la population pour récupérer les détails de l'utilisateur
      return Product.populate(product, { path: 'userId' });
    })
    .then((populatedProduct) => {
      res.status(201).json(populatedProduct);
    })
    .catch((error) => {
      res.status(500).json({ message: 'Erreur lors de la création du produit', error });
    });
};

exports.getAllProducts = async (req, res) => {
  try {
    // Vérifier si l'ID de l'utilisateur est présent et valide
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    // Récupérer tous les produits associés à l'utilisateur authentifié depuis la base de données
    const userId = req.auth.userId;
    const cart = await Product.findOne({ userId });

    if (!cart) {
      return res.status(200).json([]); // Aucun produit dans le panier
    }

    // Récupérer les produits du panier en utilisant l'ID de l'utilisateur
    const products = await Product.find({ userId });

    // Ajouter la propriété totalPrice à chaque produit
    const cartProducts = products.map((product) => {
      const totalPrice = parseFloat(product.price) * parseInt(product.quantity);

      return { ...product.toObject(), totalPrice };
    });

    res.status(200).json(cartProducts);
  } catch (error) {
    console.log('Erreur lors de la récupération des produits du panier', error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la récupération des produits du panier",
    });
  }
};




exports.getProductById = (req, res) => {
  const productId = req.params.id;

  // Vérifier si l'ID de l'utilisateur est présent et valide
  if (!req.auth || !req.auth.userId) {
    return res.status(401).json({ message: 'Utilisateur non authentifié' });
  }

  // Utiliser l'ID de l'utilisateur pour rechercher le produit dans la base de données
  const userId = req.auth.userId;
  Product.findOne({ _id: productId, userId })
    .then((product) => {
      if (!product) {
        return res.status(404).json({ message: 'Produit non trouvé' });
      }

      res.json(product);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération du produit", error });
    });
};

exports.updateProductById = (req, res) => {
  const { quantity } = req.body;
  const productId = req.params.id;

  // ...
  // Rechercher le produit dans la base de données en utilisant l'ID de l'utilisateur
  const userId = req.auth.userId;
  Product.findOne({ _id: productId, userId })
    .then((product) => {
      if (!product) {
        return res.status(404).json({ message: 'Produit non trouvé' });
      }

      product.quantity = quantity;

      return product.save();
    })
    .then((updatedProduct) => {
      res.json(updatedProduct);
    })
    .catch((error) => {
      res.status(500).json({ message: 'Erreur lors de la mise à jour du produit', error });
    });
};


exports.deleteProductById = (req, res) => {
  const productId = req.params.id;

  // Vérifier si l'ID de l'utilisateur est présent et valide
  if (!req.auth || !req.auth.userId) {
    return res.status(401).json({ message: 'Utilisateur non authentifié' });
  }

  // Rechercher le produit dans la base de données en utilisant l'ID de l'utilisateur
  const userId = req.auth.userId;
  Product.findOneAndDelete({ _id: productId, userId })
    .then((deletedProduct) => {
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Produit non trouvé' });
      }

      res.json({ message: 'Produit supprimé avec succès' });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: 'Erreur lors de la suppression du produit', error });
    });
};
