const express=require("express");
const router=express.Router();
const mongoose=require("mongoose")
const {Account}=require("../db/db");
const {authMiddleware}=require("../middleware/authMiddleware")
const z=require("zod")

router.get("/balance",authMiddleware,async (req, res)=>{

const account=await Account.findOne({
    userId: req.userId
})
const balance=account.balance
return res.status(200).json({
    balance: balance
})
})

const validEntry=z.object({
    amount:z.number().positive(),
    to:z.string()

})
router.post("/transfer", authMiddleware, async(req, res)=>{
    const {success} =validEntry.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            msg:"invalid entry"
        })
       
    } 
    const session=await mongoose.startSession();
    session.startTransaction();
    const{amount, to}=req.body;

   
    const sender=await Account.findOne({
        userId:req.userId
    }).session(session)
    const senderBal=sender.balance;

    if(senderBal<amount){
        await session.abortTransaction();
        return res.status(400).json({
            msg:"insufficient balance"
        })
    }

    const receiver=await Account.findOne({
        userId:to
    }).session(session)
  
    if(!receiver){
        await session.abortTransaction();
        return res.status(400).json({
            msg:"invalid account"
        })
    }
    await Account.updateOne(
        {userId:req.userId}, {$inc:{balance: -amount}}
    ).session(session)

    await Account.updateOne(
        {userId:to}, {$inc:{balance: amount}}
    ).session(session)

    await session.commitTransaction();
    res.status(200).json({
        msg: "Transaction Successful"
    })
})



module.exports=router;


