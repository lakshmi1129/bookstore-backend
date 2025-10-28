// import multer
const multer = require("multer")

const storage = multer.diskStorage({
    // path to store the file
    destination:(req,file,callback)=>{
        callback(null,'./pdfUploads')
    },
    filename:(req,file,callback)=>{
        const fName = `resume-${file.originalname}`
        callback(null,fName)
    }
})

const fileFilter = (req,file,callback)=>{
    // accept only jpg,png,jpeg
    if(file.mimetype == 'application/pdf'){
        callback(null,true)
    }
    else{
        callback(null,false)
        return callback(new Error('Acceps only PDF files....!'))
    }
}

// create config
const pdfmulterConfig = multer({
    storage,
    fileFilter
})

module.exports = pdfmulterConfig