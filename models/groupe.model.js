const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupeSchema = new Schema({
  NomDeGroupe: {
    type: String,
    required: true,
  },
  Abbreviation: {
    type: String,
    required: true,
  },
  enseignant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Enseignant",
  },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model("Groupe", groupeSchema);
