const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const users = require('./users.model');

const eleveSchema = new Schema ({
matricule:{
    type:String,
    required:false,
    unique:true
},

niveau:{
    type:String,
    required:false
},


idGroupe:{
    type:String,
    required:false
}

});


module.exports = users.discriminator('Eleve',eleveSchema);