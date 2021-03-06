const express = require("express")
const morgan = require("morgan")
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
require('dotenv').config()

//Routes import
const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRoute");
const categoryRouter = require("./routes/categoryRoute");
const tagRouter = require("./routes/tagRoute");
const blogRouter = require("./routes/blogRoute");
const formRouter = require("./routes/formRoute");

//app 
const app = express()

//DB connection
mongoose.connect(process.env.DB_URI,{useNewUrlParser:true})
.then(() => console.log('Database connected successfully...'))

console.log(process.env.DB_URI)

//middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())

//cors
app.use(cors())

app.get("/",(req,res) =>{
    res.status(200).json({
        status:true,
        msg:"Server is running."
    })
})

//Route middleware
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/blog",blogRouter);
app.use("/api/v1/user",userRouter);
app.use("/api/v1/category",categoryRouter);
app.use("/api/v1/tag",tagRouter);
app.use("/api/v1",formRouter);



const port = process.env.PORT || 8000;

app.listen(port,() =>{
    console.log(`Server is running on port ${port}`);
})