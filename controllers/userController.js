const users = require('../model/userModel')
var jwt = require('jsonwebtoken');

// register
exports.registerController = async (req,res)=>{
    const {username,email,password} = req.body
    console.log(username,email,password);

    try{
        const existingUser = await users.findOne({email})
        
        if(existingUser){
            res.status(400).json("Already registered User!!!")
        }
        else{
            const newUser = new users({
                username,
                email,
                password,
                profile:"",
                bio:""
            })
            await newUser.save()// mongodb save
            res.status(200).json(newUser)

        }
    }catch(err){
        res.status(500).json(err)
    }
    
}


// login

exports.loginController = async (req,res)=>{
    const {email,password} = req.body
    console.log(email,password);
    try{
        const existingUser = await users.findOne({email})
        if(existingUser){
           if(existingUser.password == password){
            const token = jwt.sign({userMail:existingUser.email},'secretKey')
                     res.status(200).json({existingUser,token})
           }else{
                res.status(401).json('Incorrect Password....')
           }
        }else{
            res.status(404).json("Incorrect Email Id.....")
        }

    }catch(err){
    res.status(500).json(err)
}
    
   
    
}

// google login

exports.googleLoginController = async (req,res)=>{
    const {username,email,password,photo} = req.body
    console.log(username,email,password,photo);
    try{
        const existingUser = await users.findOne({email})

        if(existingUser){
            const token = jwt.sign({userMail:existingUser.email},'secretKey')
                     res.status(200).json({existingUser,token})

        }
        else{
             const newUser = new users({
                username,
                email,
                password,
                profile:photo,   
            })
            await newUser.save()  // mongodb save
             const token = jwt.sign({userMail:newUser.email},'secretKey')
              res.status(200).json({existingUser:newUser,token})
          
        }

    }catch(err){
        res.status(500).json(err)
    }
   
    
}


// update user profile 
exports.editUserProfileController = async(req,res)=>{
    const {username,password,profile,bio} = req.body
    const prof = req.file ? req.file.filename : profile
    const email = req.payload
   

    
    try{
        const userDetails = await users.findOneAndUpdate({email},{username,email,password,profile:prof , bio},{new:true})
        console.log(userDetails);
        
        await userDetails.save()
        res.status(200).json(userDetails)

    }catch(err){
        res.status(500).json(err)
    }
}






// -----------Admin---------------

// get al users
exports.getAllUserController = async(req,res)=>{
    const email = req.payload
    try{
        const allUsers = await users.find({email:{$ne:email}})
        res.status(200).json(allUsers)
    }catch(err){
        res.status(500).json(err)
    }
}

// update admin profile 
exports.editAdminProfileController = async(req,res)=>{
    const {username,password,profile} = req.body
    const prof = req.file ? req.file.filename : profile
    const email = req.payload
    try{
        const adminDetails = await users.findOneAndUpdate({email},{username,email,password,profile:prof},{new:true})
        await adminDetails.save()
        res.status(200).json(adminDetails)
    }catch(err){
        res.status(500).json(err)
    }
}





