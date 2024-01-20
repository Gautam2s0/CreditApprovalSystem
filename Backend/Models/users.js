const mongoose=require("mongoose");
const User=mongoose.Schema({
    customer_id:{type:Number,require:true},
    first_name:{type:String ,require:true},
    last_name:{type:String ,require:true},
    age:{type:Number ,require:true},
    phone_number:{type:Number ,require:true},
    monthly_salary:{type:Number ,require:true},
    approved_limit:{type:Number ,require:true},
   
},
{timestamp:true}
)
const UserModel=mongoose.model("customer",User);

module.exports={
  UserModel
}