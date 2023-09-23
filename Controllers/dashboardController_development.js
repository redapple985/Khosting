const formidable = require('formidable')

require('dotenv').config()
const aes256 = require("aes256")
const usermodel= require("../Models/userModel")
const {response} = require("express");
const {sign} = require("jsonwebtoken");
const path = require('path')
const {errors, IncomingForm} = require("formidable");
const dashboardModel = require("../Models/DashBoardModel")
require('dotenv').config()
const cryptLib = require('@skavinvarnan/cryptlib');


class dashBoardController{


     AddPostORQuestion(req,res){

        const form = new formidable.IncomingForm()
        form.parse(req, async (error, fields, files) => {

            if (error) {

                console.log(error)
                return res.status(500).json({msg: "500 Internal Server Error", error: "true"})

            }

            const {} = fields

            //decrypt values


            //Add to database


        }).then(r =>{


        })


        }






}
