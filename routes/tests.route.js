const express = require("express");
const router = express.Router();
const { testsController } = require("../controllers/tests.controller");

router.post("/tests/score/:userId", testsController.getTestScore);
router.get("/get-test/:specialiteId/:userId", testsController.getTestById);
router.get("/getTestByUserId/:userId", testsController.getUserEvalByUserId);
router.get("/getMatiereByUserId/:userId", testsController.getMatiereByUserId);
router.get("/getUsersByGroupeId/:idG", testsController.getUsersByGroupeId);
router.get("/getEnseignantByUserId/:userId", testsController.getEnseignatByUserId);
router.get("/getRessources/:idM", testsController.getRessourcesByidMatiere);

module.exports.testsRouter = router;