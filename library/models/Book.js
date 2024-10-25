const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    pdfId: { type: mongoose.Schema.Types.ObjectId, required: true } // Stocke l'ID du fichier dans GridFS
});

module.exports = mongoose.model('Book', BookSchema);
