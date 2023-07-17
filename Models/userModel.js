const mongoose = require('mongoose')
const userschema = mongoose.Schema({

//about user

    userName:{
        type:String,
        required:true
    },

    fullName:{

        type:String,
        required: true
    },

    userEmail:{

        type:String,
        required:true
    },

    userGender:{

        type:String,
        required:true
    },


    //profession

    userProfession:{
        type:String,
        required:true
    },



    //technical details

    userPhoneNo:{

        type:String,
        required:true
    },

    userIpAddress:{

        type:String,

    },

    userDeviceName:{

        type:String,

    },



    //location

    userCoordinates_lat:{

        type:String
    },

    userCoordinates_lon:{

        type:String,

    },

    

    //security

    userPassword:{

        type:String,
        required:true
    },

    userPayment:{
        type:String,
        required:true
    },


    userPicturePath:{

      type:String,
      required:true
    },



    imageName:{

        type:String,
        required:true
    },

    token:{

        type:String
    }



})

const userModel = mongoose.model("userModel",userschema)
module.exports = userModel
