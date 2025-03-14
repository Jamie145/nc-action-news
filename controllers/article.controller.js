const { fetchArticles, fetchArticleById, fetchArticleComments } = require('../models/articles.models');

exports.getArticleByID = (request, response, next) =>{
    const {article_id} = request.params

    if (isNaN(article_id)) {
        return next({ status: 400, msg: 'Bad Request' });
      }

    fetchArticleById(article_id)
    
    .then((article) =>{
        response.status(200).send({article})
    }).catch((err) => {
        next(err)
      })
    
}
exports.getArticles = (request, response, next) =>{
 
    fetchArticles()
    .then((rows) =>{
        response.status(200).send({ articles: rows });
    }).catch((err) =>{
        next(err)
    })
    

}

exports.getArticleComment = (request, response, next) =>{
    const {article_id} = request.params

    if (isNaN(article_id)) {
        return next({ status: 400, msg: 'Bad Request' });
      }

    fetchArticleComments(article_id)
    .then((comment) =>{
        response.status(200).send({comment})
    }).catch((err) =>{
        next(err)
    })
}