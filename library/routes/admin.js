const express = require('express');
const mongoose = require('mongoose');
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');
const router = express.Router();  // Correctement définir l'objet router

// URL de connexion à MongoDB
const mongoURI = process.env.MONGODB_URI;

// Configuration du stockage GridFS
const storage = new GridFsStorage({
    url: mongoURI,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        return {
            filename: file.originalname,  // Nom du fichier original
            bucketName: 'books'  // Nom du bucket pour stocker les fichiers dans GridFS
        };
    }
});

// Configuration de multer pour l'upload des fichiers PDF
const upload = multer({ storage });

// Route pour afficher la page admin
router.get('/', (req, res) => {
    res.render('admin');  // Rendre le fichier views/admin.ejs
});

// Route pour télécharger un fichier PDF (upload)
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Aucun fichier sélectionné');
    }
    res.status(200).send('Fichier téléchargé avec succès');
});

module.exports = router;
