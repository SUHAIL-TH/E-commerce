var db=require('../../confi/connection');
var collection=require('../../confi/collections');
const { resolve } = require('path');
const { ObjectId } = require('mongodb');
const { response } = require('express');

module.exports={
    addtocart:(proId,userId)=>{
        return new Promise(async(resolve,reject)=>{
            let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectId(userId)})
            if(userCart){
                 db.get().collection(collection.CART_COLLECTION)
                 .updateOne({user:ObjectId(userId)},{
                    
                        $push:{
                            products:ObjectId(proId)
                        
                    }
                 }).then((response)=>{
                    resolve()
                 })

            }else{
                let cartObj={
                    user:ObjectId(userId),
                    products:[ObjectId(proId)]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                    resolve()
                })
            }
        })

    },
    getCartproducts:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cartItems=await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:ObjectId(userId)}
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        let:{prodList:'$products'},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $in:['$_id',"$$prodList"]
                                    }
                                }
                            }

                        ],
                        as:'cartItems'
                    }
                }
            ]).toArray()
            resolve(cartItems[0].cartItems)

        })
    },
    getcartcount:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            
            let count=0;
            let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectId(userId)})
            
            
            if(cart){
                count=cart.products.length
                
            }
            resolve(count)

        })

    }

}