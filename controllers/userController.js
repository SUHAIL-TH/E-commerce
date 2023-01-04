const { response } = require("express")
const mailer=require("../middlewares/otpValidation")
const productHelper=require("../model/helpers/product-helpers")
const userHelper=require('../model/helpers/user-helpers')
const cartHelper=require("../model/helpers/cartHelper")
var db=require('../confi/connection');
var collection=require('../confi/collections');
const { ObjectId } = require("mongodb");






module.exports={
    getHome:async(req,res)=>{
        let user=req.session.user
        
        let cartcount=0
        if(user){
            cartcount=await cartHelper.getcartcount(req.session.user._id)
        }
        productHelper.getAllproducts().then((product)=>{
            

            if(user){
                customer=true;
                res.render('user/index',{product,user:true,customer,user,cartcount})
                

            }else { 
                
                res.render('user/index',{product,user:true,cartcount})
            }
        
        })
       
    },
    getLogin:(req,res)=>{
        try {
            if(req.session.logedIn){
                res.redirect('/')
            }else{
                res.render('user/login',{"loginErr":req.session.loginErr})
                req.session.loginErr=false;
    
            }
            
        } catch (error) {
            console.log(error);
            
        }
       
        
    },
    guestuser:(req,res)=>{
        res.render('user/login')
        
    },

    getSignup:(req,res)=>{
        
        res.render('user/signup')
    },

    // postsignup:(req,res)=>{
    //     userHelper.doSignup(req.body).then((response)=>{
    //         console.log(response)
    //         if(response){}
    //         res.render('user/otp') 
    //     })

    // },

    postsignup:async(req,res)=>{
        let verified=0;
        let state="active";
        const { Name, Email, Password ,Place} = req.body;
        // console.log(Email);
        let mailDetails={
            from:"eshoes518@gmail.com",
            to:Email,
            subject:"E-SHOES otp",
            html:`<p>YOUR OTP FOR REGISTRATION IN E-SHOES IS ${mailer.OTP}<P>`,
        };

        let user=await db.get().collection(collection.USER_COLLECTION).findOne({Email:Email})
        

        if(user){

            res.render('user/signup', { err_message: 'User Already Exist' });

        }else{
            mailer.mailTransporter.sendMail(mailDetails,function(err,data){
                if(err){
                    console.log(err);
                }else{
                    console.log("email sent successfull");
                    userHelper.doSignup(verified,Name,Email,Place,Password,state).then((response)=>{
                        console.log(response)
                        // if(response){}
                        req.session.logedIn=true;
                        req.session.user=response;

                        let userId=response.insertedId
                        // console.log(userId);
                        res.render('user/otp',{userId})

                     })
                    
                }
            });
           

        }

        

    },
    postotp:async(req,res)=>{
        console.log(req.session.user);
        
        console.log(req.body);
        if(mailer.OTP==req.body.otp){
            
                       //evide ee bug fix akkan und verifed one akkanam*******************************************************
        //    console.log(userId);
        //     userHelper.updateverified(userId).then((response)=>{
                // res.redirect("/userlogin")
                res.render("user/login")

            // })
            
            

        }else{
            res.render("user/otp",{otpp_erro:"invalid otp"})
        }


    },

    postlogin:(req,res)=>{
        
        
        userHelper.doLogin(req.body).then((response=>{
            if(response.status){
                req.session.logedIn=true;
                req.session.user=response.user;
                
                res.redirect('/')

            }else{
                req.session.loginErr='invalid username or paswword OR you are blocked';
                res.redirect('/userlogin') 
            }
        }))
        
        

    },

   

    getuserlogout:async(req,res)=>{
        await req.session.destroy()
       
        res.redirect('/')
        
    },
    getuserhome:(req,res)=>{
        res.redirect('/')
    },
    getcontact:(req,res)=>{
        let user= req.session.user
        if(user){
            customer=true
            res.render('user/contact',{user:true,customer,user})
        }else{
            res.render('user/contact',{user:true})

        }
       
    },
    productview:async(req,res)=>{
        let user= req.session.user
        let id=req.params.id
       
        
        
        
       

        let product=await productHelper.viewproduct(id)
        
        
        
        if(user){
            customer=true
            let userid=req.session.user._id
            console.log(userid);
            res.render('user/productview',{user:true,customer,user,product,id,userid})
        }else{
            
            res.render('user/productview',{user:true,product,id})

        }
        

       

        
    },
    getusercart:async(req,res)=>{
        let user=req.session.user 
        if(user){

            customer=true
            let totalValue=await cartHelper.getTotalamount(req.session.user._id)
            let  products=await cartHelper.getCartproducts(req.session.user._id)
            console.log(products);
            
            
            res.render('user/cart',{user:true,customer,user,products,totalValue})
        }else{
            res.render('user/cart',{user:true,})

        }
       
    },
    addtocart:(req,res)=>{

    //    user=req.session.user._id
    //     console.log(user);
    //     console.log(req.params.id);
    let user=req.session.user
   
    if(user){
        customer=true
        cartHelper.addtocart(req.params.id,req.session.user._id).then(()=>{
            res.json({status:true})
            
            // res.redirect('/usercart')
        
        })
       
    }else{
        res.redirect('/usercart',{user:true})

    }
       
       

        
    },
    changeproductquantity:(req,res,next)=>{
        console.log(req.body);
       
        cartHelper.changecartproductquantity(req.body).then(async(response)=>{
             response.total=await cartHelper.getTotalamount(req.body.user)

            res.json(response)

        })

    },
    removecartproduct:(req,res,next)=>{
        console.log(req.body);
        cartHelper.removecartproduct(req.body).then((response)=>{
            res.json(response)

        })
    },
    placeorder:async(req,res)=>{
        
        let  user=req.session.user
       let total=await cartHelper.getTotalamount(req.session.user._id)
     
        if(user){
            customer=true
            res.render("user/checkout",{user:true, customer,user,total})
           
        }
        
    },
    placeorderpost:async(req,res)=>{
        console.log(req.body.userId);
        let products=await cartHelper.getcartproductlist(req.body.userId)
         let totalPrice=await cartHelper.getTotalamount(req.body.userId)
        cartHelper.placeOrder(req.body,products,totalPrice).then((response)=>{
            res.json({status:true})

        })
        console.log(req.body);
       
    
    }
    
       
    




}