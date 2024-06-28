const express = require ("express");
const { adminController } = require("../controllers/admin.controller");
const router = express();

router.post("/enseignants", adminController.createEnseignant);
router.put("/modifierens/:id", adminController.updateEnseignant);
router.put("/modifierMatiere/:id", adminController.modifierMatiere);
router.delete("/deleteens/:id", adminController.deleteEnseignant);
router.delete("/deleteMatiere/:id", adminController.deleteMatiere);
router.get("/FindEns/:id", adminController.FindAllEnseignant);
router.get("/findStudents/:id", adminController.findAllStudents);
router.post("/specialites", adminController.createSpecialite);
router.get("/specialites/:groupeId", adminController.getSpecialites);
router.post("/tests", adminController.createTest);
router.get("/tests", adminController.getTests);
router.get("/specialites", adminController.getAllSpecialities);

module.exports.adminRouter = router;