const express = require ("express");
const { enseignantController } = require("../controllers/enseignant.cotroller");
const router = express();
const passport = require("passport");

router.post("/createTest", enseignantController.createTest);
router.get("/getTests", enseignantController.getTests);
router.put('/note/:id', enseignantController.UpdateNote);
router.get(
  "/groupe/getAll/:id",
  passport.authenticate("jwt", { session: false }),
  enseignantController.findAllGroupe
);
router.get("/getSpecialite/:id/:groupeId", enseignantController.getSpecialite);
router.get("/getPosts/:id", enseignantController.getPosts);
router.post("/addRessources", enseignantController.addRessource);
router.get("/getRessources/:id/:idMAt", enseignantController.getRessources);

module.exports.enseignantRouter = router;