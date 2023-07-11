const express = require('express')
const router = new express.Router()
const UserController = require('../Controllers/userController')
const controllerobject = new UserController()

router.post('/signup',(req, res)=>{

    controllerobject.signup(req,res)

})


router.get('/getenv',(req, res)=>{

    controllerobject.sendEnv(req,res)
})


module.exports = router