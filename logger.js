require('dotenv').config()
const winston = require('winston')
const {MongoDB} = require('winston-mongodb')

const logger = winston.createLogger({
    transports : [
        new winston.transports.Console(),
        new winston.transports.MongoDB({
            db : process.env.mongoUrl,
            collection : "Errors",
            level : "error",
            options: { useUnifiedTopology: true }
        })
    ]
})

module.exports = {logger}