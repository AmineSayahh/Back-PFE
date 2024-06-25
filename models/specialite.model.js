const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const specialiteSchema = new Schema ({


nom:{
    type:String,
    required:false
},
groupeId: [{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Groupe'
}],

});


module.exports=mongoose.model('Specialite',specialiteSchema);