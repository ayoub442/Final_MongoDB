const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

const app = express();

// Configuration du moteur de rendu EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware pour parser le corps des requêtes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());  // Pour les requêtes avec JSON

// Configuration des sessions avec MongoDB
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: 'sessions'  // Collection MongoDB pour stocker les sessions
    })
}));

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connecté avec succès'))
    .catch(err => {
        console.error('Erreur de connexion à MongoDB :', err.message);
        process.exit(1);  // Arrête l'application en cas d'échec de connexion
    });

// Importation des routes
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.render('index');  // Affiche la page index.ejs
});

// Routes pour l'espace admin et utilisateur
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

// Gestion des routes non définies (404)
app.use((req, res) => {
    res.status(404).render('404', { url: req.originalUrl });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Le serveur tourne sur http://localhost:${PORT}`);
});
