const app = require("../app")


const { fetchTopics } = require('../models/topics.model');

exports.getTopics = (request, response) => {
    fetchTopics()
      .then((topics) => {
          res.status(200).send({ topics });
      })
      
};