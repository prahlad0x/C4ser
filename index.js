const express = require('express')
const { connection } = require('./db')
const cookieParser = require('cookie-parser')
const { userRoute } = require('./routes/user.routes')
const { authentication } = require('./authentication')
const validate = require('./validate')
const { weatherRouter } = require('./routes/weather.routes')
  require("dotenv").config()

const app = express()
app.use(cookieParser())
app.use(express.json())


app.get('/',(req, res )=>{
    return res.status(200).send({msg : "Welcome to the weather api app."})
})

app.use('/user',userRoute)
app.use(authentication)

app.use(validate)
app.use('/weather', weatherRouter)






app.listen(process.env.port, async()=>{
    try {
        await connection
        console.log("Connected to DB")
        console.log('Server is running.')
    } catch (error) {
        console.log(error)
    }
})