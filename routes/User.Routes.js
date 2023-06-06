const express = require('express')
const router = express.Router()
const UserController = require("../controllers/UserController");

// Route pour s'inscrire
router.post("/register", UserController.userRegister);

// Route pour se connecter
router.post("/login", UserController.userLogin);

module.exports = router;