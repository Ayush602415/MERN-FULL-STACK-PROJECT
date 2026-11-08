const express = require("express")
const { registerValidator, loginValidator } = require("../validators/auth.validators")
const { registerController, loginController, meController, refreshController, logoutController, googleCallbackController, allUsercontroller } = require("../controllers/auth.controller")
const authenticate = require("../middleware/auth.middleware")
const passport = require("passport")
const config = require("../config/config")
require("../config/passport")

const router = express.Router()

router.post("/register",registerValidator,registerController)
router.post("/login",loginValidator,loginController)
router.get("/me",authenticate,meController)
router.post("/refresh",refreshController)
router.post("/logout",logoutController)
router.get("/google",passport.authenticate("google",{
    scope: ["profile","email"],
    session: false,
    prompt: "select_account"
}))
router.get("/google/callback",passport.authenticate("google",{
    session: false,
    failureRedirect: `${config.FRONTEND_URI}/login?google=failed`
}),googleCallbackController)
router.get("/allUsers",authenticate,allUsercontroller)

module.exports = router