
const jwt = require('jsonwebtoken')

const jwtMiddleware =(req,res,next)=>{
    console.log('Inside JWT middleware');

    const token = req.headers['authorization'].split(' ')[1]
    console.log(token);
    try{
        const jwtResponse = jwt.verify(token,'secretKey')
        console.log(jwtResponse);
        req.payload = jwtResponse.userMail
          next()   

    }catch(err){
        res.status(401).json('Invalid Token')
    }
    
    // logic
    
    
  
    

}

module.exports = jwtMiddleware