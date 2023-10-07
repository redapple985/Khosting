const mongoose = require("mongoose");
const dashboardSchema = mongoose.Schema({
  userId: {
    type: String,
  },

  userProfilepath: {
    type: String,
  },

  userName: {
    type: String,
  },

  title: {
    type: String,
  },

  subtext: {
    type: String,
  },

  timeStamp: {
    type: String,
  },

  description: {
    type: String,
  },

  interestcatagory: {
    type: Array,
    default: [],
  },

  subcatagory: {
    type: String,
  },

  Type: {
    type: String,
  },

  discussionId: {
    type: String,
  },

  status: {
    type: String,
  },

  winner: {
    type: String,
  },

  mediaType: {
    type: String,
  },

  filename: {
    type: String,
  },

  filepath: {
    type: String,
  },
});

const dashboardModel = mongoose.model("dashboardModel", dashboardSchema);
module.exports = dashboardModel;
