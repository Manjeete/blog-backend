const express = require("express")
const morgan = require("morgan")
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
require('dotenv').config()

//Routes import
const authRouter = require("./routes/authRoute");
const blogRouter = require("./routes/blog");

//app 
const app = express()

//DB connection
mongoose.connect(process.env.DB_URI,{useNewUrlParser:true})
.then(() => console.log('Database connected successfully...'))

//middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())

//cors
app.use(cors())

//Route middleware
app.use("/api/v1/auth",authRouter);
app.use("/api/v1",blogRouter);



const port = process.env.PORT || 8000;

app.listen(port,() =>{
    console.log(`Server is running on port ${port}`);
})