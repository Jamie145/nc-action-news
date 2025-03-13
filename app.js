const express = require('express')
const {getArticleByID, getArticles} = require('./controllers/article.controller')
const { getTopics } = require('./controllers/topics.controller');
const app = express()
const endpoints = require ('./endpoints.json'); 
const nonEndPoint = require('./errors.controller');


app.get("/api",(request, response)=>{
    response.status(200).send({endpoints: endpoints})
})


app.get("/api/topics", getTopics);


app.get("/api/articles/:article_id", getArticleByID);

app.get("/api/articles", getArticles)



app.use((err,request,response,next) =>{
    if(err.status && err.msg){
    response.status(err.status).send({message: err.msg})
    }
    else response.status(500).send({ msg: "Internal Server Error" });
})

app.all('*', (req, res) => {
    res.status(404).send({ message: "Path does not exist" });
  });



module.exports = app