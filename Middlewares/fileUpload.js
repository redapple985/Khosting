const multer = require('multer')
const imagesStorageDirectory = require("")
const {request} = require("express");

const imagestorage = multer.diskStorage({

    destination:"profilepictures",
    filename:function (req,file,callback) {

        const id = req.token._id
        const token = req.token
        const profilesecrete = process.env.profilepicture
        const filename = `${file.originalname}-${id}-${profilesecrete}`
        req.filename = filename
        callback(null,filename)

    },

})

//approx 1 MB
const filesize = 1000000 * 5


//getting multer ready with restrictions and storage options
const uploadProfilePic = multer({

    storage:imagestorage,
    limits:{

        filesize:filesize
    },
    fileFilter:(request,filesize,callback)=>{

        if(file.size > filesize){

            callback(null,false)
            console.log(file.size)
            return callback(new Error('File too large'))
        }
        else{

            callback(undefined)
        }

    }


})

module.exports = uploadProfilePic