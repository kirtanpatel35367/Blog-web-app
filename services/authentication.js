const JWT = require('jsonwebtoken')

const secret = "uservalidator";

function createTokenForUser(user){
    const payload={
        _id :user._id,
        name:user.fullname,
        email:user.email,
        profileImageURL:user.profileImageURL,
        role:user.role,

    };

    const token = JWT.sign(payload,secret)
    return token;
}


function validatetoken(token){
    const payload = JWT.verify(token,secret);
    return payload
}

module.exports = {
    createTokenForUser,
    validatetoken
}