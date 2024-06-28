const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const users = require('./users.model');

const enseignantSchema = new Schema({

    enseigne: [{
        specialite: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Specialite'
        }],
        GroupeEns: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Groupe'
        },
    }
    ],
    Publication: [{
        DateDeCreation: {
            type: String,
            required: false
        },

        Contenu: {
            type: String,
            required: false
        },

    }],
    // Activites:
    // [{
    // DateDeCreation:{
    //     type: String,
    //     required: false
    // },

    // URLActivite: {
    //     type: String,
    //     required: false 
    // },
    // nom: {
    //     type: String,
    //     required: true 
    // },   
    //  Files: [{
    //         type:String,
    //         required:false
    //     }],

    // GroupeMatiere:[{
    //     idGroupe: {
    //         type: String,
    //         required: false
    //     },
    //   idMatiere: {
    //         type: String,
    //         required: false
    //     },

    // }],



});


module.exports = users.discriminator('Enseignant', enseignantSchema);
