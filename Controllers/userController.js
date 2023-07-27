const formidable = require('formidable')

require('dotenv').config()
const aes256 = require("aes256")
const usermodel = require("../Models/userModel")
const {response} = require("express");
const {sign} = require("jsonwebtoken");
const path = require('path')
require('dotenv').config()
class UserController{


    async signup(req,res){


        try {

            const form = new formidable.IncomingForm()
            form.parse(req, async (error, fields, files) => {

                if (error) {

                    console.log(error)
                    return res.status(500).json({msg: "500 Internal Server Error"})

                }

                if (fields != null) {
                    const {
                        userName,
                        userFullname,
                        userEmail,
                        userPassword,
                        userGender,
                        userPhoneno,
                        userDeviceRegisteration,
                        userIpAddressRegisteration,
                        userPayment,
                        professions,
                        coordinates_Lat,
                        coordinates_Long


                    } = fields

                    console.log("username"+userDeviceRegisteration)

                    var cipher = aes256.createCipher(process.env.app_secrete);
                    var userNameDcrypt = cipher.decrypt(userName)
                    var fullnameDycrypt = cipher.decrypt(userFullname)
                    var userEmailDcrypt = cipher.decrypt(userEmail)
                    var userPasswordDcrypt = cipher.decrypt(userPassword)
                    var userGenderDcrypt = cipher.decrypt(userGender)
                    var userphonenoDcrypt = cipher.decrypt(userPhoneno)
                    var userDeviceDcrypt = cipher.decrypt(userDeviceRegisteration)
                    var userIpAddressDcrypt = cipher.decrypt(userIpAddressRegisteration)
                    var userpaymentDcrypt = cipher.decrypt(userPayment)
                    var coordinate_lat_Dcrypt = cipher.decrypt(coordinates_Lat)
                    var coordinate_long_Dcrypt = cipher.decrypt(coordinates_Long)
                    var profession_dcrypt = cipher.decrypt(professions)



                    const pushUserData = new usermodel({

                        userName:userNameDcrypt,
                        userFullname:fullnameDycrypt,
                        userEmail:userEmailDcrypt,
                        userGender:userGenderDcrypt,
                        userProfession:profession_dcrypt,

                        userPhoneno:userphonenoDcrypt,
                        userIpAddress:userIpAddressDcrypt,
                        userDeviceName:userDeviceDcrypt,


                        userCoordinates_lat:coordinate_lat_Dcrypt,
                        userCoordinates_lon:coordinate_long_Dcrypt,

                        userPassword:userPasswordDcrypt,
                        userPayment:userpaymentDcrypt



                    })

                    const savedData =  pushUserData.save()

                    if (savedData != null){

                        return res.status(200).json({msg: "200 User created"})

                    }
                    //for debugging
                    console.log(userName)
                    //const data = await pushUserData().save()




                } else {

                    return res.status(400).json({msg: "400 Bad request"})

                }


            })
        }
        catch (error){

            console.log(error)
            return res.status(500).json({msg: "500 Something went wrong"})
        }

    }


    sendEnv(req,res){

        res.status(200).send({'msg':process.env.app_secrete||'empty'})

    }


     Signin(req,res){

        const form = new formidable.IncomingForm()

        try {
            form.parse(req, async (error, fields, files) => {

                if (fields != null) {


                    const {UserName, userEmail, userPassword, token, paYment} = fields
                    //later use
                    // const cipher = aes256.createCipher(process.env.app_secrete)
                    // const emailDcrypt = cipher.decrypt(userEmail)
                    // const nameDcrypt = cipher.decrypt(UserName)
                    // const passwordDcrypt = cipher.decrypt(userPassword)
                    const isemailvalid = userEmail.includes("@")
                    if (isemailvalid) {

                        const findUser =
                            await usermodel.find({userEmail: userEmail})

                        if (!findUser) {

                            return res.status(404).send({msg: "Not found"})
                        } else {

                            const ispasswordcorrect = findUser.userPassword === userPassword
                            if (!ispasswordcorrect) {

                                return res.status(404).send({msg: "Something went wrong"})

                            } else {


                                if (paYment === findUser.payment) {

                                    console.log("Signin success")
                                    return res.status(200).send({msg: "Signin success"})
                                } else {

                                    return res.status(500).send({msg: "Something went wrong"})
                                }


                            }

                        }
                    }


                } else {

                    return res.status(400).json({msg: "400 Bad request"})
                }
            })
        }catch(error){

            console.log(error)
            return res.status(500).json({msg: "500 Something went wrong"})

        }

    }



    uploadProfilePicture(req,res){

        try {

            const cipher = aes256.createCipher(process.env.app_secrete)
            const imagePath = req.filename
            const userName = req.userName
            const userId = req.token.id

            const imagePathDecrypted = cipher.decrypt(imagePath)
            const userNameDecrypted = cipher.decrypt(userName)
            const useridDecrypted = cipher.decrypt(userId)


            if (imagePath != null){

                const addImagepathToDB
                    = usermodel.findByIdAndUpdate({_id:userId},{$set:{userPicturePath:imagePath,imageName:userName}},
                    {new:true,strict:false},(err,doc)=>{

                        if(err){

                            res.status(500).send({
                                msg:"Something went wrong"
                            })

                        }
                        else{

                            res.status(200).send({
                                msg:"Task successful"
                            })
                        }

                    })

                // addImagepathToDB.save()
            }
            else{


                res.status(500).send({
                    msg:"Something went wrong"
                })
            }



        }
        catch (error){

            console.log(error)
            return res.status(500).json({msg: "500 Something went wrong"})
        }



    }


    async UpdateSiginToken(userModel){


        const token_payload = {

            _id:userModel._id,
            userEmail:userModel.userEmail,
            userName : userModel.userName,
            payment:userModel.payment
        }

        const token = sign(token_payload,process.env.cookie_secret)
        //update token

        userModel.findOneAndUpdate({_id:userModel.id},{$push:{tokens:token}},{new:true},(err,doc)=>{

            if (err){

                return response.status(404).send({msg:"Something went wrong"})
            }
            else{

                console.log("sign in success")
               // return response.status(200).json({token,msg:"Sign

                // in success",id:user._id,username:user.username})
                return response.status(200).json({token,msg:"Sign in success"})

            }
        })



    }


    async UpdateUserProfilePic(req,res){

        try {

            const cipher = aes256.createCipher(process.env.app_secrete)
            const updateimagePath = req.filename
            const userName = req.userName
            const userId = req.token.id

            const imagePathDecrypted = cipher.decrypt(imagePath)
            const userNameDecrypted = cipher.decrypt(userName)
            const useridDecrypted = cipher.decrypt(userId)

            const imageabsolutePath = path.join(__dirname,"profilepictures",updateimagePath)

            console.log(imageabsolutePath)


            if (updateimagePath != null){

                fs.unlinkSync(imageabsolutePath)

                const addImagepathToDB
                    = usermodel.findByIdAndUpdate({_id:userId},{$set:{userPicturePath:imagePath,imageName:userName}},
                    {new:true,strict:false},(err,doc)=>{

                        if(err){

                            res.status(500).send({
                                msg:"Something went wrong"
                            })

                        }
                        else{

                            response.status(200).send({
                                msg:"Task successful"
                            })
                        }

                    })


                addImagepathToDB.save()



            }
            else{


                res.status(500).send({
                    msg:"Something went wrong"
                })
            }



        }
        catch (error){

            console.log(error)
            return res.status(500).json({msg: "500 Something went wrong"})
        }


    }

    async updateUserInfo(){


        const filename = req.filename

    }


}

module.exports = UserController