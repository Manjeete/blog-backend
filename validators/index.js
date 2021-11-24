const {validationResult} = require('express-validator')

//validation error message middleware
exports.runValidation = (req,res,next) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({ //status code 422 -> unprocessable entity
            status:false,
            error:errors.array()[0].msg
        })
    }
    next();
}
