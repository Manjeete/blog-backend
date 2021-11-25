

//profile
exports.profile = (req,res) =>{
    req.profile.hash_password = undefined
    return res.status(200).json({
        status:true,
        profile:req.profile
    })
}