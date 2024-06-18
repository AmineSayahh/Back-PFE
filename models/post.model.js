const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "users" },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  filePath: { 
    type: String,
  },
}, {
  timestamps: true

});

module.exports = mongoose.model("posts", postSchema);

