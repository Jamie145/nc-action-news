const cors = require('cors');
const express = require('express')
const { getAllArticles, getArticleByID, getArticles, getArticleComment, postComment, patchArticleByID, deleteCommentById} = require('./controllers/article.controller')
const { getTopics } = require('./controllers/topics.controller');
const { getUsers } = require('./controllers/users.controller')
const app = express()
const endpoints = require ('./endpoints.json'); 
const {handleServerErrors}  = require('./errors.controller');
app.use(cors());
app.use(express.json());


app.get("/api",(request, response)=>{
   response.status(200).send({endpoints: endpoints})
})


app.get("/api/topics", getTopics);


app.get("/api/articles/:article_id", getArticleByID);

//app.get("/api/articles", getAllArticles);

app.get("/api/articles", getArticles);

app.get('/api/users', getUsers);


app.get("/api/articles/:article_id/comments", getArticleComment);//



  app.post('/api/articles:/article_id/comments',postComment);

  app.patch('/api/articles/:article_id', patchArticleByID);

 
  

  app.delete('/api/comments/:comment_id', deleteCommentById);


app.all('*', (req, res) => {
  
  res.status(404).send({ message: "Path does not exist" });
});


  app.use(handleServerErrors);
  

module.exports = app