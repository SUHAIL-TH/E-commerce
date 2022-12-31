var db=require('../../confi/connection');
var collection=require('../../confi/collections');
const { resolve } = require('path');
const { ObjectId } = require('mongodb');
const { response } = require('express');

module.exports={
    addcategory:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            await db.get().collection(collection.CATEGORY_COLLECTION).insertOne(userData).then((data)=>{
            resolve(data)
            })
        })
    },
     getallcategory:()=>{

        return new Promise(async(resolve,reject)=>{
            let categorys=await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
            resolve(categorys)
        })
    },
    deletcategory:(catid)=>{
        return new Promise(async(resolve,reject)=>{
            await db.get().collection(collection .CATEGORY_COLLECTION).deleteOne({_id:ObjectId(catid)}).then((response)=>{
                console.log(response );
                resolve(response)

            })

        })
    }
    

}