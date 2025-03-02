const db = require("../connection")
const format = require("pg-format");


const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query('DROP TABLE IF EXISTS comments;')
  .then(()=>{
    console.log("DROPPED COMMENTS TABLE")
  return db.query("DROP TABLE IF EXISTS articles")
  .then(()=>{
    console.log("DROPPED ARTICLES TABLE")
  return db.query('DROP TABLE IF EXISTS users')
  .then (()=>{
    console.log("DROPPED USERS TABLE")
  return db.query('DROP TABLE IF EXISTS topics')
  .then (()=>{
    console.log("DROPPED TOPICS TABLE")
    return createTopics()
  })
  .then (()=> {
    return createUsers()
  })
  .then(() => {
    return createArticles()
  })
  .then(()=>{
    return createComments()
  })
  .then(()=>{
    return insertTopics(topicData)
  })
  .then(() => {
    console.log("Inserted topics successfully!");
  })
      })
    })
  }); //<< write your first query in here.
};


function createArticles(){
  return db.query('CREATE TABLE articles(article_id SERIAL PRIMARY KEY, title VARCHAR(20), topic VARCHAR(40) REFERENCES topics(slug), author VARCHAR(40) REFERENCES users(username), body TEXT, created_at timestamp without time zone , votes INT DEFAULT 0, article_img_url VARCHAR(1000))');

}

function createUsers(){
  return db.query('CREATE TABLE users(username VARCHAR(20) PRIMARY KEY, name VARCHAR(30), avatar_url VARCHAR(1000))');
}

function createTopics(){
  return db.query('CREATE TABLE topics(slug VARCHAR PRIMARY KEY, description VARCHAR, img_url VARCHAR(1000))');
}

function createComments(){
  return db.query ('CREATE TABLE comments(comment_id SERIAL PRIMARY KEY, article_id INT REFERENCES articles(article_id), body TEXT, votes INT DEFAULT 0, author VARCHAR REFERENCES users(username), created_at TIMESTAMP )');
}

function insertTopics(topicData){
  // fIrst to format our data. Use .map to return our array of arrays. we prepare the data

const topicFormat = topicData.map((row)=>{
  return [row.slug, row.description,row.img_url]
})
    
  //create our query string pg.format(SQL template format string, array of arrays - each sub array reps 1 row). we build the query string
  const queryString = format('INSERT INTO topics (slug, description, img_url)VALUES %L',topicFormat )
  //query the database (db.query). we query the database
  return db.query(queryString)
  //pg.format

}
function insertUsers(userData){

}
function insertArticles(articleData, userData, topicData){

}

module.exports = seed;



// db.query.format INSERT INTO 