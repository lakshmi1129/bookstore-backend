// import dotenv file
        // const dotenv = require("dotenv")
        // dotenv.config()
 require('dotenv').config()

// import express server
const express = require('express')
// import cors
const cors = require('cors')
// import routes
const route = require('./routes')

// import db connection file
require('./databaseConnection')

// import application specific middleware
// const appMiddleware = require('./middlewares/appMiddleware')

// create server - express()
const bookstoreServer = express()

// server using cors
bookstoreServer.use(cors())
bookstoreServer.use(express.json()) // parse json - middleware
// bookstoreServer.use(appMiddleware)
bookstoreServer.use(route)

// export the uploads folder from server
bookstoreServer.use('/upload',express.static('./uploads'))

// export the pdfUloads folder from server
bookstoreServer.use('/pdfUploads',express.static('./pdfUploads'))

// create port
PORT = 4000 || process.env.PORT

bookstoreServer.listen(PORT,()=>{
    console.log(`server running in port: ${PORT}`);
    
})



