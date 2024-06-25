const { enseignantValidation } = require("../lib/validators/enseignant.validator");
const { helpers } = require("../helpers/helpers");
const bcrypt = require("bcryptjs");
const specialiteModel = require("../models/specialite.model");
const testModel = require("../models/test.model");
const enseignantModel = require("../models/enseignant.model");


const createEnseignant = async (req, res) => {
    try {
        const values = await enseignantValidation.schemaValidation.validateAsync(
            req.body
            );
        const exist = await helpers.checkUser(req.body.email);
        if (exist){
            return res.status(409).send({message : "user exist"});
        }
        const hash = await bcrypt.hash(req.body.password, 10);
        req.body.password = hash;
        const user = await enseignantModel.create(req.body);
        res.send(user);
    } catch (error) {
        console.log(error);
        return helpers.customError(res, error);
    }
};

const FindAllEnseignant = async (req, res) => {
    console.log(req.user);
    try {
      const users = await enseignantModel.find().select("-password");
      return res.send(users);
    } catch (error) {
      console.log(error);
      return helpers.customError(res, error);
    }
  };
  

const updateEnseignant = async (req, res) => {
    try{
        const admins = await enseignantModel.findByIdAndUpdate({_id: req.params.id});
        return res.send("update successfully")
    } catch (error){
        console.log(error);
        return helpers.customError(res, error);
    }

};

const deleteEnseignant = async (req, res) => {
    try{
        const enseignant = await enseignantModel.deleteOne({_id: req.params.id});
    return res.send("deleted successfully");
    } catch (error){
        console.log(error);
        return helpers.customError(res, error);
    }
};

const createSpecialite = async (req, res) => {
    try {
        const specialite = await specialiteModel.create(req.body);
        res.send(specialite);
    } catch (error) {
        console.log(error);
        return helpers.customError(res, error);
    }
};

const getSpecialites = async (req, res) => {
    try {
        const groupeId = req.params.groupeId; 

        const specialites = await specialiteModel.find({ groupeId: groupeId });

        res.send(specialites);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const getTests = async (req,res) => {
    try {
        const tests = await testModel.find();
        res.send(tests);
        return tests
    } catch (error) {
        console.log(error);
    }
};


const createTest = async (req, res) => {
    try {
        const model = req.body.model;
        const specialiteId = req.body.specialite;

        const tests = [];

        for (const item of model) {
            const { question, reponse } = item;

            const formattedReponse = Object.entries(reponse).map(([option, isCorrect]) => ({
                option,
                isCorrect
            }));

            const test = await testModel.create({
                question,
                reponse: formattedReponse,
                specialite: specialiteId
            });

            tests.push(test);
        }

        res.json(tests);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};



module.exports.adminController = {
    createEnseignant,
    updateEnseignant,
    deleteEnseignant,
    createSpecialite,
    FindAllEnseignant,
    getSpecialites,
    createTest,
    getTests
};