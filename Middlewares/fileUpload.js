const multer = require('multer')
const jwt = require('jsonwebtoken')


const imagestorage = multer.diskStorage({

    destination:"profilepictures",
    filename:function (req,file,callback) {

        const token = req.headers.authorization
        const decodeToken = decodeMyToken(token)
        const iD = decodeToken._id
        const profilesecrete = process.env.profilepicture
        //const filename = `${iD}_${profilesecrete}_${file.originalname}`
        const filename = `${iD}_${file.originalname}`
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
    fileFilter:(request,file,cb)=>{
        if(file.size > filesize){

            cb(null,false)
            console.log(file.size)
            return cb(new Error('File too large'))
        }

            cb(undefined,true)


    }


})


function decodeMyToken(token){

    const TokenArray = token.split(" ");
    const _token = jwt.decode(TokenArray[1])
    return jwt.verify(TokenArray[1], process.env.app_secrete);
}

module.exports = uploadProfilePic