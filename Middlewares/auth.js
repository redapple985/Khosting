const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { request } = require('express')

const auth = (req,res,next)=>{

    const token = req.headers.authorization.split(' ')[1]

    console.log(token)

    jwt.verify(token,process.env.app_secrete,(err,decode)=>{


        if (err){

            res.status(400).send({msg:"Access denied"})
        }
        else{

            req.token = decode
            //for testing purpose
            console.log(req.token)

            //call to next
            next()

        }
    })

}

module.exports = auth