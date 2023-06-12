// const { error } = require("console");

const validate = async(req,res,next)=>{
    const regex = /^[A-Za-z]+$/
   
   
    const city = req.params.city;
    if(regex.test(city)){
        next()
    }
    else{
        return res.status(400).send({message :" Invalid city name"})
    }
}


module.exports = validate