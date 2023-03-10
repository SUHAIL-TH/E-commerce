const express = require('express');
const userrouter = express.Router();
const userController = require('../controllers/userController');
var verifyLogin=require('../middlewares/sessions')

userrouter.use(express.urlencoded({ extended: false }));
userrouter.use(express.json());




userrouter.get('/', userController.getHome);

userrouter.get('/userlogin',userController.getLogin);

userrouter.get('/usersignup',userController.getSignup);

userrouter.post('/usersignup',userController.postsignup)

userrouter.post('/postotp',userController.postotp)

userrouter.post('/userlogin',userController.postlogin)

userrouter.get('/usercart', verifyLogin.verifyLoginUser, userController.getusercart)

userrouter.get('/userlogout',userController.getuserlogout)

userrouter.get('/home',userController.getuserhome)

userrouter.get('/contact',userController.getcontact)

userrouter.get("/productview/:id",userController.productview)

userrouter.get("/addtocart/:id",verifyLogin.verifyLoginUser, userController.addtocart)

userrouter.get('/guestuser',userController.guestuser)

userrouter.post('/changeproductquantity',userController.changeproductquantity)

userrouter.post('/removecartproduct',userController.removecartproduct)

userrouter.get("/placeorder",verifyLogin.verifyLoginUser,userController.placeorder)

userrouter.post("/placeorder",verifyLogin.verifyLoginUser,userController.placeorderpost)

userrouter.get('/codorderplacedsuccess',verifyLogin.verifyLoginUser,userController.codorderplacedsuccess)

userrouter.get('/orderlist',verifyLogin.verifyLoginUser,userController.orderlist)

userrouter.get('/view-order-product/:id',verifyLogin.verifyLoginUser,userController.vieworderproduct)

userrouter.get('/aboutus',userController.aboutus)

userrouter.get('/cancelorder/:id',verifyLogin.verifyLoginUser,userController.cancelOrder)



 


module.exports = userrouter;