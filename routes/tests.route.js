const express = require("express");
const router = express.Router();
const { testsController } = require("../controllers/tests.controller");

router.post("/tests/score", testsController.getTestScore);
router.get("/get-test/:specialiteId", testsController.getTestById);

module.exports.testsRouter = router;