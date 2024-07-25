// middleware for authorization
// this is a style of exporting used here allows allows exportation direct


const jwt = require('jsonwebtoken');
const jwtPrivateKey = process.env.SCHOOL_JWT_PRIVATE_KEY;


module.exports = function(req, res, next){
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access Denied. No token provided');

    try{
        const decoded = jwt.verify(token, jwtPrivateKey);
        req.user=decoded;
        next();
    }
    catch(ex){
        res.status(400).send('Invalid token');
    }
}