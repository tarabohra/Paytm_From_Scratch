const express=require("express");
const router=express.Router();
const {z}=require("zod");
const { User, Account }=require("../db/db");
const {JWT_SECRET} = require("../config/config");
const jwt=require("jsonwebtoken")
const {authMiddleware}=require("../middleware/authMiddleware")
const validValue=z.object({
    username: z.string(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string()
})

router.post("/signup", async (req, res)=>{
   const {success}= validValue.safeParse(req.body);
   if(!success){
    return res.status(411).json({
        msg:"Invalid entry"
    })
    }
    const existingUser= await User.findOne({
        username: req.body.username
    })
    if(existingUser){
        return res.json({
            msg:"user already exist"
        })
    }
    
    const user=await User.create({
        username:req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    })
    const userId=user._id;
    await Account.create({
        userId:userId,
        balance:1+Math.random()*1000
    })
    const token=jwt.sign({userId}, JWT_SECRET);

    return res.json({
        msg:"User successfully created",
        token: token
    })
    
})
router.post("/signin", async (req, res)=>{
 const validUser=await User.findOne({
    username:req.body.username
 })

 if(validUser){
    const userId=validUser._id
    const token=jwt.sign({userId},JWT_SECRET)
    return res.json({
        msg:"successfully logged in",
        token:token
    })    
 }
 else{
    return res.json({
        msg:"not a valid user"
    })
 }
})

const updateDataVerify=z.object({
    password:z.string().optional(),
    firstName:z.string().optional(),
    lastName:z.string().optional()
    
})

router.post("/",authMiddleware,async (req, res)=>{
  
    const userId=req.userId
    const updateData=req.body
    const {success}=updateDataVerify.safeParse(updateData)
   
    if(!success){
       return res.status(411).json({
        msg:"Error while updating information"
       }) 
    }
    
    else{
         await User.updateOne(
            {userId},
            updateData
        )
        console.log(userId)
        return res.status(200).json({
            msg: "Updated successfully"
        })
    }
   

})

router.get("/bulk", async (req, res)=>{
    const filterData=req.query.filter
    const users=await User.find({
        $or:[
            {firstName: {
           "$regex": filterData}
            },
            {lastName:{
                "$regex":filterData}
            }
        ]
    })
    return res.json({
        user: users.map(user=>({
            username:user.username,
            firstName:user.firstName,
            lastName:user.lastName,
            userId:user._id
        }))
    })
})

module.exports= router;