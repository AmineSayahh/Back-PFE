const { param } = require("../app");
const testModel = require("../models/test.model");
const enseignantModel = require("../models/enseignant.model");
const groupeModel = require("../models/groupe.model");
const { authController } = require("./auth.router");
const specialiteModel = require("../models/specialite.model");
const postModel = require("../models/post.model");
const ressourcesModel = require("../models/ressources.model");


const getTests = async (req, res) => {
    try {
        const tests = await testModel.find();
        res.send(tests);
        return tests
    } catch (error) {
        console.log(error);
    }
};
const getTestById = async (req, res) => {
    try {
        // Retrieve the user from the JWT token
        const token = req.headers.authorization.split(' ')[1]; // Extract the token from the Bearer header
        const user = authController.getUserFromToken(token); // Assume getUserFromToken function is implemented
        console.log(user)

        // Fetch tests from the database
        const tests = await testModel.find().lean();

        // Modify the tests array based on user type
        // const modifiedTests = tests.map(test => {
        //     // Check if user type is "Eleve"
        //     if (user && user.__t === 'admin') {
        //         console.log("first")
        //         // For Eleve users, create a new object without the isCorrect field
        //         const { isCorrect, ...rest } = test;
        //         return rest;
        //     } else {
        //         // For other user types, return the original test object
        //         return test;
        //     }
        // });

        // Modify the tests array based on user type
        const modifiedTests = tests.map(test => {
            // Loop through each reponse object and remove the isCorrect field
            const modifiedReponses = test.reponse.map(reponse => {
                if (user && user.__t === 'admin') {
                    return reponse
                }
                else {
                    const { isCorrect, ...rest } = reponse;
                    return rest;
                }
            });

            // Create a new object without the isCorrect field in the reponse array
            const modifiedTest = { ...test, reponse: modifiedReponses };
            return modifiedTest;
        });


        res.send(modifiedTests);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
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

const UpdateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { note } = req.body;

        // Validate input
        if (!note) {
            return res.status(400).send({ error: "Note is required" });
        }

        // Find the record by ID and update the note
        const response = await testModel.findByIdAndUpdate(
            id,
            { note: note },
            { new: true }  // This option returns the updated document
        );

        // Check if the record was found and updated
        if (!response) {
            return res.status(404).send({ error: "Record not found" });
        }

        return res.send(response);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
const findAllGroupe = async (req, res) => {
    try {
        console.log(req.params);
        const { id } = req.params;
        const enseignant = await enseignantModel.findById(id).exec();

        if (!enseignant) {
            return res.status(404).send({ message: 'Enseignant not found' });
        }
        const groupeIds = enseignant.enseigne.map(ens => ens.GroupeEns);
        const groupes = await groupeModel.find({ _id: { $in: groupeIds } }).exec();
        return res.send(groupes);
    } catch (error) {
        console.error('Error fetching groupes:', error);
        return res.status(500).send({ message: 'Internal Server Error' });
    }
};

const getSpecialite = async (req, res) => {
    try {
        console.log(req.params);
        const { id, groupeId } = req.params;
        const ens = await enseignantModel.findById(id).exec();
        
        if (!ens) {
            return res.status(404).send({ message: 'Enseignant not found' });
        }

        const specialiteIds = ens.enseigne.flatMap(ens => ens.specialite);

        const specialities = await specialiteModel.find({ 
            _id: { $in: specialiteIds },
            groupeId: groupeId
        }).exec();

        console.log(specialities);
        return res.send(specialities);
    } catch (error) {
        console.error('Error fetching specialities:', error);
        return res.status(500).send({ message: 'Internal Server Error' });
    }
};
const getPosts = async (req, res) => {
    try {
        console.log(req.params);
        const { id } = req.params;


        const posts = await postModel.find({ 
            user: id
        }).exec();

        return res.send(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return res.status(500).send({ message: 'Internal Server Error' });
    }
};
const addRessource = async (req, res) => {
    try {
        const ressource = await ressourcesModel.create(req.body);
        res.send(ressource);
    } catch (error) {
        console.log(error);
        return error;
    }
};
const getRessources = async (req, res) => {
    try {
        console.log(req.params);
        const { id,idMAt } = req.params;


        const ressources = await ressourcesModel.find({ 
            userId: id,
            matiereId: idMAt
        }).exec();

        return res.send(ressources);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return res.status(500).send({ message: 'Internal Server Error' });
    }
};
module.exports.enseignantController = {
    createTest,
    getTestById,
    getTests,
    UpdateNote,
    findAllGroupe,
    getSpecialite,
    getPosts,
    addRessource,
    getRessources
};