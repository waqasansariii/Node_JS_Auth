const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    console.log("Raw Authorization Header:", authHeader); // <--- check this

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access Denied. No Token Provided",
        });
    }

    try {
        const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log("Decoded Token Info:", decodedTokenInfo);
        req.userInfo = decodedTokenInfo;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid Token",
        });
    }   
};

module.exports = authMiddleware;
