const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userEval = new Schema({
  reponses: [{
    questionId: {
      type: String,
      required: true,
    },
    option: {
      type: String,
      required: true,
    }
  }],
  score: {
    type: String,
    required: false,
  },
  matiereId: {
    type: Schema.Types.ObjectId,
    ref: "Specialite",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  groupe: {
    type: Schema.Types.ObjectId,
    ref: "groupe",
  },
});

module.exports = mongoose.model("userEval", userEval);
