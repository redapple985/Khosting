const formidable = require('formidable')

require('dotenv').config()
const aes256 = require("aes256")
const usermodel = require("../Models/userModel")
const {response} = require("express");
const {sign} = require("jsonwebtoken");
const path = require('path')
const {errors, IncomingForm} = require("formidable");
const interestModel = require("../Models/userInterestsModel")
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
                        userFullName,
                        userEmail,
                        userPassword,
                        userGender,
                        userPhoneno,
                        userDeviceRegisteration,
                        userDeviceNameUpdate,
                        userIpAddressRegisteration,
                        userIpAddressUpdate,
                        userPayment,
                        professions,
                        userAppVersion,
                        coordinates_Lat,
                        coordinates_Long,
                        userUpdateCoordinates_lat,
                        userUpdateCoordinates_lon,
                        imageName,
                        userPicturePath,
                        userKey


                    } = fields

                    console.log("username"+userDeviceRegisteration)

                    // var cipher = aes256.createCipher(process.env.app_secrete);
                    // var userNameDcrypt = cipher.decrypt(userName)
                    // var fullnameDycrypt = cipher.decrypt(userFullname)
                    // var userEmailDcrypt = cipher.decrypt(userEmail)
                    // var userPasswordDcrypt = cipher.decrypt(userPassword)
                    // var userGenderDcrypt = cipher.decrypt(userGender)
                    // var userphonenoDcrypt = cipher.decrypt(userPhoneno)
                    // var userDeviceDcrypt = cipher.decrypt(userDeviceRegisteration)
                    // var userIpAddressDcrypt = cipher.decrypt(userIpAddressRegisteration)
                    // var userpaymentDcrypt = cipher.decrypt(userPayment)
                    // var coordinate_lat_Dcrypt = cipher.decrypt(coordinates_Lat)
                    // var coordinate_long_Dcrypt = cipher.decrypt(coordinates_Long)
                    // var profession_dcrypt = cipher.decrypt(professions)



                    const pushUserData = new usermodel({

                        userName:userName,
                        userFullName:userFullName,
                        userEmail:userEmail,
                        userGender:userGender,
                        userProfession:professions,
                        userPhoneNo:userPhoneno,
                        userIpAddress:userIpAddressRegisteration,
                        userIpAddressUpdate:userIpAddressUpdate,
                        userDeviceName:userDeviceRegisteration,
                        userDeviceNameUpdate:userDeviceNameUpdate,
                        imageName:imageName,
                        userPicturePath:userPicturePath,
                        userCoordinates_lat:coordinates_Lat,
                        userCoordinates_lon:coordinates_Long,
                        userUpdateCoordinates_lat:userUpdateCoordinates_lat,
                        userUpdateCoordinates_lon:userUpdateCoordinates_lon,
                        userPassword:userPassword,
                        userPayment:userPayment,
                        userAppVersion:userAppVersion,
                        userKey:userKey



                    })

                    const savedData = await pushUserData.save()
                        .then(result=>{

                            if (result) {

                               debugger
                                const userKeymeta = result.userEmail+result.userPassword+result.userEmail
                                console.log(userKeymeta)

                                const cipher = aes256.createCipher(process.env.app_secrete)
                                const userkey = cipher.encrypt(userKeymeta,process.env.app_secrete)

                                    usermodel.findOneAndUpdate({_id:result.id},{$set:{userKey:userkey}},({new:true}))
                                    .then((result2=>{

                                        return res.status(200).json({msg: "200 User created"})
                                    }))
                                    .catch((err)=>{

                                        return res.status(500).json({msg: "Something went wrong"})
                                    })


                            }

                        }).catch((error)=>{

                            console.log(error)
                            return res.status(500).json({msg: "Something went wrong"})

                        })

                    if (savedData != null){



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
            form.parse(req, async(error, fields, files) => {

                if (fields != null) {


                    const {userEmail,userPassword,paYment} = fields
                    //later use
                    // const cipher = aes256.createCipher(process.env.app_secrete)
                    // const emailDcrypt = cipher.decrypt(userEmail)
                    // const nameDcrypt = cipher.decrypt(UserName)
                    // const passwordDcrypt = cipher.decrypt(userPassword)
                    const isemailvalid = userEmail.includes("@")
                    if (isemailvalid){

                        const findUser =
                           await usermodel.findOne({userEmail:userEmail})
                        console.log(isemailvalid)

                        if (!findUser){

                            return res.status(404).send({msg:"Not found"})
                        }
                        else{

                            var ispasswordcorrect = await findUser.userPassword === userPassword
                            if (!ispasswordcorrect){

                                console.log(userPassword)
                                console.log(findUser.userPassword)
                                return res.status(404).send({msg:"404 Something went wrong"})

                            }
                            else{


                                if(paYment === findUser.userPayment){

                                    console.log("matching payment"+findUser.userPayment);
                                    await this.UpdateSiginToken(findUser,req,res)
                                }
                                else{

                                    return res.status(500).send({msg:"Something went wrong"})
                                }


                            }

                        }
                    }


                }
                else{

                    return res.status(400).json({msg: "400 Bad request"})
                }
            })
        }catch(error){

            console.log(error)
            return res.status(500).json({msg: "500 Something went wrong"})

        }

    }



  async uploadProfilePicture(req,res){

        try {

            const cipher = aes256.createCipher(process.env.app_secrete)
            const imagePath = req.filename
            const userName = req.userName
            const userId = req.token._id

            // const imagePathDecrypted = cipher.decrypt(imagePath)
            // const userNameDecrypted = cipher.decrypt(userName)
            // const useridDecrypted = cipher.decrypt(userId)


            if (imagePath != null){

                const addImagepathToDB
                    = await usermodel.findByIdAndUpdate({_id:userId},{$set:{userPicturePath:imagePath,imageName:userName}},
                    ({new:true}))
                    .then(result=>{


                            res.status(200).send({
                                msg:"Task successful"
                            })


                    })
                    .catch((error)=>{

                        if(error){

                            res.status(500).send({
                                msg:"Something went wrong"
                            })

                        }

                    })

                //addImagepathToDB.save()

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


    async UpdateSiginToken(foundUser,req,res){


        const token_payload = {

            _id:foundUser._id,
            userEmail:foundUser.userEmail,
            userName : foundUser.userName,
            payment:foundUser.payment
        }

        const token = await sign(token_payload,process.env.app_secrete)
        //update token

         await usermodel.findOneAndUpdate({userEmail:foundUser.userEmail},{$push:{tokens:token}},({new:true})).
         then(result=>{


             console.log("sign in success")
             // return response.status(200).json({token,msg:"Sign

             // in success",id:user._id,username:user.username})
             console.log("Signin success")
             return res.status(200).send({msg:"Signin success",t:token,UserKey:result.userKey})




        }).catch((error)=>{



                console.log(error)
                return res.status(500).send({msg:"Something went wrong"})

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

    async updateUserInfo(req,res) {


        try {
            const form = new formidable.IncomingForm()
            form.parse(req, async (error, fields, files) => {


                // userName,
                //     userFullName,
                //     userEmail,
                //     userPassword,
                //     userGender,
                //     userPhoneno,
                //     userDeviceRegisteration,
                //     userIpAddressRegisteration,
                //     userPayment,
                //     professions,
                //     userAppVersion,
                //     coordinates_Lat,
                //     coordinates_Long,
                //     imageName,
                //     userPicturePath,
                //     userKey

                if (error) {

                    res.status(404).send({msg: "Not found"})

                }

                    if (fields != null) {

                        const {
                            userName,
                            userEmail,
                            userFullName,
                            userGender, userPhoneno,
                            userDeviceUpdate,
                            userAppVersion,
                            coordinates_Lat,
                            coordinates_Long,
                            userIPUpdate

                        } = fields


                        console.log(userEmail)

                        const id = req.token._id
                        console.log(id)
                        const updateData = usermodel.findOneAndUpdate({_id: id}, {
                            $set: {

                                userName: userName,
                                userFullName: userFullName,
                                userEmail: userEmail,
                                userGender: userGender,
                                userPhonno: userPhoneno,
                                userDeviceNameUpdate: userDeviceUpdate,
                                userIpAddressUpdate: userIPUpdate,
                                userAppVersion: userAppVersion,
                                userUpdateCoordinates_lat: coordinates_Lat,
                                userUpdateCoordinates_lon: coordinates_Long


                            }
                        }, ({new: true}))
                            .then(result => result => {

                                console.log("fullfilled")
                               return  res.status(200).send({msg: "User Profile data Updated"})



                            })
                            .catch((error) => {

                                console.log(error)
                               return  res.status(500).send({msg: "500 Something went wrong"})

                            })

                    } else {

                        return res.status(400).send({msg: "400 Bad Request"})

                    }



            })
        }
        catch (error) {

            return res.status(500).send({msg: "500 Something went wrong"})
        }

    }


    async AddInterests(req,res){

        const form = new formidable.IncomingForm()
        try{

            form.parse(req,async(error,fields,files)=>{

                if (error){

                    return res.status(400).send({msg:"Bad request"})

                }

                if (fields != null){

                    const  {
                        userInterestedTopics,
                        userName,
                        payment

                    } = fields

                    const userid = req.token._id

                    console.log(userid)
                    console.log(userInterestedTopics)


                    const pushInterests = interestModel({

                        userName:userName,
                        payment:payment,
                        userId:userid,
                        interests:userInterestedTopics
                    })

                   await pushInterests.save()

                    if (pushInterests){

                        const userInterestId = pushInterests._id

                        usermodel.findOneAndUpdate({_id:userid},{$set:{userInterestsId:userInterestId}},({new:true}))
                            .then(result=>{

                                return res.status(200).send({msg:"Interests added"})
                            })
                            .catch((error)=>{

                                console.log(error)
                                return res.status(500).send({msg:"500 Something went wrong"})
                            })



                    }

                }
                else{


                }

            })
        }
       catch(error){

           return console.log(error)
        }

    }



    async getUserinterests(req,res){

        const id = req.token._id
        const userData =await  usermodel.findOne({_id:id})
        const interestid = userData.userInterestsId
        const getinterests = interestModel.findOne({_id:interestid})
        console.log(getinterests)

    }

}


module.exports = UserController