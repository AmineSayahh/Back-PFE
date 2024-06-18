const mongoose = require('mongoose')
const Schema = mongoose.Schema
const espaceDeCourssSchema = new Schema({
    Titre: {
        type: String,
        required: true
    },
  TypeDeCours: {
        type: String,
        required: true
    },
    // Contenu: {
    //     type: String,
    //     required: true
    // },
    DateDeDepotDeCours: {
        type: Date,
        required: true
    },
    
    idEnseignant: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Enseignant'
    },



    idGroupe:{
        type:String,
        required:true
    },
    idMatiere:{
        type:String,
        required:true
    },
    Enseignant: {
        nom: {
            type: String,
            required: true
        },
        prenom: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        statut: {
            type: String,
            required: true
        },

    },
    Groupe:{
        NomDeGroupe: {
            type: String,
            required: false
        }},
        Files: {
            type:String,
            required:false
        }
       
});

module.exports.EspaceDeCoursModel = mongoose.model("EspaceDeCours", espaceDeCourssSchema);