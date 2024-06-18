const express = require ("express");
const { authController } = require("../controllers/auth.router");
const router = express();


router.post("/login", authController.Login);
router.post("/logout", authController.Logout);


module.exports.authRouter = router;