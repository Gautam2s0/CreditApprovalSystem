const express = require("express");
const { UserEligibility } = require("../Models/CheckEligibility");
const { LoanModel } = require("../Models/loan");
const { UserModel } = require("../Models/users");

const UserEligibilityRouter = express.Router();

UserEligibilityRouter.post("/check-eligibility", async (req, res) => {
  const { customer_id, loan_amount, interest_rate, tenure } = req.body;

  try {
    let credit = 0;
    let currentLoan = 0;
    let currentEMIs = 0;
    let approved_limit = 0;
    let unpaidAmount = 0;

    const user = await UserModel.find({ customer_id });
    const userLoan = await LoanModel.find({ customer_id });

    approved_limit = user[0].approved_limit;

    userLoan.map((el) => {
      currentLoan += el.loan_amount;
      unpaidAmount += el.monthly_payment * (el.tenure - el.EMIs_paid_on_Time);
      if (el.tenure > el.EMIs_paid_on_Time) {
        currentEMIs += el.monthly_payment;
      }
    });

    if (approved_limit <= currentLoan) {
      credit = 0;
    }

    credit = Math.ceil(
      ((approved_limit - unpaidAmount) / approved_limit) * 100
    );

    const loanApproval = approveLoan(credit);

    const responseBody = {
      customer_id,
      approval: loanApproval.approval,
      interest_rate: interest_rate,
      corrected_interest_rate: loanApproval.interestRate,
      tenure,
      monthly_installment: Math.ceil(
        (loan_amount * (1 + loanApproval.interestRate / 100)) / tenure
      ),
    };

    const fi = await UserEligibility.findOne({ customer_id });
    if (fi) {
      await UserEligibility.findOneAndUpdate(responseBody);
    }

    console.log({ fi });

    // console.log({userLoan})
    res.status(200).send(responseBody);
  } catch (err) {
    res.status(400).send(err);
  }
});

// /create-loan

UserEligibilityRouter.post("/create-loan", async (req, res) => {
  const { customer_id, loan_amount, interest_rate, tenure } = req.body;

  try {
    let credit = 0;
    let currentLoan = 0;
    let currentEMIs = 0;
    let approved_limit = 0;
    let unpaidAmount = 0;
    let start_date = 0;
    let end_date = null;
    let loan_id = 0;
    let monthly_payment = 0;
    let EMIs_paid_on_Time = 0;

    const user = await UserModel.find({ customer_id });
    const userLoan = await LoanModel.find({ customer_id });

    approved_limit = user[0].approved_limit;

    userLoan.map((el) => {
      currentLoan += el.loan_amount;
      unpaidAmount += el.monthly_payment * (el.tenure - el.EMIs_paid_on_Time);
      if (el.tenure > el.EMIs_paid_on_Time) {
        currentEMIs += el.monthly_payment;
      }
    });

    if (approved_limit <= currentLoan) {
      credit = 0;
    }

    credit = Math.ceil(
      ((approved_limit - unpaidAmount) / approved_limit) * 100
    );

    const loanApproval = approveLoan(credit);
    if (loanApproval.approval) {
      let n = Math.floor(Math.random() * 10000 + 1);
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDay();

      let m = tenure % 12;
      let y = Math.floor(tenure / 12);
      let m1 = m + month;

      monthly_payment = Math.ceil(
        (loan_amount * (1 + loanApproval.interestRate / 100)) / tenure
      );

      start_date = `${month}/02/${year}`;

      if (m1 > 12) {
        month = m1 % 12;
        year += 1;
      }
      year += y;

      end_date = `${month}/02/${year}`;
      loan_id = n;

      let data = {
        customer_id,
        loan_id,
        loan_amount,
        tenure,
        interest_rate,
        monthly_payment,
        EMIs_paid_on_Time,
        start_date,
        end_date,
      };

      const fi = await UserEligibility.findOne({ customer_id });
      if (fi) {
        await UserEligibility.findOneAndUpdate(responseBody);
      } else {
        const newloan=new LoanModel(data)
        await newloan.save();
      }

      return res.status(200).send({
        customer_id,
        loan_id,
        loan_amount,
        monthly_payment,
      });
    } 
    else {
      return res.status(201).send(
        {
        customer_id,
        loan_id,
        message: "You are not eligible for loan",
        loan_amount,
        monthly_payment,
      }
      );
    }
   
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = {
  UserEligibilityRouter,
};

const approveLoan = (creditScore) => {
  if (creditScore > 50) {
    return { approval: true, interestRate: 10 };
  } else if (50 >= creditScore && creditScore > 30) {
    return { approval: true, interestRate: 12 };
  } else if (30 >= creditScore && creditScore > 10) {
    return { approval: true, interestRate: 16 };
  } else {
    return { approval: false };
  }
};
