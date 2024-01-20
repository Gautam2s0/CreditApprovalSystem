const express = require("express");
const { UserEligibility } = require("../Models/CheckEligibility");
const { LoanModel } = require("../Models/loan");
const { UserModel } = require("../Models/users");

const loanRouter = express.Router();

loanRouter.get("/view-loan/:loan_id", async (req, res) => {
  const { loan_id } = req.params;

  try {
    //const loan = await UserModel.find({ customer_id });
    const userLoan = await LoanModel.findOne({ loan_id });

    const user = await UserModel.findOne({ customer_id: userLoan.customer_id });

    let result = {
      loan_id: userLoan.loan_id,
      customer: user,
      loan_amount: userLoan.loan_amount,
      interest_rate: userLoan.interest_rate,
      monthly_installment: userLoan.monthly_payment,
      tenure: userLoan.tenure,
    };

    res.status(200).send(result);
  } catch (err) {
    res.status(400).send(err);
  }
});


loanRouter.post("/make-payment/:customer_id/:loan_id", async (req, res) => {
    
    try {
      const userLoan = await LoanModel.findOne(req.params);
      if(userLoan){
        userLoan.EMIs_paid_on_Time=userLoan.EMIs_paid_on_Time+1;
        await LoanModel.findOneAndUpdate(req.params,{$inc:{EMIs_paid_on_Time:1}});
      }
       
  
      res.status(200).send({msg:"payment successfull",remaining_EMIs:userLoan.tenure-userLoan.EMIs_paid_on_Time});
    } catch (err) {
      res.status(400).send(err);
    }
  });

  loanRouter.post("/view-statement/:customer_id/:loan_id", async (req, res) => {
    
    try {
      const userLoan = await LoanModel.findOne(req.params);
      if(userLoan){
       
        return res.status(200).send({
            customer_id:userLoan.customer_id,
            loan_id:userLoan.loan_id,
            principal:userLoan.loan_amount,
            interest_rate:userLoan.interest_rate,
            Amount_paid:userLoan.monthly_payment*userLoan.EMIs_paid_on_Time,
            monthly_installment:userLoan.monthly_payment,
            repayments_left:userLoan.tenure-userLoan.EMIs_paid_on_Time
        });
      }
      else{
       return res.status(201).send("No data found");
      }
     
    } catch (err) {
      res.status(400).send(err);
    }
  });

  
// /create-loan

module.exports = {
  loanRouter,
};
