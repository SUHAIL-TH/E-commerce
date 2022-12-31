const { resolve } = require('path')
const db = require('../../confi/connection')
const collection = require('../../confi/collections')
const { response } = require('express')
const { error } = require('console')
const ObjectId=require('mongodb').ObjectId

module.exports={
    userblock:(userId)=>{
        
        return new Promise(async(resolve,reject)=>{
            
            await db.get().collection(collection.USER_COLLECTION).updateOne({_id:ObjectId(userId)},
            {
                $set:{
                    state:"blocked"
                }
            }
            ).then((response)=>{
                console.log(response );
                resolve(response)
               
            })
        })

    },
     userunblock:(userId)=>{
        console.log(userId);
        return new Promise(async(resolve,reject)=>{
           await db.get().collection(collection.USER_COLLECTION).updateOne({_id:ObjectId(userId)},{
                $set:{
                    state:"active"
                }
            }).then((response)=>{
                console.log(response );
                resolve(response)

            })
        })
    }

}