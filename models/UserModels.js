  // Importez les dépendances nécessaires
  const mongoose = require('mongoose');

  // Définissez le schéma pour l'utilisateur
  const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  });

  // Créez le modèle d'utilisateur à partir du schéma
  const User = mongoose.model('User', userSchema);

  // Exportez le modèle
  module.exports = User;
