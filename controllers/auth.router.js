const { helpers } = require("../helpers/helpers");
const bcrypt =require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/users.model");


const Login = async (req, res) =>{
try{
    const exist = await helpers.checkUser(req.body.email);
    if(!exist){
        return res.status(404).send({message: "user not found"});
    }
    const isMatch = await bcrypt.compare(req.body.password, exist.password);
    if(!isMatch){
        return res.status(401).send({message: "password not matches"});
    }
    const payload = {
        id: exist._id,
        email: exist.email,
        __t: exist.__t,
    };
    console.log(payload)
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "1h",
    });
    

    return res.send({token: token, __t :payload.__t });
    
} catch (error){
    return helpers.customError(res, error);
}
};



const Logout = async (req, res) => {
    try {
      return res.send({ message: "Logout successful" });
    } catch (error) {
      // Handle errors
      return helpers.customError(res, error);
    }
  };

// Function to verify and decode JWT token
const getUserFromToken = async (token) => {
  try {
    console.log("🚀 ~ getUserFromToken ~ process.env.SECRET_KEY:", process.env.SECRET_KEY)
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("🚀 ~ getUserFromToken ~ decoded:", decoded)
    const user = await userModel.findById(decoded.id).lean();
    console.log("🚀 ~ getUserFromToken ~ user:", user)
    return user;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};


module.exports.authController = {
    Login,
    Logout,
    getUserFromToken
};