const testModel = require("../models/test.model");
const { authController } = require("./auth.router");


const getTests = async (req,res) => {
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



module.exports.enseignantController = {
    createTest,
    getTestById,
    getTests,
    UpdateNote
};