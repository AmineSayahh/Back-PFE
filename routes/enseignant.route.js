const express = require ("express");
const { enseignantController } = require("../controllers/enseignant.cotroller");
const router = express();



router.post("/createTest", enseignantController.createTest);
router.get("/getTests", enseignantController.getTests);
router.put('/note/:id', enseignantController.UpdateNote);


module.exports.enseignantRouter = router;