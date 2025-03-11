const app = require("../app")


const { fetchTopics } = require('../models/topics.model');

exports.getTopics = (request, response) => {
    fetchTopics()
      .then((topics) => {
          response.status(200).send({ topics });
      })
      
};