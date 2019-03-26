const jwt = require('jsonwebtoken')
const keys = require('/Users/kartikeya/Documents/Web-Development/Rest-Shop/config/keys')




module.exports = (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        // console.log(token);
        const decoded = jwt.verify(token, keys.privateKey.jwtKEY);
        req.userData = decoded;
        next();
    }catch(err){
        return res.status(401).json({
            message : 'Auth failed.'
        })
    }
}