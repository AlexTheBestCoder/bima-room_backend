const Post = require('../models/BlogModels')

exports.getAllBlogPost = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de la récupération des articles.",
    });
  }
};

exports.getBlogPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Article non trouvé" });
    }

    res.json({ post });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de la récupération de l'article.",
    });
  }
};

exports.createNewBlogPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Créer une nouvelle instance de l'article
    const newPost = new Post({
      title,
      content,
    });

    // Enregistrer l'article dans la base de données
    const savedPost = await newPost.save();

    res.json({ post: savedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la création de l'article.",
    });
  }
};

exports.updateBlogPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content } = req.body;

    // Rechercher l'article par son identifiant et le mettre à jour
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, content },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "L'article n'a pas été trouvé." });
    }

    res.json({ post: updatedPost });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message:
          "Une erreur s'est produite lors de la mise à jour de l'article.",
      });
  }
};

exports.deleteBlogPostById = async (req, res) => {
  try {
    const postId = req.params.id;

    // Rechercher l'article par son identifiant et le supprimer
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: "L'article n'a pas été trouvé." });
    }

    res.json({ message: "L'article a été supprimé avec succès." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message:
          "Une erreur s'est produite lors de la suppression de l'article.",
      });
  }
};
