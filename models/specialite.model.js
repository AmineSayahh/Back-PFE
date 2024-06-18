const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const specialiteSchema = new Schema ({


nom:{
    type:String,
    required:false
},



});


module.exports=mongoose.model('Specialite',specialiteSchema);