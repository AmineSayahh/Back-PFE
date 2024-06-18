const adminModel = require("../models/admin.model");
const bcrypt = require("bcryptjs");
const { adminValidation } = require("../lib/validators/admin.validator");
const { helpers } = require("../helpers/helpers");

const createAdmin = async (req, res) => {
    try {
        const values = await adminValidation.schemaValidation.validateAsync(
            req.body
            );
        const exist = await helpers.checkUser(req.body.email);
        if (exist){
            return res.status(409).send({message : "user exist"});
        }
        const hash = await bcrypt.hash(req.body.password, 10);
        req.body.password = hash;
        const user = await adminModel.create(req.body);
        res.status(200).send({data:user,message : "admin created successfully"});
    } catch (error) {
        console.log(error);
        return helpers.customError(res, error);
    }
};

const getAdmin = async (req, res) => {
    try {
       
        const admin = await adminModel.find();
        res.send(admin);
    } catch (error) {
        console.log(error);
    }
};

const updateAdmin = async (req, res) => {
    try{
        const admins = await adminModel.findByIdAndUpdate({_id: req.params.id});
        return res.send("update successfully")
    } catch (error){
        console.log(error);
        return helpers.customError(res, error);
    }

};

const deleteAdmin = async (req, res) => {
    try{
        const admins = await adminModel.deleteOne({_id: req.params.id});
    return res.send("deleted successfully");
    } catch (error){
        console.log(error);
        return helpers.customError(res, error);
    }
};



module.exports.superAdminController = {
    createAdmin,
    getAdmin,
    updateAdmin,
    deleteAdmin
};