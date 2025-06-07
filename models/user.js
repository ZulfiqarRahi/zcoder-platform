const mongoose=require("mongoose")
const{createHmac,randomBytes}=require("crypto")
const { createtokenForUser } = require("../services/authentication")
const userSchema=new mongoose.Schema({
fullname:{
    type:String,
    required:true,
},
email:{
    type:String,
    required:true,
    unique:true,
},
salt:{
type:String,
},
password:{
    type:String,
    required:true,
},
profileImage:{
type:String,
default:"/images/OIP.webp",
},
role:{
type:String,
enum:["USER","ADMIN"],
default:"USER",
}
},{timestamps:true})
userSchema.pre("save",function(next){
    const user=this
    if(!user.isDirectModified("password")) return;

    const salt=randomBytes(16).toString();
    const hashPassword=createHmac("sha256",salt).update(user.password).digest("hex")
 this.salt=salt;
 this.password=hashPassword;

 next()
})
userSchema.static("matchPasswordAndGeneratetoken",async function(email,password){
    const user= await this.findOne({email})
    if(!user) throw new Error ("User not found")
    const salt=user.salt
    const hashPassword=user.password
    const userProvideHash=createHmac("sha256",salt).update(password).digest("hex")
    if(hashPassword!==userProvideHash)throw new Error ("Incorrect Password")

    const token=createtokenForUser(user)
    return token;
})
const User=mongoose.model("user",userSchema)
module.exports=User