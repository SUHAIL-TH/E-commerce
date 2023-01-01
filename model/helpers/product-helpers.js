var db=require('../../confi/connection');
var collection=require('../../confi/collections');
const { resolve } = require('path');
const { ObjectId } = require('mongodb');


module.exports={

      addProduct:(product,callback)=>{
        
        
        db.get().collection('product').insertOne(product).then((data)=>{
             console.log(data);
            
            
            callback(data.insertedId)
                       

        })

    },
    getAllproducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let product=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(product)
        })
    },
    deleteproduct:(proid)=>{
        return new Promise(async(resolve,reject)=>{
            await db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:ObjectId(proid)}).then((response)=>{
                console.log(response );
                resolve(response)

            })
        })
    }, 
    getproductdetails:(id)=>{
        return new Promise(async(resolve,reject)=>{
            await db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectId(id)}).then((product,id)=>{
                resolve(product,id);
            })
        })
    },
    updateproduct:(proId,prodetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION)
            .updateOne({_id:ObjectId(proId)},{$set:{
                product_name:prodetails.product_name,
                Category:prodetails.Category,
                Rate:prodetails.Rate,
                Discription:prodetails.Discription


            }}
            ).then((response)=>{
                resolve()
            })
        })
    }
}