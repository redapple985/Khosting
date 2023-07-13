const {formidable} = require('formidable')

class UserController{


    signup(req,res){


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