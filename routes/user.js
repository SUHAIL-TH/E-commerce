const express = require('express');
const userrouter = express.Router();
const userController = require('../controllers/userController');

userrouter.use(express.urlencoded({ extended: false }));
userrouter.use(express.json());




userrouter.get('/', userController.getHome);
userrouter.get('/userlogin',userController.getLogin);
userrouter.get('/usersignup',userController.getSignup);
userrouter.post('/usersignup',userController.postsignup)
userrouter.post('/postotp',userController.postotp)
userrouter.post('/userlogin',userController.postlogin)
userrouter.get('/usercart',userController.getusercart)
userrouter.get('/userlogout',userController.getuserlogout)
userrouter.get('/home',userController.getuserhome)
userrouter.get('/contact',userController.getcontact)



 


module.exports = userrouter;