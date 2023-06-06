const express = require("express");
const router = express.Router();
const BlogController = require("../controllers/BlogController");
const Authorization = require("../middlewares/auth");


router.get("/posts", Authorization, BlogController.getAllBlogPost);

// Récupérer un article de blog par son identifiant

router.get("/posts/:id", Authorization, BlogController.getBlogPostById);

// Créer un nouvel article de blog

router.post("/posts", Authorization, BlogController.createNewBlogPost);

router.put("/posts/:id", Authorization, BlogController.updateBlogPostById);

router.delete("/posts/:id", Authorization, BlogController.deleteBlogPostById);

module.exports = router;
