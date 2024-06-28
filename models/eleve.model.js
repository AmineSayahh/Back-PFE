const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const users = require('./users.model');

const eleveSchema = new Schema({
    matricule: {
        type: String,
        required: false,
    },
    niveau: {
        type: String,
        required: false
    },
    idGroupe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Groupe'
    }

});


module.exports = users.discriminator('Eleve', eleveSchema);