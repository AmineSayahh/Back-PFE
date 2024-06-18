const UserModel = require("../models/users.model");

const checkUser = async (email) =>{
    const exist = await UserModel.findOne({email: email});
    return exist;
};


const customError = (res, err) =>{
    return res.status(500).send({mesaage: process.env.NODE_ENV == "development" ? err : "server err",
});
};

module.exports.helpers ={
    checkUser,
    customError
};