const jwt = require('jsonwebtoken');
require('dotenv').config()

const generateToken = data => {
    const token = jwt.sign(data, process.env.SECRET);
    return token;
}

const protect = async (req,res,next) => {
    try{
    let {authorization} = req.headers
    console.log('headers')
    let bearer = authorization.split(" ")
    console.log(bearer)

    let decoded = await jwt.verify(bearer[1],process.env.SECRET); 
    req.payload = decoded  
    next()
    } catch(error){
        console.error('Token input is wrong or not valid', error.message)
        return res.status(404).json({"status":404, "message": "Need valid token!"})
    }

}


module.exports = {
    generateToken,
    protect
}