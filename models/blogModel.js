const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        unique:true,
        required:true
    },
    slug:{
        type:String,
        unique:true,
        index:true
    },
    body:{
        type:{},
        min:200,
        max:2000000
    },
    excerpt:{
        type:String,
        max:1000
    },
    mtitle:{ //meta title for SEO
        type:String
    },
    mdesc:{ // meta description for SEO
        type:String
    },
    about:{
        type:String
    },
    role:{
        type:Number,
        default:0
    },
    photo:{
        data:Buffer,
        contentType:String
    },
    categories:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    }],
    tags:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Tag'
    }],
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},
    {timestamps:true}
);


module.exports = mongoose.model("Blog",blogSchema,"Blog");