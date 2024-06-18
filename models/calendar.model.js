const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const calendarSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  specialityId: {
    type: Schema.Types.ObjectId,
    ref: "Specialite",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  durationInMinutes: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Calendar", calendarSchema);