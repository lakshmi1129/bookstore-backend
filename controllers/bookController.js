const books = require("../model/bookModel");
// stripe import and use
const stripe = require("stripe")(process.env.stripeKey)


// add book
exports.addBookController = async (req,res)=>{
    console.log("Inside add book controller");
    const {  title, author, noOfPages, imageUrl,price,dPrice,abstract,publisher,language,isbn,category} = req.body

    uploadImg =[]
    req.files.map((item=>uploadImg.push(item.filename)))
    console.log(uploadImg);
    
    const email = req.payload
    console.log(email);

    try{
        const existingBook = await books.findOne({title,userEmail:email})

        if(existingBook){
            res.status(401).json("You have already added This Book!!")
        }else{
            console.log("inside............");
            
            const newBook = new books({
                title, author, noOfPages, imageUrl,price,dPrice,abstract,publisher,language,isbn,category,uploadImg,userEmail:email
            })
            await newBook.save()
            res.status(200).json(newBook)
        }
    }catch(err){
        res.status(500).json(err)
    }
    
    
    
    
    res.status(200).json('Request Received...')
    
}


// to get home books
exports.getHomeBookController = async(req,res)=>{
    try{
        const allHomeBooks = await books.find().sort({_id:-1}).limit(4)
        res.status(200).json(allHomeBooks)

    }catch(err){
        res.status(500).json(err)
    }
}

// to get  books in books page
exports.getAllBookController = async(req,res)=>{
    // console.log(req.query.search);
    const searchKey = req.query.search
    const email = req.payload
    
    try{
        const query = {
            title:{
                $regex:searchKey,$options:'i'
            },
            userEmail:{$ne:email}
        }
        const allBooks = await books.find(query)
        res.status(200).json(allBooks)

    }catch(err){
        res.status(500).json(err)
    }
}


// to get a particular book in View page
exports.getABookController = async(req,res)=>{
    const {id} = req.params
    console.log(id);
    
    try{
        const aBook = await books.findOne({_id:id})
        res.status(200).json(aBook)

    }catch(err){
        res.status(500).json(err)
    }
}


// to get all  books added by user
exports.getAllUserBookController = async(req,res)=>{
    const email = req.payload
    console.log(email);
    
    try{
        const allUserBook = await books.find({userEmail:email})
        res.status(200).json(allUserBook)

    }catch(err){
        res.status(500).json(err)
    }
}


// to get all  books brought by user
exports.getAllUserBroughtBookController = async(req,res)=>{
    const email = req.payload
    console.log(email);
    
    try{
        const allUserBroughtBook = await books.find({brought:email})
        res.status(200).json(allUserBroughtBook)

    }catch(err){
        res.status(500).json(err)
    }
}

//to delete a user book
exports.deleteAUserBookController = async (req, res) => {
    const { id } = req.params
    console.log(id);

    try {
        await books.findByIdAndDelete({ _id: id })
        res.status(200).json('delete successfull')
    } catch (error) {
        res.status(500).json(error)
    }

}


//to make payment
exports.makePaymentController = async (req, res) => {
    const {bookDetails} = req.body
    const email = req.payload
    try{
        const bookUpdate = await books.findByIdAndUpdate({_id:bookDetails._id},{
            title:bookDetails.title,
            author:bookDetails.author,
            noOfPages:bookDetails.noOfPages,
            imageUrl:bookDetails.imageUrl,
            price:bookDetails.price,
            dPrice:bookDetails.dPrice,
            abstract:bookDetails.abstract,
            publisher:bookDetails.publisher,
            language:bookDetails.language,
            isbn:bookDetails.isbn,
            category:bookDetails.category,
            uploadImg:bookDetails.uploadImg,
            status:"sold",
            userEmail:bookDetails.userEmail,
            brought:email
        },{new:true})

        const line_item =[{
            price_data:{
                currency:"usd",
                product_data:{
                    name:bookDetails.title,
                    description:`${bookDetails.author} | ${bookDetails.publisher}`,
                    images:[bookDetails.imageUrl],
                    metadata:{
                        title:bookDetails.title,
                        author:bookDetails.author,
                        noOfPages:`${bookDetails.noOfPages}`,
                        imageUrl:bookDetails.imageUrl,
                        price:`${bookDetails.price}`,
                        dPrice:`${bookDetails.dPrice}`,
                        abstract:bookDetails.abstract.slice(0,20),
                        publisher:bookDetails.publisher,
                        language:bookDetails.language,
                        isbn:bookDetails.isbn,
                        category:bookDetails.category,
                        // uploadImg:bookDetails.uploadImg,
                        status:"sold",
                        userEmail:bookDetails.userEmail,
                        brought:email
                    }
                },
                unit_amount: Math.round(bookDetails.dPrice*100) // cents
            },
            quantity:1
        }]
        // create stripe checkout session
        const session = await stripe.checkout.sessions.create({
            // purchased using card
            payment_method_types:["card"],
            // details of product that is purchased
            line_items: line_item,
            // make payment
            mode:"payment",
            // if payment success- url to shown
            success_url:"https://bookstore-frontend-gray.vercel.app/payment-success",
            // if payment failed- url to shown
            cancel_url:"https://bookstore-frontend-gray.vercel.app/payment-error"
            });
            console.log(session);

            res.status(200).json({ url: session.url })
            

    }catch(err){
        res.status(500).json(err)
    }

}

// ................ADMIN..................................

// admin all books
exports.getAllBookAdminController = async(req,res)=>{
    try{
        const allBooks = await books.find()
        res.status(200).json(allBooks)

    }catch(err){
        res.status(500).json(err)
    }
}

// to approve book
exports.approveBookController = async(req,res)=>{
    const { _id, title, author, noOfPages, imageUrl,price,dPrice,abstract,publisher,language,isbn,category,uploadImg,status,userEmail,brought} = req.body

    console.log(  _id, title, author, noOfPages, imageUrl,price,dPrice,abstract,publisher,language,isbn,category,uploadImg,status,userEmail,brought);
    
    try{
        const existingBook = await books.findByIdAndUpdate({_id},{  _id, title, author, noOfPages, imageUrl,price,dPrice,abstract,publisher,language,isbn,category,uploadImg,status:'approved',userEmail,brought},{new:true})

        // await existingBook.save()
          res.status(200).json(existingBook)

    }catch(err){
        res.status(500).json(err)
    }
}




