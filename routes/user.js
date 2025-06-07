const {Router}=require("express")
const User=require("../models/user")
const {Usercheck}=require("../middleware/authentication")
const router=Router()
router.get("/signin",(req,res)=>{
    return res.render("signin")
})
router.get("/signup",(req,res)=>{
    return res.render("signup")
})
router.post("/signup",async(req,res)=>{
    const{fullname,email,password}=req.body
   await User.create({
    fullname,
    email,
    password,
})
return res.redirect("/user/signin")

})
router.post("/signin",async(req,res)=>{
   try {
     const{email,password}=req.body
   const token= await User.matchPasswordAndGeneratetoken(email,password)
   return res.cookie("token",token).redirect("/home")
   } catch (error) {
    res.render("signin",{
        error:"Incorrect Email or Password"
    })
   }
})
router.get("/logout",(req,res)=>{
    res.clearCookie("token").redirect("/home")
})
router.get("/profile",Usercheck,async(req,res)=>{
       res.render("profile",{
        user:req.user
    })
})


module.exports=router