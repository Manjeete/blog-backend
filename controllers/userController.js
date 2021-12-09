const User = require("../models/userModel");
const Blog = require("../models/blogModel");
const _ = require('lodash')
const formidable = require('formidable')
const fs = require('fs')

//profile
exports.profile = (req,res) =>{
    req.profile.hash_password = undefined
    return res.status(200).json({
        status:true,
        profile:req.profile
    })
}


//user public profile
exports.publicProfile = async(req,res) =>{
    try{
        const username = req.params.username
        
        let user = await User.findOne({username})
        if(!user){
            return res.status(404).json({
                status:false,
                msg:"User not found with this username."
            })
        }

        const blogs = await Blog.find({postedBy:user._id})
                        .populate('categories','_id name slug')
                        .populate('tags','_id name slug')
                        .populate('postedBy','_id name')
                        .limit(10)
                        .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')

        user.photo = undefined
        user.hash_password=undefined
        res.status(200).json({
            status:true,
            user,
            blogs
        })

    }catch(err){
        console.log(err)
        return res.status(500).json({
            status:false,
            msg:err.message 
        })
    }
}

//update user
exports.updateProfile = (req,res) =>{
    let form = new formidable.IncomingForm()
    form.keepExtension = true;
    form.parse(req,(err,fields,files) =>{
        if(err){
            return res.status(400).json({
                status:false,
                msg:"Photo could not be uploaded"
            })
        }
        let user = req.profile
        user = _.extend(user,fields)

        if(files.photo){
            if(files.photo.size > 10000000){
                return res.status(400).json({
                    status:false,
                    msg:"Image should be less than 1mb."
                })
            }
            user.photo.data = fs.readFileSync(files.photo.filepath)
            user.photo.contentType = files.photo.type
        }

        user.save((err,result) =>{
            if(err){
                return res.status(400).json({
                    status:false,
                    msg:errorHandler(err)
                })
            }
            user.hash_password = undefined
            res.status(200).json({
                status:true,
                profile:user
            })
        })
    })
}


//user photo
exports.userPhoto = (req,res) =>{
    const username = req.params.username;
    User.findOne({username}).exce((err,user) =>{
        if(err || !user){
            return res.status(400).json({
                status:false,
                msg:"User not found."
            });
        }
        if(user.photo.data){
            res.set('Content-Type',user.photo.contentType)
            return res.send(user.photo.data)
        }
    })
}