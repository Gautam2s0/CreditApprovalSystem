const mongoose=require("mongoose");
const loan=mongoose.Schema({
    customer_id:{type:Number,require:true},
    loan_id:{type:Number ,require:true},
    loan_amount:{type:Number ,require:true},
    tenure:{type:Number ,require:true},
    interest_rate:{type:Number ,require:true},
    monthly_payment:{type:Number ,require:true},
    EMIs_paid_on_Time:{type:Number ,require:true},
    start_date:{type:Date ,require:true},
    end_date:{type:Date ,require:true},
   
},
{timestamp:false}
)
const LoanModel=mongoose.model("loan",loan);

module.exports={
  LoanModel
}