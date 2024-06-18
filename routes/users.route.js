const express = require("express");
const { userController } = require("../controllers/users.controller");
const router = express.Router();
const passport = require("passport");
const { roleMiddleware } = require("../middleware/role");
const { inRole, Roles } = roleMiddleware;

router.get(
  "/users/:id",
  passport.authenticate("jwt", { session: false }),
  userController.FindById
);

router.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  inRole(Roles.ADMIN),
  userController.FindAll
);

router.post("/users", userController.Register);

router.delete(
  "/users/:id",
  passport.authenticate("jwt", { session: false }),
  inRole(Roles.ADMIN),
  userController.Delete
);

module.exports.userRouter = router;
