const express = require('express')

const { getTopics } = require('./controllers/topics.controller');
const app = express()
const endpoints = require ('./endpoints.json'); 
const nonEndPoint = require('./errors.controller');




app.get("/api",(request, response)=>{
    response.status(200).send({endpoints: endpoints})
})


app.get("/api/topics", getTopics);

app.all("*", nonEndPoint)
app.use((err,request,response,next) =>{
    response.status(500).send({msg: "internal server error"})
})



module.exports = app