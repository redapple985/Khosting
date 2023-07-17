const express = require('express')
const router = new express.Router()
const UserController = require('../Controllers/userController')
const controllerobject = new UserController()
const uploadMiddlware = require("../Middlewares/fileUpload")
const authMiddleware = require("../Middlewares/auth")

router.post('/signup',(req, res)=>{

    controllerobject.signup(req,res)

})


router.get('/getenv',(req, res)=>{

    controllerobject.sendEnv(req,res)
})


router.post("/Signin",authMiddleware,(req,res)=>{

    controllerobject.Signin(req,res)
})

router.post("/uploadProfile",authMiddleware,uploadMiddlware,(req,res)=>{

    controllerobject
        .uploadProfilePicture(req,res)

})


module.exports = router