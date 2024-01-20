const express = require("express");
const { UserModel } = require("../Models/users");

const UserRouter = express.Router();

UserRouter.post("/register", async (req, res) => {
  let { monthly_salary, customer_id, phone_number } = req.body;
  let approved_limit = monthly_salary * 36;
  //req.body.approved_limit=approved_limit;
  console.log({monthly_salary,approved_limit})

  try {
    const alluser = await UserModel.find();
    console.log("alluser", alluser.length);
    const id = alluser.length;
    const alreadyUser = await UserModel.findOne({ phone_number });
    if (alreadyUser) {
      res.status(201).send({msg:"User already exist, please login"});
    } else {
      const user = new UserModel({
        ...req.body,
        approved_limit,
        customer_id: alluser.length + 1,
      });
      await user.save();

      res
        .status(200)
        .send({ msg: "User profile created successfully..!!", user });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = {
  UserRouter,
};
