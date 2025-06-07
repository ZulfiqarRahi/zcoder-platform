const JWT= require("jsonwebtoken")
const secret="$uperMan@123"
function createtokenForUser(user){
    const payload={
        name:user.fullname,
        _id:user._id,
        email:user.email,
        profileimageURL:user.profileImage,
        role:user.role
    }
    const token=JWT.sign(payload,secret)
    return token
}
function validateToken(token){
    const payload=JWT.verify(token,secret)
    return payload
}
module.exports={
    createtokenForUser,validateToken
}