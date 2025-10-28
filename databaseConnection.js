// import mongoose
const mongoose = require('mongoose')

connectionString = process.env.DATABASE

mongoose.connect(connectionString).then(()=>{
    console.log("MongoDb connected Successfully........");
    
}).catch((err)=>{
    console.log(`MongoDb Connection Failed due to ${err}`);
    
})