const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Harryisgoodb$oy';

const fetchUser = (req,res,next) =>{
    const token = req.header('auth-token');
    if(!token) {
        res.status(401).json({type:'error',error: 'authentication token is required',code:401});
    }
    try {
        const data = jwt.verify(token,JWT_SECRET);
        req.user = data.user;
        if(req.user) {
            next();
        } else {
            res.status(401).json({error: 'authentication token not match',code:401});
        }
    } catch(error) {
        res.status(500).json({type:'error',error: error.message,code:500});
    }

}
module.exports = fetchUser;