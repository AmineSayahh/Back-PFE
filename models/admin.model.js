const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const users = require('../models/users.model');
const adminSchema = new Schema ({


    
});


module.exports= users.discriminator('admin',adminSchema);