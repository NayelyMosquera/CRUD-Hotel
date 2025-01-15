import jwt from 'jsonwebtoken';

const checkAuth = async (req, res, next) => {
    try {
        const token = (req.headers.authorization || req.headers.authtoken || '').split('Bearer ')[1];

        if (!token) {
            return res.status(400).json({ status: 400, message: 'Auth header or token is missing' });
        }

        const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ status: 401, message: 'Token invalid' });
    }
};
export default checkAuth;