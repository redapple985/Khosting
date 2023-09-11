const mongoose = require('mongoose')
const userschema = mongoose.Schema({

//about user

    userName:{
        type:String,
        required:true
    },

    userFullName:{

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


    userInterestsId:{

        type:String,

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

    userIpAddressUpdate:{

        type:String,

    },

    userDeviceNameUpdate:{

        type:String,

    },



    //location

    userCoordinates_lat:{

        type:String
    },

    userCoordinates_lon:{

        type:String,

    },

    userUpdateCoordinates_lat:{

        type:String

    },

    userUpdateCoordinates_lon:{

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

    userAppVersion:{

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

    tokens:{

        type:String
    },

    userKey:{

        type:String,
        required:true
    },

    specials:{

        type:String,
        default:""

    },

    SHA1:{

        type:String,
    }



})

const userModel = mongoose.model("userModel",userschema)
module.exports = userModel
