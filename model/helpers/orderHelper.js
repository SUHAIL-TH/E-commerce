var db = require('../../confi/connection');
var collection = require('../../confi/collections');
const { ObjectId } = require('mongodb');
const { response } = require('express');
const { resolve } = require('path');



module.exports={
    getuserorders:(userId)=>{
        return new Promise(async(resolve,reject)=>{

            let orders=await db.get().collection(collection.ORDER_COLLECTION).find({userId:ObjectId(userId)}).toArray()
            
            resolve(orders)

        })

    },
    getorderproduct:(orderId)=>{
        return new Promise(async(resolve,reject)=>{
            let orderItems = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                {
                    $match: {_id: ObjectId(orderId) }
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

            resolve(orderItems)


        })

    },
    cancelOrder:(ordId)=>{
        // console.log(ordId);
        return new Promise(async(resolve,reject)=>{

            await db.get().collection(collection.ORDER_COLLECTION).deleteOne({_id:ObjectId(ordId)}).then((response)=>{
                console.log(response);
                resolve(response)
            })

        })

    },

    // **************************************Admin actions***************************

     allorders:()=>{
        return new Promise(async(resolve,reject)=>{
            let orders=await db.get().collection(collection.ORDER_COLLECTION).find().toArray()
            // console.log(orders);

            resolve(orders)
            
        })

    },
    cancelorder:(ordId)=>{
        return new Promise(async(resolve,reject)=>{
            await db.get().collection(collection.ORDER_COLLECTION).deleteOne({_id:ObjectId(ordId)}).then((response)=>{
                resolve(response)
            })

        })
    },
    updateorderstatus:(ordId,update)=>{
        
        return new Promise(async(resolve,reject)=>{
            await db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:ObjectId(ordId)},{$set:{status:update.status}}).then((response)=>{
                resolve()
            })



        })
    }

}