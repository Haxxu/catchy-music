const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(400).send({ message: 'Access denied, no token provided' });
    }

    jwt.verify(token, process.env.JWT_PRIVATE_KEY, (error, validToken) => {
        if (error) {
            return res.status(400).send({ message: 'Invalid token' });
        } else {
            if (validToken.type !== 'artist') {
                return res.status(403).send({ message: "You don't have permission to access this content" });
            }
            req.user = validToken;
            next();
        }
    });
};
