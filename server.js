const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const ProductRoutes = require('./routes/Product.Routes')
const BlogRoutes = require('./routes/Blog.Routes')
const UserRoutes = require('./routes/User.Routes')

app.use(cors({
  origin: 'https://bima-room.vercel.app', // Remplacez par l'URL de votre frontend
  credentials: true
}));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://bima-room.vercel.app'); // Remplacez par l'URL de votre frontend
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization,');

  next();
});
require('dotenv').config()


app.use(express.json());
// app.use(bodyParser.json());


const PORT = process.env.PORT

// Configurez la connexion à votre base de données MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connecté a la base de donnée');
  })
  .catch((error) => {
    console.error('Erreur lors de la connexion a la base donné:', error);
  });

  app.use('/api', ProductRoutes)
  app.use('/api', BlogRoutes)
  app.use('/api', UserRoutes)

// Démarrez votre serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port : http://localhost:${PORT}`);
});
