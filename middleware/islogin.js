
const JWT = require('jsonwebtoken')

const JWT_SECRET = 'N@R^$!MH@'
const islogin = async(req,res,next)=>{
    try{
         const token = req.header('auth-token')
        if(!token)
        {
            return res.status(401).send({error:"Access Denied ,  No Tocken Found"})
        }
        try{
            const data =  JWT.verify(token , JWT_SECRET)
            req.user = data.user;
            console.log({user : data.user});
            next()
        }
        catch(e){
            
            return res.status(401).send({error:"Access Denied, Wrong Auth Tocken"})
        }
        
    }
    catch(e){
        return res.status(500).send({error : "Internal server eror" , why:e.message})
    }
}

module.exports = islogin;