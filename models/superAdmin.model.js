const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const users = require('../models/users.model');
const SuperAdminadminSchema = new Schema ({


    
});


module.exports= users.discriminator('SuperAdmin',SuperAdminadminSchema);