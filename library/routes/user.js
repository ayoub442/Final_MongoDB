const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Book = require('../models/Book');
const Grid = require('gridfs-stream');

// Connexion à la base de données pour GridFS
const conn = mongoose.createConnection(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
let gfs;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');  // Utilisation de la collection par défaut 'uploads' pour stocker les fichiers
});

// Page d'accueil des livres (affiche tous les livres)
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();  // Récupérer tous les livres
        res.render('user', { books });  // Rendre la vue 'user.ejs' avec la liste des livres
    } catch (err) {
        res.status(500).send('Erreur lors de la récupération des livres.');
    }
});

// Télécharger un livre par ID
router.get('/download/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (book) {
            // Vérifier si le fichier PDF existe dans GridFS
            gfs.files.findOne({ _id: book.pdfId }, (err, file) => {
                if (!file || file.length === 0) {
                    return res.status(404).send('Fichier non trouvé');
                }
                
                // Créer un flux de lecture et envoyer le fichier au client
                const readstream = gfs.createReadStream({ _id: book.pdfId });
                readstream.pipe(res);
            });
        } else {
            res.status(404).send('Livre non trouvé');
        }
    } catch (err) {
        res.status(500).send('Erreur lors de la récupération du livre.');
    }
});

module.exports = router;
