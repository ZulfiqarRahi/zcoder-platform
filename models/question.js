const mongoose=require("mongoose")
// const{createHmac,randomBytes}=require("crypto")
// const { createtokenForUser } = require("../services/authentication")
const questionSchema=new mongoose.Schema({
Title:{
    type:String,
    required:true,
    unique:true,
},
Body:{
    type:String,
    required:true,
    },
Output:{
type:String,
 required:true,
},
bookmark: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
},
{timestamps:true})

const Question=mongoose.model("question",questionSchema)
module.exports=Question