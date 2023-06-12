require('dotenv').config()
const jwt = require('jsonwebtoken')
const {logger} = require('./logger');
const { redisClient } = require('./redis');

const authentication  = async (req, res, next)=>{
    try {
        const tokenkey = req?.cookies?.tokenkey;
        const accessToken  = await redisClient.get(tokenkey)
        const isTokenValid = await jwt.verify( accessToken, process.env.token_secret)
        if(!isTokenValid) return res.status(400).send({message : "JWT expired!"})
        next()

    } catch (error) {
        logger.error(error.message)
        res.status(500).send({message : "Something went wrong", error : error.message})
    }
}


module.exports = {authentication}