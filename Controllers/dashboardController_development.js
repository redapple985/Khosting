const formidable = require("formidable");

require("dotenv").config();
const aes256 = require("aes256");
const usermodel = require("../Models/userModel");
const { response } = require("express");
const path = require("path");
const { errors, IncomingForm } = require("formidable");
const dashboardModel = require("../Models/DashBoardModel");
require("dotenv").config();
const cryptLib = require("@skavinvarnan/cryptlib");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

class dashBoardController {
  async AddQuestionORPost(req, res) {
    const filename = req.file.filename;
    const userName = req.body.userName;
    const title = req.body.title;
    const subtext = req.body.subtext;
    const timeStamp = req.body.timeStamp;
    const description = req.body.description;
    const interestcatagory = req.body.interestCatagory;
    const subcatagory = req.body.subcatagory;
    const type = req.body.Type;
    const discussionId = req.body.discussionId;
    const status = req.body.status;
    const winner = req.body.winner;
    const mediatype = req.body.mediaType;
    const filepath = req.file.path;
    const userId = req.body.userId;

    const pushData = new dashboardModel({
      userId: userId,
      userName: userName,
      title: title,
      subtext: subtext,
      timeStamp: timeStamp,
      description: description,
      interestcatagory: interestcatagory,
      subcatagory: subcatagory,
      type: type,
      discussionId: discussionId,
      status: status,
      winner: winner,
      mediatype: mediatype,
      filename: filename,
      filepath: filepath,
    });

    console.log(interestcatagory);

    const savedData = await pushData.save();

    if (savedData != null) {
      return res
        .status(200)
        .json({ msg: "Post Uploaded Successfully", error: "false" });
    } else {
      return res
        .status(200)
        .json({ msg: "failed to Uploaded Post", error: "true" });
    }
  }

  async getDashboardDataByInterests(req, res) {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    const TokenArray = token.split(" ");
    const decoded = jwt.decode(TokenArray[1]);
    const user_id = token._id;

    console.log(user_id);

    const interests = req.body.interestsArray;
    console.log(interests);

    const getdata = await dashboardModel.find({
      interestcatagory: {
        $in: interests,
      },
    });

    if (getdata != null) {
      res.status(200).json({
        msg: "Data fetched successfully",
        error: "false",
        data: getdata,
      });
      console.log(getdata);
    } else {
      res.status(200).json({
        msg: "No data Found",
        error: "false",
        data: {},
      });
    }
    console.log(getdata);
  }

  async TestPost(req, res) {
    // const userName = req.body.userName;

    const token = req.body.userName;
    console.log(token);
    return res.status(200).json({ msg: "ok" });
  }
}

module.exports = dashBoardController;
//
