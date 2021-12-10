const User = require("../models/userModel");
const shortId = require("shortid");
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const Blog = require("../models/blogModel");

//user signup
exports.signup = async(req,res) =>{
    try{
        const {name,email,password} = req.body
        const user = await User.findOne({email:email});
        if(user){
            return res.status(400).json({
                status:false,
                msg:"Email is taken"
            })
        }

        const username = shortId.generate()
        const profile = `${process.env.CLIENT_URL}/profile/${username}`

        const newUser = await User.create({name,email,password,profile,username});

        res.status(200).json({
            status:true,
            user:newUser,
            msg:"Signup success."
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            status:false,
            msg:err.message

        })
    }
}

//user signin
exports.signin = async(req,res) =>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email:email})
        if(!user){
            return res.status(400).json({
                status:false,
                msg:"Please signup first."
            })
        }
        console.log(user)
        if(!user.authenticate(password)){
            return res.status(400).json({
                status:false,
                msg:"Email or password does not match."
            })
        }

        //generating jwt token
        const token = jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'})
        res.cookie('token',token,{expiresIn:'1d'})

        return res.status(200).json({
            status:true,
            user:user,
            token
        })

    }catch(err){
        console.log(err)
        return res.status(500).json({
            status:false,
            msg:err.message
        })
    }
}

//user signout
exports.signout = (req,res) =>{
    res.clearCookie("token")
    res.status(200).json({
        status:true,
        msg:"Signout success."
    })
}

//protect routes
exports.requireSignin = expressJwt({
    secret:process.env.JWT_SECRET,
    algorithms: ['HS256']
});


//validateJWT
// exports.validateJWT = (req,res,next) =>{
//     const token = req.headers.authorization
//     if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
//         jwt.verify(req.headers.authorization.split(' ')[1],process.env.JWT_SECRET,(err,data) =>{
//             if(err){
//                 return res.status(403).json({
//                     status:false,
//                     msg:"Invalid token"
//                 })
//             }
//             req.user=data;
//             next();
//         })
//     }else{
//         return res.status(401).json({
//             status:false,
//             msg:"Token missing"
//         });
//     }
// }


exports.authMiddleware = async(req,res,next) =>{
    try{
        const user = await User.findById(req.user._id)
        if(!user){
            return res.status(404).json({
                status:false,
                msg:"User not found."
            })
        }
        req.profile = user;
        next();

    }catch(err){
        console.log(err)
        return res.status(500).json({
            status:false,
            msg:err.message
        })
    }
}

exports.adminMiddleware = async(req,res,next) =>{
    try{
        const adminUser = await User.findById(req.user._id)
        if(!adminUser){
            return res.status(404).json({
                status:false,
                msg:"User not found."
            })
        }
        if(adminUser.role !==1){
            return res.status(401).json({
                status:false,
                msg:"You are not admin."
            })
        }
        req.profile = adminUser;
        next();

    }catch(err){
        console.log(err)
        return res.status(500).json({
            status:false,
            msg:err.message
        })
    }
}


exports.canUpdateDeleteBlog = async (req,res, next) =>{
    const slug = req.params.slug.toLowerCase()

    let blog = await Blog.findOne({slug})
    if(!blog){
        return res.status(404).json({
            status:false,
            msg:"Blog not found."
        })
    }

    let authorizedUser = blog.postedBy._id.toString() === req.profile._id.toString()

    if(!authorizedUser){
        return res.status(400).json({
            status:false,
            msg:"You are not authorized"
        })
    }
    next();
}