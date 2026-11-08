const dotenv = require("dotenv")
const path = require("path")
dotenv.config({ path: path.resolve(__dirname, "../../.env") })

const trimTrailingSlashes = (uri) => uri?.replace(/\/+$/, "")
const isRender = process.env.RENDER === "true" || Boolean(process.env.RENDER_EXTERNAL_URL)
const productionFrontendUri = trimTrailingSlashes(process.env.FRONTEND_URI)
const localFrontendUri = trimTrailingSlashes(process.env.LOCAL_FRONTEND_URI || "http://localhost:5173")
const frontendUri = isRender ? productionFrontendUri : localFrontendUri
const backendUri = trimTrailingSlashes(
    process.env.RENDER_EXTERNAL_URL ||
    (isRender ? "https://mern-full-stack-project-hgsr.onrender.com" : `http://localhost:${process.env.PORT || 3000}`)
)
const configuredGoogleCallbackUri = process.env.GOOGLE_CALLBACK_URI
const googleCallbackUri = isRender && configuredGoogleCallbackUri && !configuredGoogleCallbackUri.includes("localhost")
    ? configuredGoogleCallbackUri
    : `${backendUri}/api/auth/google/callback`

const config = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    FRONTEND_URI: frontendUri,
    FRONTEND_ORIGINS: [productionFrontendUri, localFrontendUri].filter(Boolean),
    ACCESS_SECRET_KEY: process.env.ACCESS_SECRET_KEY,
    REFRESH_SECRET_KEY: process.env.REFRESH_SECRET_KEY,
    REDIS_URL: process.env.REDIS_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URI: googleCallbackUri,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS
}

module.exports = config
