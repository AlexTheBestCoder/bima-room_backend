const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log("Token extrait :", token); // Ajoutez ce console.log
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userId = decodedToken.user_id; // Utilisez decodedToken.user_id
    console.log("ID utilisateur extrait :", userId); // Ajoutez ce console.log
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    console.error("Erreur d'authentification :", error); // Ajoutez ce console.log
    res.status(401).json({ error });
  }
};
