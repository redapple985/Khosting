const express = require('express')
const router = new express.Router()
let UserController = null
let controllerobject = null
const uploadMiddlware = require("../Middlewares/fileUpload")
const authMiddleware = require("../Middlewares/auth")
require('dotenv').config()


if (process.env.isdevelopment==='development'){

    UserController = require("../Controllers/userController_development")
    controllerobject = new UserController()
    console.log("dev")
}
else{

    UserController = require("../Controllers//userController")
    controllerobject = new UserController()
    console.log("pro")
}


router.post('/signup',(req, res)=>{



    controllerobject.signup(req,res)

})


router.get('/getenv',(req, res)=>{

    controllerobject.sendEnv(req,res)
})


router.post("/Signin",(req,res)=>{

    controllerobject.Signin(req,res)
})

router.post("/uploadProfile",authMiddleware,uploadMiddlware.single("picture"),(req,res)=>{

    controllerobject
        .uploadProfilePicture(req,res)

})


router.post("/updateProfile",authMiddleware,(req, res)=>{

    controllerobject.updateUserInfo(req,res)

})


router.post("/addUserInterests",authMiddleware,(req,res)=>{

    controllerobject.AddInterests(req,res)
})


router.get("/getuserInterest",authMiddleware,(req,res)=>{

    controllerobject.getUserinterests(req,res)
})




module.exports = router