const mongoose = require('mongoose')
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        trim:true,
        unique:true,
        required:true,
        index:true,
        lowercase:true
    },
    name:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        trim:true,
        unique:true,
        required:true,
        lowercase:true
    },
    profile:{
        type:String,
        required:true
    },
    hashed_password:{
        type:String,
        required:true
    },
    salt:{
        type:String
    },
    about:{
        type:String
    },
    role:{
        type:Number,
        trim:true
    },
    photo:{
        data:Buffer,
        contentType:String
    },
    resetPasswordLink:{
        data:String,
        default:""
    }
},
    {timestamps:true}
);

//password virtual fields for hashing
userSchema.virtual('password')
    .set(function(password){
        //creating a temporary variable called _password
        this._password = password

        //gererating salt
        this.salt = this.makeSalt()

        //encrypting password
        this.hashed_password = this.encryptPassword(password)

    })

    .get(function(){
        return this._password
    })

//password encrypting method
userSchema.methods.encryptPassword = function(password){
    if(!password) return ''
    try{
        return crypto.createHmac('sha1',this.salt).update(password).digest('hex');
    }catch(err){
        return ""
    }
}

//salt generating method
userSchema.methods.makeSalt = function(){
    return Math.round(new Date().valueOf()*Math.random()) + '';
}

//authenticate method for user signin
userSchema.methods.authenticate = function(plainText){
    return this.encryptPassword(plainText) === this.hashed_password
}

module.exports = mongoose.model("User",userSchema,"User");