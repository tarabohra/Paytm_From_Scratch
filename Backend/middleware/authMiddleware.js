const jwt=require("jsonwebtoken");
const {JWT_SECRET}=require("../config/config");
const {User}=require("../db/db")
const authMiddleware=(req, res, next)=>{
const token=req.headers.authorization

if(!token || !token.startsWith('Bearer')){
    return res.status(403).json({
        msg:"invalid user"
    })
}
else{
    actualToken=token.split(' ')[1];
    try {
        const decoded=jwt.verify(actualToken, JWT_SECRET)
        req.userId=decoded.userId
        next();
    } catch (error) {
        return res.status(403).json({
            error,
            msg:"cannot verify"
        })
    }
}
}
module.exports={
    authMiddleware
}