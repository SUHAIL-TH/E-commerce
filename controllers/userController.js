const { response } = require("express")
const { OTP, mailTransporter } = require("../middlewares/otpValidation")
const productHelper=require("../model/helpers/product-helpers")
const userHelper=require('../model/helpers/user-helpers')





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

    postsignup:(req,res)=>{
        let verified=0;
        let state="active";
        const { Name, Email, Password ,Place} = req.body;
        // console.log(Email);
        let mailDetails={
            from:"suhailth313@gmail.com",
            to:Email,
            subject:"E-SHOES",
            html:`<p>YOUR OTP FOR REGISTRATION IN E-SHOES IS ${OTP}<P>`,
        };
        mailTransporter.sendMail(mailDetails,function(err,data){
            if(err){
                console.log(err);
            }else{
                console.log("email sent successfull");
            }
        });
        userHelper.doSignup(verified,Name,Email,Place,Password,state).then((response)=>{
            console.log(response)
            if(response){}
            res.render('user/otp')
        })

    },
    postotp:(req,res)=>{


    },

    postlogin:(req,res)=>{
        
        userHelper.doLogin(req.body).then((response=>{
            if(response.status){
                req.session.logedIn=true;
                req.session.user=response.user;
                res.redirect('/')

            }else{
                req.session.loginErr='invalid username or paswword or you are blocked';
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
       
        res.redirect('/userlogin')
        
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