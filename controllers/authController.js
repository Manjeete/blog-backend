exports.signup = (req,res) =>{
    const {name,email,password} = req.body
    res.status(200).json({
        status:true,
        name:name
    })
}