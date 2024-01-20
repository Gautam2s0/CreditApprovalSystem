const mongoose = require("mongoose");
const Eligibility = mongoose.Schema(
  {
    customer_id: { type: Number, require: true },
    loan_amount: { type: Number, require: true },
    interest_rate: { type: Number, require: true },
    tenure: { type: Number, require: true },
  },
  { timestamp: true }
);
const UserEligibility = mongoose.model("eligibility", Eligibility);

module.exports = {
  UserEligibility,
};
