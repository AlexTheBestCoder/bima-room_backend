const Product = require('../models/ProductModels');

exports.createNewProduct = (req, res) => {
  const { title, price, image, category } = req.body;

  // Créer une instance du modèle Product avec les données fournies
  const newProduct = new Product({
    title,
    price,
    image,
    category,
  });

  // Enregistrer le nouveau produit dans la base de données
  newProduct
    .save()
    .then((product) => {
      res.status(201).json(product);
    })
    .catch((error) => {
      res.status(500).json({ message: 'Erreur lors de la création du produit', error });
    });
};

exports.getAllProducts = (req, res) => {
  // Récupérer tous les produits depuis la base de données
  Product.find()
    .then((products) => {
      res.status(200).json(products);
    })
    .catch((error) => {
      res.status(500).json({ message: 'Erreur lors de la récupération des produits', error });
    });
};

exports.getProductById = (req, res) => {
  const productId = req.params.id;

  // Utiliser l'ID du produit pour rechercher le produit dans la base de données
  Product.findById(productId)
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

  // Rechercher le produit dans la base de données en utilisant l'ID du produit
  Product.findById(productId)
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

  // Supprimer le produit de la base de données en utilisant l'ID du produit
  Product.findByIdAndDelete(productId)
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
