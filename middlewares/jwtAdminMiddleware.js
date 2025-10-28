
const jwt = require('jsonwebtoken')

const jwtAdminMiddleware =(req,res,next)=>{
    console.log('Inside Admin JWT middleware');

    const token = req.headers['authorization'].split(' ')[1]
    console.log(token);
    try{
        const jwtResponse = jwt.verify(token,'secretKey')
        // console.log(jwtResponse);
        req.payload = jwtResponse.userMail
        console.log(jwtResponse);
        
        if(jwtResponse.userMail == "adminBook@gmail.com"){
             next()   
        }else{
           res.status(401).json('Invalid User')
        }
         

    }catch(err){
        res.status(401).json('Invalid Token')
    }
    
}

module.exports = jwtAdminMiddleware