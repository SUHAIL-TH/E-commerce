var db=require('../../confi/connection');
var collection=require('../../confi/collections')
const bcrypt=require('bcrypt');



module.exports={
    doSignup:(
        verified,Name,Email,Place,Password,state 
    )=>{
        return new Promise(async(resolve,reject)=>{
            Password=await bcrypt.hash(Password,10)
            // console.log(Password);
            db.get().collection(collection.USER_COLLECTION).insertOne({verified,Name,Email,Place,Password,state}).then((data)=>{
                
                resolve(data)
                
                
                
            });
            

        });

    } ,
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            // let loginStatus=false
            let response={}
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
           
            if(user){
                if(user.state=="active"){
                    bcrypt.compare(userData.Password,user.Password).then((status)=>{
                        if(status){
                             
                            console.log("loginsucceSS");
                            response.user=user 
                            response.status=true
                            resolve(response)
                            
                         
                        }else {
                            console.log("login failed");
                            resolve({status:false})
                        }
                    })

                }else{
                    console.log("you are blocked");
                resolve({status:false})

                }
                

            }else{
                console.log("loginfailed");
                resolve({status:false})
                
            }
        })
    },
    getAllusers:()=>{
        return new Promise(async(resolve,reject)=>{
            let users=await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users)
        })
    },
    updateverified:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).updateOne({_id:userId},{$set:{verified:1}}).then((response) => {
                resolve(response);
              });
        })
    }
    
    
}