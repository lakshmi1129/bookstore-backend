// import the express
const express = require('express')
// import usercontroller
const userController = require('./controllers/userController')

// import bookcontroller
const bookController = require('./controllers/bookController')

// import jobcontroller
const jobController = require('./controllers/jobController')

// import appController
const appController = require('./controllers/appController')

// import jwt middleware
const jwtMiddleware = require('./middlewares/jwtMiddleware')

// import multerconfig
const multerConfig = require('./middlewares/multerMiddleware')
const jwtAdminMiddleware = require('./middlewares/jwtAdminMiddleware')
const pdfmulterConfig = require('./middlewares/pdfMulterMiddleware')




// instance
const route = new express.Router()

// path for register
route.post('/register',userController.registerController)

// path for login
route.post('/login',userController.loginController)

// path for googlelogin
route.post('/google-login',userController.googleLoginController)


// path to all home books
route.get('/all-home-books',bookController.getHomeBookController)


// ..................user.......................

// path for add books
route.post('/add-book',jwtMiddleware,multerConfig.array('uploadedimages',3),bookController.addBookController)


// path get all books
route.get('/all-books',jwtMiddleware,bookController.getAllBookController)


// path to view a book
route.get('/view-book/:id',bookController.getABookController)

// path to get all jobs
route.get('/all-jobs',jobController.getAllJobsController)

// path to add aapplication
route.post('/apply-job',jwtMiddleware,pdfmulterConfig.single("resume"), appController.addApplicationController)

// path to update user profile
route.put('/user-profile-update',jwtMiddleware,multerConfig.single('profile'), userController.editUserProfileController)

// path to get all juser books
route.get('/user-books',jwtMiddleware,bookController.getAllUserBookController)
// path to get all brought books
route.get('/user-brought-books',jwtMiddleware,bookController.getAllUserBroughtBookController)

//path to delete user books 
route.delete('/delete-user-books/:id', bookController.deleteAUserBookController)


//path to make payment
route.put('/make-payment', jwtMiddleware, bookController.makePaymentController)



// ...................ADMIN.....................

// path for all books in admin
route.get('/admin-all-books',jwtAdminMiddleware,bookController.getAllBookAdminController)

// path to approve a book
route.put('/approve-book',jwtAdminMiddleware,bookController.approveBookController)


// path for all users in admin
route.get('/all-users',jwtAdminMiddleware,userController.getAllUserController)


// path to add new job
route.post('/add-job',jobController.addJobController)

// path to delete a job
route.get('/delete-job/:id',jobController.deleteAJobController)

// path to get all Applications
route.get('/all-application',appController.getAllApplicationController)


// path to update admin profile
route.put('/admin-profile-update',jwtAdminMiddleware,multerConfig.single('profile'), userController.editAdminProfileController)




// routes export
module.exports = route