


const appMiddleware =(req,res,next)=>{
    // logic
    console.log('Inside application Specific middleware');
    next()
    

}

module.exports = appMiddleware