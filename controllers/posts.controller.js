const { helpers } = require("../helpers/helpers");
const postModel = require("../models/post.model");

const Add = async (req, res) => {
  try {
    if (req.file) {
      req.body.filePath = req.file.path;
    }
    req.body.user = req.user._id;
    console.log("🚀 ~ Add ~ req.body:", req.body);

    const response = await postModel.create(req.body);
    return res.send({ message: "Post added successfully", data: response });
  } catch (error) {
    console.log("🚀 ~ Add ~ error:", error);
    return helpers.customError(res, error);
  }
  
};

const findAll = async (req, res) => {
  const posts = await postModel.find();
  console.log(posts);
  return res.send(posts);
};

const findMyPosts = async (req, res) => {
  const posts = await postModel.find({ user: req.user._id });
  return res.send(posts);
};

const deletePost = async (req, res) => {
  await postModel.deleteOne({ _id: req.params.id });
  return res.send({ message: "Deleted successfully" });
};

module.exports.postsController = {
  Add,
  findMyPosts,
  findAll,
  deletePost,
};
