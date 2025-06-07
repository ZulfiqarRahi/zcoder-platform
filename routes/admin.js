const {Router}=require("express")
const Question=require("../models/question")
const {accessAdmin}=require("../middleware/adminacess")
const router=Router()
router.use(accessAdmin);
router.get("/",(req,res)=>{
    res.render("admin")
})

router.post("/",async(req,res)=>{
     const{Title,Body,Output}=req.body
   await Question.create({
    Title,
    Body,
    Output
   })
   res.redirect("/admin")
})

module.exports=router