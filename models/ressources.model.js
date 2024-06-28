const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ressources = new Schema({
  title: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: false,
  },
  matiereId: {
    type: Schema.Types.ObjectId,
    ref: "specialite",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = mongoose.model("ressources", ressources);
