const config = require("../config/config");
const jwt = require("jsonwebtoken")

const generateAccessToken = (userId)=>{
    // Implementation for generating access token
    return jwt.sign({userId},config.ACCESS_SECRET_KEY,{expiresIn: '15m'});

}

const generateRefreshToken = (userId)=>{
    return jwt.sign({userId},config.REFRESH_SECRET_KEY,{expiresIn: "30d"})
}

const verifyRefreshToken = (token)=>{
    return jwt.verify(token , config.REFRESH_SECRET_KEY)
}

const verifyAccessToken  = (token)=>{
    return jwt.verify(token , config.ACCESS_SECRET_KEY)
}

module.exports = {generateAccessToken , generateRefreshToken , verifyAccessToken , verifyRefreshToken}