const express=require("express");
const cors=require("cors");
const port =process.env.port||3022;
const {connection}=require("./Configs/db");
require("dotenv").config();
const {UserRouter}=require("./Routes/users");
const {UserEligibilityRouter}=require("./Routes/checkEligibility")
const {loanRouter}=require("./Routes/loan")




const app=express()

app.use(cors());
app.use(express.json())
app.use("/",UserEligibilityRouter)

app.get("/",(req,res)=>{
    res.send("Credit Approval System home page")
})

app.use("/",UserRouter);
app.use("/",loanRouter)
 
app.listen(port,async()=>{
    try{

        await connection;
        console.log("connected to db")
    }
    catch(err){
        console.log(err)

    }
    
    console.log(`server is running at port ${port}`)

})



