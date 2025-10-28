const applications = require('../model/appmodel');

// add Application
exports.addApplicationController = async(req,res)=>{
    const {fullname,jobTitle,qualification,email,phone,coverletter } = req.body
    console.log(fullname,jobTitle,qualification,email,phone,coverletter);

    const resume = req.file.filename
    console.log(resume);

    try{
        const existingApplication = await applications.findOne({jobTitle,email})

        if(existingApplication){
            res.status(400).json("Already Applied to This post....")
        }else{
            const newApplication = new applications({
                fullname,jobTitle,qualification,email,phone,coverletter,resume
            })
            await newApplication.save()
            res.status(200).json(newApplication)
        }

    }catch(err){
        res.status(500).json(err)
    }
    
    
}


// get all applications
exports.getAllApplicationController = async(req,res)=>{
    try{
        const allApplications = await applications.find()
        res.status(200).json(allApplications)

    }catch(err){
        res.status(500).json(err)
    }
}


