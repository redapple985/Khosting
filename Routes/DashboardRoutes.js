const express = require('express')
const router = new express.Router()
let UserController = null
let controllerobject = null
const uploadMiddlware = require("../Middlewares/fileUpload")
const authMiddleware = require("../Middlewares/auth")
require('dotenv').config()


if (process.env.isdevelopment==='development'){

    DashboardController_development = require("../Controllers/dashboardController_development")
    controllerobject = new DashboardController()
    console.log("dev")
}
else{

    DashboardController = require("../Controllers//dashboardController")
    controllerobject = new DashboardController()
    console.log("pro")
}


router.post('/getData',(req, res)=>{

    //controllerobject.signup(req,res)
    controllerobject.AddPostORQuestion(req,res)

})