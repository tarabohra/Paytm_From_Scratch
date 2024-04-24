const mongoose=require ("mongoose");
mongoose.connect("mongodb+srv://tarabohra1993:mongodbstar%40100@cluster0.nisqcf4.mongodb.net/Own_Paytm");

const userSchema={
    username:{
        type: String,
        maxlength:14,
        minlength:3,
        required: true        
    },
    password:{
        type: String,
        maxlength:14,
        minlength:3,
        required: true 
    },
    firstName:{
        type: String,
        maxlength:14,
        minlength:3,
        required: true 
    },
    lastName:{
        type: String,
        maxlength:14,
        minlength:3,
        required: true 
    }
}
const User=mongoose.model("User", userSchema);
const accountSchema={
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true, 
            },
    balance:{
        type: Number,
        required:true, 
            }
                    }


const Account=mongoose.model("Account", accountSchema);

module.exports={
    User,
    Account
}
