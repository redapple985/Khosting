const {formidable} = require('formidable')

const usermodel = require("../Models/userModel");

require('dotenv').config()
const aes256 = require("aes256")
const usermodel = require("../Models/userModel")

class UserController{


    async signup(req,res){


        try {

            const form = new formidable.incomingForm()
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
                        userCoordinates,
                        coordinates_Lat,
                        coordinates_Long


                    } = fields


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


                    const pushUserData = new usermodel({

                        userName:userNameDcrypt,
                        userFullname:fullnameDycrypt,
                        userEmail:userEmailDcrypt,
                        userGender:userGenderDcrypt,

                        userPhoneno:userphonenoDcrypt,
                        userIpAddress:userIpAddressDcrypt,
                        userDeviceName:userDeviceDcrypt,


                        userCoordinates_lat:coordinate_lat_Dcrypt,
                        userCoordinates_lon:coordinate_long_Dcrypt,

                        userPassword:userPasswordDcrypt,
                        userPayment:userpaymentDcrypt



                    })

                    const data = await pushUserData().save()




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

}

module.exports = UserController