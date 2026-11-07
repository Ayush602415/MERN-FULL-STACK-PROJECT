const { verifyAccessToken } = require("../utils/token.utils");

const authenticate =  (req, res, next) => {
    const authHeader = req.headers.authorization.split(" ")[1];
    if (!authHeader) {
        return res.status(401).json({
            message: "Authorization header missing"
        });
    }

    const decoded = verifyAccessToken(authHeader);
    if (!decoded) {
        return res.status(401).json({
            message: "Invalid access token"
        });
    }

    req.userId = decoded.userId;

    next();
}

module.exports = authenticate;
