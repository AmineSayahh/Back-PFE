const express = require ("express");
const { adminController } = require("../controllers/admin.controller");
const router = express();


router.post("/enseignants", adminController.createEnseignant);
router.put("/modifierens", adminController.updateEnseignant);
router.delete("/deleteens", adminController.deleteEnseignant);
router.get("/FindEns", adminController.FindAllEnseignant);

router.post("/specialites", adminController.createSpecialite);
router.get("/specialites/:groupeId", adminController.getSpecialites);
router.post("/tests", adminController.createTest);
router.get("/tests", adminController.getTests);

module.exports.adminRouter = router;