const express = require ("express");
const router = express.Router();
const { superAdminController } = require("../controllers/superAdmin.controller");


router.post("/super-admin/create", superAdminController.createAdmin);
router.get("/super-admin/consult", superAdminController.getAdmin);
router.put("/super-admin/modifier/:id", superAdminController.updateAdmin);
router.delete("/super-admin/delete/:id", superAdminController.deleteAdmin);
router.get("/super-admin/consult/:id", superAdminController.findAdminById);

module.exports.superAdminRouter = router;