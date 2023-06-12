const express = require('express')
const bcyrpt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {UserModel} = require('../models/user.model')
const { redisClient } = require('../redis')
const {logger} = require('../logger')
// const { log } = require('console')
const userRoute = express.Router()


userRoute.post('/register', async(req,res)=>{
    let {name,email, password} = req.body

    try {
        let user = await UserModel.findOne({email})
        if(user) return res.status(500).send({msg: "User already exists, try login."})

        let hashed = bcyrpt.hashSync(password, 4)
        const newuser = new UserModel({name: name, email : email, password : hashed})
        await newuser.save()
        return res.status(200).send({msg: "User Registered.", user : newuser})
    } catch (error) {
        console.log(error)
        logger.error(error.massage)
        return res.status(400).send({msg: "something went wrong", err : error})
    }
})


userRoute.post('/login', async(req,res)=>{
    const {email, password} = req.body
    try {
       let  user = await UserModel.findOne({email})
       if(!user) return res.status(401).send({msg:"User does not exists, Singup First"})
       if(user){
        let hashed = bcyrpt.compareSync(password, user.password)
        if(hashed){
            const token = jwt.sign({userId: user._id}, process.env.token_secret, {expiresIn : "1hr"})

            await redisClient.set(
                user._id+"_token", token, "Ex", 60
            )

            res.cookie('tokenKey', user._id+"_token")

            return res.status(200).send({msg: "Login successfull", token : token})
        }
        else{
            return res.status(400).send({msg: "Wrong Credientials!"})
        }
       }

    } catch (error) {
        console.log(error)
        logger.error(error.massage)
        return res.status(400).send({msg: "Wrong Credientials!"})
    }
})


userRoute.get('/logout', async (req,res)=>{
    
   try {
    const tokenkey = req?.cookies?.tokenkey
    const token = redisClient.GET(tokenkey)
    await redisClient.set(token, token)
    await redisClient.del(tokenkey);
    return res.status(200).send({msg: "Logout successfull."})
   } catch (error) {
    console.log(error)
        logger.error(error.massage)
        return res.status(400).send({msg: "Something went wrong, try again"})
   }
})


module.exports = {userRoute}