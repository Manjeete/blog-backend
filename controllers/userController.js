const User = require("../models/userModel");
const Blog = require("../models/blogModel");

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
