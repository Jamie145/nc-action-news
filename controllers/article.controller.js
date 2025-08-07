const { request, response } = require('express');

const { fetchArticles, fetchArticleById, fetchArticleComments, updateArticleById, addComment, removeCommentById, selectArticles } = require('../models/articles.models');



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

exports.getAllArticles = (request, response, next) =>{
 
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

exports.postComment = (request, response, next) =>{
    const {article_id} = request.params
    const {username, body} = request.body

    if (isNaN(article_id)) {
        return next({ status: 400, msg: 'Bad Request' });
      }

      addComment(article_id, username, body)
    .then((comment) =>{
        response.status(201).send({comment})
    }).catch((err) =>{
        next(err)
    })
}
exports.patchArticleByID = (request, response, next) => {
    const { article_id } = request.params;
    const { inc_votes } = request.body;

    // Check for invalid article_id (e.g., non-numeric)
    if (isNaN(article_id)) {
        return next({ status: 400, msg: 'Bad Request' });
    }

    // Check for invalid inc_votes (e.g., missing or not a number)
    if (typeof inc_votes !== 'number') { 
        return next({ status: 400, msg: 'Bad Request' });
    }

    updateArticleById(inc_votes, article_id) // Order of arguments matches model
    .then((article) => { // 
        response.status(200).send({ article }); 
    })
    .catch((err) => {
        next(err);
    });
};






exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    if (isNaN(comment_id)) {
        return next({ status: 400, msg: 'Invalid comment ID' });
    }
    removeCommentById(comment_id)
        .then(() => {
            console.log("Controller: Model resolved successfully, sending 204!"); 
            res.status(204).send();
        })
        .catch((err) => {
            console.log("Error caught in deleteCommentById controller:", err);
            next(err);
        });
};

exports.getArticles = (req, res, next) => {
    console.log('Controller: getArticles function entered.');
    const { sort_by, order, topic, limit, p } = req.query; // Destructuring params

    selectArticles(sort_by, order, topic, limit, p) // All params are passed
        .then((articles) => {
            console.log('DEBUG: Articles ready to be sent:', articles.length, 'articles found.'); 
            console.log('DEBUG: First article (if any):', articles[0]); 
            res.status(200).send({ articles });
        })
        .catch(next);
};