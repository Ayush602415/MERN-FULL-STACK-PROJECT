const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")
const config = require("../config/config")
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../utils/token.utils")

const isProduction = process.env.NODE_ENV === "production"
const refreshCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000
}

const registerController = async(req,res)=>{
    const {name , email , password} = req.body
    const existingUser = await userModel.findOne({email})
    if(existingUser){
        return res.status(409).json({
            message: "Email Already Exist"
        })
    }
    const hashedPassword = await bcrypt.hash(password , 12)
    const newUser = await userModel.create({
        name,
        email,
        password: hashedPassword
    })

    const accessToken = generateAccessToken(newUser._id)
    const refreshToken = generateRefreshToken(newUser._id)

    newUser.refreshToken = refreshToken

    await newUser.save()

    res.cookie("refreshToken", refreshToken, refreshCookieOptions)

    return res.status(200).json({
        message: "User Registered Successfully",
        data:{
            user:{
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        },
        accessToken
    })
}

const loginController = async(req,res)=>{
    const {email , password} = req.body
    const user = await userModel.findOne({email}).select("+password")
    if(!user){
        return res.status(404).json({
            message: "User Not Found"
        })

    }
    const isPasswordCorrect = await bcrypt.compare(password , user.password)

    if(!isPasswordCorrect){
        return res.status(401).json({
            message: "Invalid Email or Password"
        })
    }

    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken(user._id)

    user.refreshToken = refreshToken
    await user.save()

    res.cookie("refreshToken", refreshToken, refreshCookieOptions)

    return res.status(200).json({
        message: "User LoggedIn Successfully",
        data:{
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        },
        accessToken
    })
}

const meController = async(req,res)=>{
    const user = await userModel.findById(req.userId)
    if(!user){
        return res.status(404).json({
            message: "User Not Found"
        })
    }
    return res.status(200).json({
        message: "User Found",
        data:{
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                isVerified: user.isVerified
            }
        }
    })
}

const refreshController = async(req,res)=>{
    const oldrefreshToken = req.cookies.refreshToken
    if(!oldrefreshToken){
        return res.status(401).json({
            message: "Refresh Token Not Found"
        })
    }

    let decoded
    try {
        decoded = verifyRefreshToken(oldrefreshToken)
    } catch {
        return res.status(401).json({
            message: "Refresh token expired or invalid"
        })
    }
    const user = await userModel.findById(decoded.userId).select("+refreshToken")
    if(!user){
        return res.status(401).json({
            message: "Invalid Refresh Token"
        })
    }
    if(user.refreshToken != oldrefreshToken){
        return res.status(401).json({
            message: "Refresh Token Mismatch"
        })
    }

    const newaccessToken = generateAccessToken(user._id)
    const newrefreshToken = generateRefreshToken(user._id)

    user.refreshToken = newrefreshToken
    await user.save()

    res.cookie("refreshToken", newrefreshToken, refreshCookieOptions)

    return res.status(200).json({
            message: "Refresh Token rotated Successfully",
            success: true,
            accessToken: newaccessToken
        });
}

const logoutController = async(req,res)=>{
   const user = await userModel.findById(req.userId).select("+refreshToken")
   if(user){
    user.refreshToken = null
    await user.save()
   }
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax"
    })
    return res.status(200).json({
        message: "User Logged Out Successfully"
    })
}

const googleCallbackController = async(req,res)=>{
    const profile = req.user
    const email = profile.emails?.[0]?.value

    if(!email || profile._json?.email_verified !== true){
        return res.redirect(`${config.FRONTEND_URI}/login?google=failed`)
    }

    let user = await userModel.findOne({email})
    if(!user){
        user = await userModel.create({
            name: profile.displayName || email.split("@")[0],
            email,
            password: await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 12),
            avatar: profile.photos?.[0]?.value
        })
    }

    user.isVerified = true
    const refreshToken = generateRefreshToken(user._id)
    user.refreshToken = refreshToken
    await user.save()

    res.cookie("refreshToken", refreshToken, refreshCookieOptions)
    return res.redirect(`${config.FRONTEND_URI}/login?google=success`)
}

const allUsercontroller = async(req,res)=>{
    const users = await userModel.find()
    return res.status(200).json({
        message: "All User Fetched Successfully",
        data:{
            users
        }
    })
}

module.exports = {registerController , loginController , meController , refreshController , logoutController, googleCallbackController , allUsercontroller}