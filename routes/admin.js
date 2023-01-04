const express = require('express');
const adminrouter = express.Router();
const adminController = require('../controllers/adminController')
const producteHlper=require("../model/helpers/product-helpers")
const verifyLogin=require("../middlewares/sessions")
adminrouter.use(express.urlencoded({ extended: false }));
adminrouter.use(express.json())



adminrouter.get('/',adminController.getlogin)

adminrouter.post('/adminhome',adminController.postlogin)

adminrouter.get('/adminhome',adminController.getadminhome)

adminrouter.get("/adminlogout",adminController.adminlogout)


// ****************************product*****************************************
adminrouter.get('/addproduct',verifyLogin.verifyLoginAdmin, adminController.getaddproduct)

adminrouter.post('/addproduct',verifyLogin.verifyLoginAdmin,adminController.postaddproduct)

adminrouter.get('/deleteproduct/:id',verifyLogin.verifyLoginAdmin,adminController.deleteproduct) 

adminrouter.get('/viewproduct',verifyLogin.verifyLoginAdmin,adminController.getviewproduct)

adminrouter.get("/editproduct/:id",verifyLogin.verifyLoginAdmin,adminController.editproduct)

adminrouter.post('/editproduct/:id',verifyLogin.verifyLoginAdmin,adminController.addeditproduct)

// **********************************usermangement*****************************
adminrouter.get('/viewusers',verifyLogin.verifyLoginAdmin,adminController.getviewusers)

adminrouter.get('/blockuser/:id',verifyLogin.verifyLoginAdmin,adminController.blockuser)

adminrouter.get('/unblockuser/:id',verifyLogin.verifyLoginAdmin,adminController.unblockuser)


// **************************************category**********************************
adminrouter.get('/viewcategory',verifyLogin.verifyLoginAdmin,adminController.viewcategory)

adminrouter.get("/addcategory",verifyLogin.verifyLoginAdmin,adminController.addcategory)

adminrouter.post("/addcategory",verifyLogin.verifyLoginAdmin,adminController.postaddcategory)

adminrouter.get("/deletecategory/:id",verifyLogin.verifyLoginAdmin,adminController.deletecategory)

adminrouter.get("/backaddcategory",verifyLogin.verifyLoginAdmin,adminController.backaddcategory)



module.exports = adminrouter;