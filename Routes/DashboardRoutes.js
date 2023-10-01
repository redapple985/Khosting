const express = require("express");
const router = new express.Router();
let DashboardController = null;
let controllerobject = null;
const authMiddleware = require("../Middlewares/auth");
const postmediaUpload = require("../Middlewares/postMediaUpload");
const { route } = require("express/lib/router");
require("dotenv").config();

if (process.env.isdevelopment === "development") {
  DashboardController = require("../Controllers/dashboardController_development");
  controllerobject = new DashboardController();
  console.log("dev dash");
} else {
  DashboardController = require("../Controllers//dashboardController");
  controllerobject = new DashboardController();
  console.log("pro");
}

router.post(
  "/addPostQuestion",
  authMiddleware,
  postmediaUpload.single("file"),
  (req, res) => {
    controllerobject.AddQuestionORPost(req, res);
  },
);

module.exports = router;
//
