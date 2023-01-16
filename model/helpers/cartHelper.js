var db = require('../../confi/connection');
var collection = require('../../confi/collections');
const { resolve } = require('path');
const { ObjectId } = require('mongodb');
const { response } = require('express');
const { LOADIPHLPAPI } = require('dns');

module.exports = {
    addtocart: (proId, userId) => {
        let proObj = {
            item: ObjectId(proId),
            quantity: 1

        }
        return new Promise(async (resolve, reject) => {
            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: ObjectId(userId) })
            if (userCart) {
                let proExit = userCart.products.findIndex(product => product.item == proId)
                console.log(proExit);
                if (proExit != -1) {
                    db.get().collection(collection.CART_COLLECTION)
                        .updateOne({ user: ObjectId(userId), 'products.item': ObjectId(proId), },
                            {
                                $inc: { 'products.$.quantity': 1 }
                            }
                        ).then(() => {
                            resolve()
                        })

                } else {
                    db.get().collection(collection.CART_COLLECTION)
                        .updateOne({ user: ObjectId(userId) },
                            {

                                $push: { products: proObj }

                            }
                        ).then((response) => {
                            resolve()
                        })

                }


            } else {
                let cartObj = {
                    user: ObjectId(userId),
                    products: [proObj]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response) => {
                    resolve()
                })
            }
        })

    },
    // addtocart:(proId,userId)=>{
    //     return new Promise(async(resolve,reject)=>{
    //         let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectId(userId)})
    //         if(userCart){
    //              db.get().collection(collection.CART_COLLECTION)
    //              .updateOne({user:ObjectId(userId)},{

    //                     $push:{
    //                         products:ObjectId(proId)

    //                 }
    //              }).then((response)=>{
    //                 resolve()
    //              })

    //         }else{
    //             let cartObj={
    //                 user:ObjectId(userId),
    //                 products:[ObjectId(proId)]
    //             }
    //             db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
    //                 resolve()
    //             })
    //         }
    //     })

    // },
    // getCartproducts:(userId)=>{
    //     return new Promise(async(resolve,reject)=>{
    //         let cartItems=await db.get().collection(collection.CART_COLLECTION).aggregate([
    //             {
    //                 $match:{user:ObjectId(userId)}
    //             },
    //             {
    //                 $lookup:{
    //                     from:collection.PRODUCT_COLLECTION,
    //                     let:{prodList:'$products'},
    //                     pipeline:[
    //                         {
    //                             $match:{
    //                                 $expr:{
    //                                     $in:['$_id',"$$prodList"]
    //                                 }
    //                             }
    //                         }

    //                     ],
    //                     as:'cartItems'
    //                 }
    //             }
    //         ]).toArray()
    //         resolve(cartItems[0].cartItems)

    //     })
    // },
    getCartproducts: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match: { user: ObjectId(userId) }
                }, {
                    $unwind: '$products'
                }, {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                }, {
                    $lookup: {
                        from: collection.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1,
                        quantity: 1,
                        product: { $arrayElemAt: ['$product', 0] }

                    }
                }

            ]).toArray()

            resolve(cartItems)

        })
    },
    getcartcount: (userId) => {
        return new Promise(async (resolve, reject) => {

            let count = 0;
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: ObjectId(userId) })


            if (cart) {
                count = cart.products.length

            }
            resolve(count)

        })

    },
    changecartproductquantity: (details) => {

        details.count = parseInt(details.count)
        details.quantity = parseInt(details.quantity)

        return new Promise((resolve, reject) => {
            if (details.count == -1 && details.quantity == 1) {
                db.get().collection(collection.CART_COLLECTION)
                    .updateOne({ _id: ObjectId(details.cart) },
                        {
                            $pull: { products: { item: ObjectId(details.product) } }
                        }).then((response) => {
                            resolve({ removeProduct: true })
                        })

            } else {
                db.get().collection(collection.CART_COLLECTION)
                    .updateOne({ _id: ObjectId(details.cart), 'products.item': ObjectId(details.product) },
                        {
                            $inc: { 'products.$.quantity': details.count }
                        }
                    ).then((response) => {
                        resolve({ status: true })
                    })

            }


        })

    },
    removecartproduct: (details) => {
        // console.log(details);
        // console.log(details.product);
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CART_COLLECTION)
                .updateOne({ _id: ObjectId(details.cart) },
                    {
                        $pull: { products: { item: ObjectId(details.product) } }
                    }).then((response) => {
                        resolve({ removeProduct: true })
                    })

        })
    },
    getTotalamount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let usercart=await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectId(userId)})
            if (usercart.products.length>0) {
                let total = await db.get().collection(collection.CART_COLLECTION).aggregate([
                    {
                        $match: { user: ObjectId(userId) }
                    }, {
                        $unwind: '$products'
                    }, {
                        $project: {
                            item: '$products.item',
                            quantity: '$products.quantity'
                        }
                    }, {
                        $lookup: {
                            from: collection.PRODUCT_COLLECTION,
                            localField: 'item',
                            foreignField: '_id',
                            as: 'product'
                        }
                    },
                    {
                        $project: {
                            item: 1,
                            quantity: 1,
                            product: { $arrayElemAt: ['$product', 0] }
    
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: {
                                $sum: {
                                    $multiply: [{
                                        $toInt: '$quantity'
                                    },
                                    {
                                        $toInt: {
                                            "$replaceAll": {
                                                "input": "$product.Rate",
                                                "find": ",",
                                                "replacement": ""
                                            }
                                        }
                                    }]
                                }
                            }
                        }
                    }
                ]).toArray()
    
    
                resolve(total[0].total)
                
            } else {
                response.total=0
                resolve(response.total)
                
            }
            

        })

    },
    placeOrder:(order,products,total)=>{
        return new Promise((resolve,reject)=>{

            // console.log(order,products,total);
            let status=order['payment-method']==='COD'?'placed':'pending'
            let orderObj={
                deliveryDetails:{
                    name:order.name,
                    address:order.address, 
                    mobile:order.mobile,
                    place:order.place,
                    pincode:order.pincode,
                    total:total,
                    date:new Date().toJSON().slice(0,10)

                },
                userId:ObjectId(order.userId),
                paymentMethode:order['payment-method'],
                products:products,
                status:status
            }
            db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then((response)=>{
                // db.get().collection(collection.CART_COLLECTION).deleteOne({user:ObjectId(order.userId)})
                resolve()
            })

        })
    },
    getcartproductlist:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectId(userId)})
           
            resolve(cart.products)

        })
    }


}