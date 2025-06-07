const { validateToken } = require("../services/authentication")
const JWT= require("jsonwebtoken")
const User=require("../models/user")
const secret="$uperMan@123"
function checkforauthentication(cookieName){
return(req,res,next)=>{
    const tokenCookieValue=req.cookies[cookieName]
    if(!tokenCookieValue){
        req.user = null; 
            return next();
    }
    try {
        const userPayload=validateToken(tokenCookieValue)
        req.user=userPayload
        next()
    } catch (error) {}
}
}
const Usercheck = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/user/signin");
  }
  try {
    const decoded = JWT.verify(token, secret);
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.redirect("/user/signin");
    }
    next();
  } catch (err) {
    console.log(err)
    return res.redirect("/user/signin");
  }
};
module.exports={
    checkforauthentication,Usercheck
}