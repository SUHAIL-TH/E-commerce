const productHelper=require("../model/helpers/product-helpers")
var db=require('../confi/connection');
var collection=require('../confi/collections')
const userHelpers = require("../model/helpers/user-helpers");
const usermanagementHelper=require('../model/helpers/usermanagmentHelper');
const categoryHelper=require("../model/helpers/category-helper")
const { response } = require("express");
const verifyLogin=require('../middlewares/sessions');
const orderHelper = require("../model/helpers/orderHelper");


module.exports={

    getlogin:(req,res)=>{
        res.render('admin/login') 
    },
    postlogin:async (req,res)=>{
        
        try {
            const email=req.body.email;
            const password=req.body.password;
            const admin= await db.get().collection('admin').findOne()
           
            if (admin){
                if(email==admin.email && password==admin.password){
                    req.session.logedIn=true;
                    req.session.admin=admin;
                    console.log("admin login");
                    res.render("admin/home" ,{admin:true,admin})

                }else{
                   
                    
                    res.render('admin/login',{loginErr:'invalid username OR password '})
                    console.log('Admin invalid username or password');
                    

                }
            }else{
                res.render('admin/login',{loginErr:'invalid email'
            })
               
               
            }
            
        } catch (error) {
            console.log(error);
            
        }
        
        
    },
    getaddproduct:(req,res)=>{
        // categoryHelper.getallcategory().then((categorys))

        res.render('admin/addproduct',{admin:true})

    },
    postaddproduct:(req,res)=>{
        console.log(req.body);
        console.log(req.files.Image)
        productHelper.addProduct(req.body,(id)=>{
    
            let image=req.files.Image
            
            
            image.mv('./public/img/product-images/'+id+'.jpg',(err,done)=>{
                if(!err){
                    res.render('admin/addproduct' ,{admin:true})

                }else{
                    console.log(err)
                }

            })
           
        })

    },
    getviewproduct:(req,res)=>{
        productHelper.getAllproducts().then((product)=>{
          
            res.render('admin/viewproduct',{product,admin:true})

        })
        
      
    },
    getviewusers:(req,res)=>{
        userHelpers.getAllusers().then((users)=>{
            res.render('admin/viewusers',{users,admin:true})
            
        })
        
    },
    getadminhome:(req,res)=>{
        res.render('admin/home',{admin:true})
    },
    
    blockuser:(req,res)=>{ 
        let userId=req.params.id
        usermanagementHelper.userblock(userId).then((response)=>{
           
            
            res.redirect("/admin/viewusers")

        })
    },
    unblockuser:(req,res)=>{
        const userId=req.params.id
        console.log(userId);
        usermanagementHelper.userunblock(userId).then((response)=>{
            res.redirect('/admin/viewusers')
        })
    },
    
    deleteproduct:(req,res)=>{
        const proid=req.params.id
        console.log(proid);
        productHelper.deleteproduct(proid).then((response)=>{
            res.redirect("/admin/viewproduct")
            
        })
    },

    viewcategory:(req,res)=>{
        categoryHelper.getallcategory().then((categorys)=>{
            res.render("admin/viewcategory",{categorys,admin:true})
            
        })
    },

    addcategory:(req,res)=>{
        res.render("admin/addcategory",{admin:true})
    },

    postaddcategory:(req,res)=>{


        categoryHelper.addcategory(req.body).then((response)=>{
            console.log(response)
            if(response){}
            res.redirect('/admin/addcategory')
        })
    },
    deletecategory:(req,res)=>{
        let catid=req.params.id
        console.log(catid );
        categoryHelper.deletcategory(catid).then((response))
        res.redirect('/admin/viewcategory')

    },
    backaddcategory:(req,res)=>{
        res.redirect("/admin/viewcategory")
    },
    adminlogout:(req,res)=>{
     
        res.redirect("/admin")
    },
    editproduct:async(req,res)=>{
        let id=req.params.id
        console.log(id);
        
        let product=await productHelper.getproductdetails(id)
        // console.log(product);
        res.render("admin/editproduct",{admin:true,product,id})
    },
    
    addeditproduct:(req,res)=>{
        let id=req.params.id;
        productHelper.updateproduct(req.params.id,req.body).then(()=>{
            res.redirect("/admin/viewproduct")
            if(req.files.Image){
                let image=req.files.Image
            
            
            image.mv('./public/img/product-images/'+id+'.jpg')

            }
        })

    },
    orderlist:async(req,res)=>{
        
        await orderHelper.allorders().then((orders)=>{
           

            res.render('admin/orderlist',{orders,admin:true})
            
        })

       
    },
    cancelorder:async(req,res)=>{
        try {
           const ordId=req.params.id
           await orderHelper.cancelorder(ordId).then((response)=>{
            res.redirect('/admin/orderlist')
           })

            
        } catch (error) {
            res.render('admin/404')
            
        }
       
    },
    updateorderstatus:async(req,res)=>{
        try {
            let id=req.params.id 
            await orderHelper.allorders().then((orders)=>{ 
                console.log(orders);
                 res.render('admin/statusupdate',{admin:true,orders,id})
             

            })
            
            
           
            
        } catch (error) {
            res.render('admin/404')
            
        }
    },
    postorderstatus:async(req,res)=>{
        try {
            
            console.log(req.params.id);
            console.log(req.body);

            await orderHelper.updateorderstatus(req.params.id,req.body).then(()=>{
                  res.redirect('/admin/orderlist')
            

            })
          
            
        } catch (error) { 
            res.render('admin/404')
            
        }

    }
 
    

    

}