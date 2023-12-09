const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { validationResult, body, } = require('express-validator')
const bcrypt = require('bcryptjs')
const JWT = require('jsonwebtoken')
const islogin = require('../middleware/islogin')
const JWT_SECRET = 'N@R^$!MH@'

// Creating a User
router.post('/signup', [
    body('name', "enter a Valid Name (atleast 3 charecters)").isLength({ min: 3 }),
    body('email', "enter a valid email").isEmail(),
    body('password', "enter a valid pasword").isLength({ min: 5 })
], async (req, res) => {

    // hashing password
    const salt = await bcrypt.genSalt(10)
    const secpass = await bcrypt.hash(req.body.password, salt)


    // checking for errors in user input
    const result = validationResult(req)
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() })
    }
    else {
        try {
            const user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secpass,

            })

            // json web token for confirming the user
            const sign = ({
                user: user.id
            })
            console.log(sign);
            const JWT_TOKEN = JWT.sign(sign, JWT_SECRET)//sign should be a json
            res.send(JWT_TOKEN)
            console.log(user);
        }
        catch (e) {
            if (e.code == 11000) {
                res.send({error : "This Email Already Exists! Login or Create New Account"})
            }
            else {
                res.send(e.message)
            }
        }

    }
})


// LOGIN or Authenticating USer

router.post('/login', [
    body('email', "enter a valid email").isEmail(),
    body('password', "enter a valid pasword").isLength({ min: 5 }).notEmpty()
], async (req, res) => {
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return res.status(400).send({ error: result.array() })
        }
        else {
            const { email, password } = req.body;
            const user = await User.findOne({ email: email });
            if (!user) {
                return res.status(400).send({error : "Email or Password is Incorrect!"})
            }
            const comparepass = await bcrypt.compare(password, user.password)
            if (!comparepass) {
                return res.status(400).send({error : "Email or Password is Incorrect!"})
            }
            const sign = ({
                user: user.id
            })
            const JWT_TOKEN = JWT.sign(sign, JWT_SECRET)
            res.send(JWT_TOKEN)
            console.log(user);
        }
    }
    catch (e) {
        console.log(e.message);
        res.send(e.message)
    }
})


// Checing if a user is login or not
router.post('/getuser' , islogin ,async (req,res)=>{
    try {
            const userid = req.user;
            const user = await User.findById(userid).select('-password')
            res.send({userid : user})
            console.log(user);
    } catch (e) {
        console.log("ERROR : ", e.message);
        res.send({"ERROR  : ": e.message})
    }
})


module.exports = router