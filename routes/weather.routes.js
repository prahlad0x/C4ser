const axios = require('axios')
require('dotenv').config()
const express = require('express')
const { redisClient } = require('../redis')
weatherRouter = express.Router()

weatherRouter.get('/:city', async(req,res)=>{
    let city = req.params.city
    if(redisClient.get(city)) return redisClient.get(city)
    axios.get(`https://api.weatherstack.com/current?${access_key = process.env.access_key}& query = ${city}`)
    .then(data=> data.json())
    .then(data =>{
        redisClient.set(city, data)
        res.status(200).send({data : data})
    }).catch(err=>console.log(err))
})
// const output = axios.get(`https://api.weatherstack.com/current?${access_key = process.env.access_key}& query = India`)

module.exports = {weatherRouter}