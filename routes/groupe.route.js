const express = require("express");
const router = express();
const { groupeController } = require("../controllers/groupe.controller");
const passport = require('passport');
const { roleMiddleware } = require("../middleware/role");
const { inRole, Roles } = roleMiddleware;

router.post("/creation", groupeController.groupCreation);
router.post("/addusertogroupe", groupeController.addUserToGroup);

router.get(
  "/findAllGroupe",
  passport.authenticate("jwt", { session: false }),
  inRole(Roles.ADMIN, Roles.ENSEIGNANT),
  groupeController.findAllGroupe
);
router.delete("/deleteGroupe/:id",
  passport.authenticate("jwt", { session: false }),
  inRole(Roles.ADMIN),
  groupeController.deleteGroupe);

router.post("/add-calendar", groupeController.addCalendarEntriesForGroup);
router.get("/calendar/events", groupeController.getCalendarEventsByUserId);
router.get("/calendar/events/all", groupeController.getAllCalendarEvents);
router.delete(
  "/calendar/delete-event/:id",
  groupeController.deleteCalendarEventById
);

module.exports.groupeRouter = router;
