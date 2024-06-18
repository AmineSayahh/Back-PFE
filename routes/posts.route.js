const express = require("express");
const { postsController } = require("../controllers/posts.controller");
const router = express.Router();
const passport = require("passport");
const upload = require("../middleware/multer");

router.post(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  upload.single('filepath'), // Assurez-vous que 'file' correspond au nom du champ dans le formulaire
  postsController.Add
);

router.get(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  postsController.findAll
);


router.get(
  "/posts/me",
  passport.authenticate("jwt", { session: false }),
  postsController.findMyPosts
);

router.delete(
  "/posts/:id",
  passport.authenticate("jwt", { session: false }),
  postsController.deletePost
);


module.exports.postRouter = router;
