const testModel = require("../models/test.model");
const { authController } = require("./auth.router");
const groupeModel = require("../models/groupe.model");
const usersModel = require("../models/users.model");
const eleveModel = require("../models/eleve.model");
const userEval = require("../models/userEval.model");
const enseignantModel = require("../models/enseignant.model");
const ressourcesModel = require("../models/ressources.model");

const getUserEvalByUserId = async (req, res) => {
  try {
    const user = await userEval.findOne({ userId: req.params.userId }).exec();
    console.log(user)
    if (user) {
      res.send(true);
    } else {
      res.send(false)
    }
  } catch (error) {
    console.log(error);
  }
};

const getTestById = async (req, res) => {
  try {
    // Retrieve the user from the JWT token
    const { userId } = req.params;
    const user = usersModel.findOne({ _id: userId })

    // Fetch tests from the database based on specialite
    const specialiteId = req.params.specialiteId; // Assuming specialiteId is passed in the request parameters
    const tests = await testModel.find({ specialite: specialiteId }).lean();

    // Modify the tests array based on user type
    const modifiedTests = tests.map((test) => {
      // Loop through each reponse object and remove the isCorrect field
      const modifiedReponses = test.reponse.map((reponse) => {
        if (user && user.__t !== "Eleve") {
          return reponse;
        } else {
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

const getTestScore = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(req.params)
    const user = await eleveModel.findById(userId).exec();
    console.log(user);
    if (!user || user.__t !== "Eleve") {
      return res
        .status(403)
        .send("Forbidden: Only students can submit test responses");
    }

    const { specialiteId, responses } = req.body;

    const tests = await testModel.find({ specialite: specialiteId }).lean();
    if (!tests || tests.length === 0) {
      return res.status(404).send("No tests found for the given specialite");
    }

    let score = 0;
    tests.forEach((test) => {
      const studentResponse = responses.find(
        (response) => response.questionId === test._id.toString()
      );
      if (studentResponse) {
        const correctAnswer = test.reponse.find((ans) => ans.isCorrect);
        if (correctAnswer && correctAnswer.option === studentResponse.option) {
          score += 2;
        }
      }
    });

    let group = "";
    if (score >= 0 && score < 10) {
      group = "A";
    } else if (score >= 10 && score < 15) {
      group = "B";
    } else if (score >= 15 && score <= 20) {
      group = "C";
    }
    try {
      let groupe = await groupeModel.findOne({ NomDeGroupe: group });
      // if (!groupe) {
      //   groupe = new groupeModel({
      //     NomDeGroupe: group,
      //     Abbreviation: group.substring(0, 3).toUpperCase(),
      //     users: []
      //   });
      //   await groupe.save();
      // }
      await userEval.create({ reponses: responses, userId: userId, matiereId: specialiteId, score: score, groupe: groupe._id })
      // if (!groupe.users.includes(user._id)) {
      //   if (groupe.users.length >= 50) {
      //     return res.status(400).send({ error: "Group has reached the maximum number of users" });
      //   }
      //   groupe.users.push(user._id);
      //   await groupe.save();
      //}
      res.send({ message: "Voici votre note et le groupe.", score, group });
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }

  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

const getMatiereByUserId = async (req, res) => {
  try {
    const matiere = await userEval.find({ userId: req.params.userId }).populate('matiereId');
    res.send(matiere);
  } catch (error) {
    console.log(error);
  }
};

const getUsersByGroupeId = async (req, res) => {
  try {
    const userEvalObjects = await userEval.find({ groupe: req.params.idG });

    if (!userEvalObjects || userEvalObjects.length === 0) {
      return res.status(404).send({ message: 'User evaluation not found' });
    }

    const userIds = userEvalObjects.map(userEvalObj => userEvalObj.userId);

    const eleves = await eleveModel.find({ _id: { $in: userIds } });

    res.send(eleves);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server error' });
  }
};

const getEnseignatByUserId = async (req, res) => {
  try {
    const userEvalObject = await userEval.findOne({ userId: req.params.userId });

    if (!userEvalObject) {
      return res.status(404).send({ message: 'User evaluation not found' });
    }

    const enseignant = await enseignantModel.findOne({ 'enseigne.specialite': userEvalObject.matiereId });

    if (!enseignant) {
      return res.status(404).send({ message: 'Enseignant not found' });
    }

    res.send(enseignant);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server error' });
  }
};
const getRessourcesByidMatiere = async (req, res) => {
  try {
    const ressources = await ressourcesModel.find({ matiereId: req.params.idM });
    console.log(ressources);
    res.send(ressources);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server error' });
  }
};
module.exports.testsController = {
  getTestScore,
  getTestById,
  getUserEvalByUserId,
  getMatiereByUserId,
  getUsersByGroupeId,
  getEnseignatByUserId,
  getRessourcesByidMatiere
};