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
adminrouter.get('/addproduct',adminController.getaddproduct)
adminrouter.post('/addproduct',adminController.postaddproduct)
adminrouter.get('/deleteproduct/:id',adminController.deleteproduct)
adminrouter.get('/viewproduct',adminController.getviewproduct)
adminrouter.get("/editproduct/:id",adminController.editproduct)
adminrouter.post('/editproduct/:id',adminController.addeditproduct)

// **********************************usermangement*****************************
adminrouter.get('/viewusers',adminController.getviewusers)
adminrouter.get('/blockuser/:id',adminController.blockuser)
adminrouter.get('/unblockuser/:id',adminController.unblockuser)


// **************************************category**********************************
adminrouter.get('/viewcategory',adminController.viewcategory)
adminrouter.get("/addcategory",adminController.addcategory)
adminrouter.post("/addcategory",adminController.postaddcategory)
adminrouter.get("/deletecategory/:id",adminController.deletecategory)
adminrouter.get("/backaddcategory",adminController.backaddcategory)



module.exports = adminrouter;