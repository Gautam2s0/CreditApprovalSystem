const mongoose=require("mongoose")

require("dotenv").config()



const connection=mongoose.connect("mongodb+srv://gautam:gautam@cluster0.81k23.mongodb.net/CreditApprovalSystem?retryWrites=true&w=majority")
//console.log({mongoURL:process.env.mongoURL})

module.exports={
    connection
}




