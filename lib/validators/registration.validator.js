const Joi = require('joi');
const schemaValidation = Joi.object({
    nom: Joi.string().required(),
    prenom: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string(),
    repeat_password: Joi.ref('password'),

}).with('password', 'repeat_password');




module.exports.registerValidation = {
    schemaValidation,
};
