require('dotenv').config();
const express= require("express")
const http=require("http");
const path=require("path")
const {Server}=require("socket.io")
const mongoose=require("mongoose")
const cookieparser=require("cookie-parser")
 
const userRoute=require("./routes/user")
const updateRoute=require("./routes/update")
const {  checkforauthentication } = require("./middleware/authentication")
const chatRoute=require("./routes/chat")
const editorRoute = require("./routes/console");
const compileRoute = require("./routes/compile");
const adminRoutes=require("./routes/admin")
const bookmarkRoutes=require("./routes/bookmark")
const app=express()
const server=http.createServer(app)
const io=new Server(server)

require("./chat/socket")(io)
const PORT=8000
mongoose.connect("mongodb://localhost:27017/zcode").then(e=>console.log("Mongodb connected"))
app.set("view engine", "ejs")
app.set("views",path.resolve("./views"))

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(cookieparser())
app.use(checkforauthentication("token"))
app.use("/user",userRoute)
app.use("/update",updateRoute)
app.use("/chat", chatRoute)
app.use("/compile", compileRoute);
app.use("/console", editorRoute);  
app.use("/admin", adminRoutes)
app.use("/bookmarks",bookmarkRoutes)
app.use(express.static(path.resolve("./public")));

app.get("/home",(req,res)=>{
    res.render("home",{
        user:req.user
    
    })
})
server.listen(PORT,()=>console.log(`Server Started at PORT:${PORT}`))