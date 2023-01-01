const { response } = require("express")
const mailer=require("../middlewares/otpValidation")
const productHelper=require("../model/helpers/product-helpers")
const userHelper=require('../model/helpers/user-helpers')
var db=require('../confi/connection');
var collection=require('../confi/collections')





module.exports={
    getHome:(req,res)=>{
        let user=req.session.user
        
        productHelper.getAllproducts().then((product)=>{
            

            if(user){
                customer=true;
                
                res.render('user/index',{product,user:true,customer,user})
                

            }else {
                 
                res.render('user/index',{product,user:true})
    

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
                        if(response){}
                        let userId=response.insertedId
                        // console.log(userId);
                        res.render('user/otp',{userId})

                     })
                    
                }
            });
           

        }

        

    },
    postotp:async(req,res)=>{
        
        console.log(req.body);
        if(mailer.OTP==req.body.otp){
            
                       //evide ee bug fix akkan und*******************************************************
        //    console.log(userId);
        //     userHelper.updateverified(userId).then((response)=>{
                res.redirect("/userlogin")

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

    getusercart:(req,res)=>{
        let user=req.session.user
        if(user){
            customer=true
            res.render('user/cart',{user:true,customer,user})
        }else{
            res.render('user/cart',{user:true})

        }
       
    },

    getuserlogout:(req,res)=>{
         req.session.destroy()
       
        res.redirect('/')
        
    },
    getuserhome:(req,res)=>{
        res.redirect('/')
    },
    getcontact:(req,res)=>{
        let user=req.session.user
        if(user){
            customer=true
            res.render('user/contact',{user:true,customer,user})
        }else{
            res.render('user/contact',{user:true})

        }
       
    },
       
    




}