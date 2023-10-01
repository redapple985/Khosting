const mongoose = require("mongoose");
const interestSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },

  userId: {
    type: String,
    required: true,
  },

  payment: {
    type: String,
    required: true,
  },

  interests: {
    type: Array,
    default: [],
  },
});

const interesstModel = mongoose.model("userInterest", interestSchema);
module.exports = interesstModel;
