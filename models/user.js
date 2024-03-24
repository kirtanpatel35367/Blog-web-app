const {createHmac, randomBytes} = require('node:crypto');
const {createTokenForUser} = require('../services/authentication')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageURL:{
        type:String,
        default:'C:/Summer Vaction/Node.js/Node Project/Blogging web app/public/images/user.png'
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER",
    },
},
    { timestamps: true }
);

userSchema.pre('save',function(next){
    const user = this;
    if(!user.isModified("password")) return; 
    //It will Check If User Password is Modifide or Not, if it is not Modified So No Need to Hashing So Simply It Will Return

    const salt =randomBytes(16).toString();
    const hashpassword = createHmac("sha256",salt)
    .update(user.password)
    .digest("hex")  

    this.salt = salt;
    this.password = hashpassword;

    next();
})


userSchema.static('MatchPasswordAndGenerateToken',async function(email,password){
    const user = await this.findOne({email});
    if(!user) throw new Error('User Not Found!!');

    const salt =user.salt;
    const hashpassword = user.password;
    
    const userProvideHash = createHmac("sha256",salt)
    .update(password)
    .digest("hex")
    
    if(hashpassword!==userProvideHash) throw new Error('Incorrect Password!!');
    const token = createTokenForUser(user)
    return token
})

const User = mongoose.model('user',userSchema);
module.exports = User;