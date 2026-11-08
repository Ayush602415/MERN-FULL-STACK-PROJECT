const { verifyAccessToken } = require("../utils/token.utils");

const authenticate = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).json({
            message: "Authorization header missing"
        });
    }

    const token = authorization.match(/^Bearer\s+(\S+)$/i)?.[1];
    if (!token) {
        return res.status(401).json({
            message: "Invalid access token"
        });
    }

    let decoded;
    try {
        decoded = verifyAccessToken(token);
    } catch {
        return res.status(401).json({
            message: "Invalid access token"
        });
    }

    req.userId = decoded.userId;

    next();
}

module.exports = authenticate;
