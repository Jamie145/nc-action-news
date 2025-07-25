const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate } = require("./utils");

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;

  // Drop tables in strict reverse dependency order, sequentially
  return db.query('DROP TABLE IF EXISTS comments CASCADE;')
    .then(() => db.query('DROP TABLE IF EXISTS articles CASCADE;'))
    .then(() => db.query('DROP TABLE IF EXISTS users CASCADE;'))
    .then(() => db.query('DROP TABLE IF EXISTS topics CASCADE;'))
    .then(() => {
      console.log("DROPPED ALL TABLES SEQUENTIALLY");

      // Create tables in strict dependency order, sequentially
      // Added IF NOT EXISTS for robustness and NOT NULL for constraints
      const createTopicsTable = `
      CREATE TABLE IF NOT EXISTS topics (
        slug VARCHAR PRIMARY KEY,
        description VARCHAR,
        img_url VARCHAR(1000)
      );`;

      const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        username VARCHAR(40) PRIMARY KEY,
        name VARCHAR(30) NOT NULL,
        avatar_url VARCHAR(1000)
      );`;

      const createArticlesTable = `
      CREATE TABLE IF NOT EXISTS articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        topic VARCHAR(40) NOT NULL REFERENCES topics(slug),
        author VARCHAR(40) NOT NULL REFERENCES users(username),
        body TEXT NOT NULL,
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
        votes INT DEFAULT 0 NOT NULL,
        article_img_url VARCHAR(1000)
      );`;

      const createCommentsTable = `
      CREATE TABLE IF NOT EXISTS comments (
        comment_id SERIAL PRIMARY KEY,
        body TEXT NOT NULL,
        article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
        author VARCHAR(40) NOT NULL REFERENCES users(username),
        votes INT DEFAULT 0 NOT NULL,
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
      );`;

      return db.query(createTopicsTable)
        .then(() => db.query(createUsersTable))
        .then(() => db.query(createArticlesTable))
        .then(() => db.query(createCommentsTable));
    })
    .then(() => {
      console.log("CREATED ALL TABLES SEQUENTIALLY");

      // Insert data into tables, sequentially
      const insertTopicsQueryStr = format(
        "INSERT INTO topics (slug, description, img_url) VALUES %L;",
        topicData.map(({ slug, description, img_url }) => [
          slug,
          description,
          img_url || 'https://example.com/default_topic_img.jpg',
        ])
      );
      return db.query(insertTopicsQueryStr);
    })
    .then(() => {
      console.log("Inserted topics successfully!");
      const insertUsersQueryStr = format(
        "INSERT INTO users (username, name, avatar_url) VALUES %L;",
        userData.map(({ username, name, avatar_url }) => [
          username,
          name,
          avatar_url || 'https://example.com/default_avatar.jpg',
        ])
      );
      return db.query(insertUsersQueryStr);
    })
    .then(() => {
      console.log("Inserted user Data successfully!");
      const formattedArticleData = articleData.map(convertTimestampToDate);
      const insertArticlesQueryStr = format(
        "INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;",
        formattedArticleData.map(
          ({
            title,
            topic,
            author,
            body,
            created_at,
            votes = 0,
            article_img_url = 'https://example.com/default_article_img.jpg',
          }) => [title, topic, author, body, created_at, votes, article_img_url]
        )
      );
      return db.query(insertArticlesQueryStr);
    })
    .then(({ rows }) => {
      console.log("Inserted article data successfully!");
      const lookUpArticleId = {};
      rows.forEach(row => {
        lookUpArticleId[row.title] = row.article_id;
      });

      const commentsFormat = commentData.map((comment) => {
        return [
          comment.body,
          lookUpArticleId[comment.article_title],
          comment.author,
          comment.votes || 0,
          new Date(comment.created_at)
        ];
      });

      const insertCommentsQueryStr = format('INSERT INTO comments (body, article_id, author, votes, created_at) VALUES %L RETURNING *', commentsFormat);
      return db.query(insertCommentsQueryStr);
    })
    .then(() => {
      console.log("Inserted comment data successfully!");
      console.log("Database seeded successfully!");
    })
    .catch((err) => {
      console.error("Error during seeding process:", err);
      throw err;
    });
    // Removed .finally(() => db.end()); from here
};

module.exports = seed;





// db.query.format INSERT INTO 

/*const db = require("../connection")
const format = require("pg-format");
const { convertTimestampToDate } = require("./utils")


const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query('DROP TABLE IF EXISTS comments;')
    .then(() => {
      console.log("DROPPED COMMENTS TABLE")
      return db.query("DROP TABLE IF EXISTS articles")
        .then(() => {
          console.log("DROPPED ARTICLES TABLE")
          return db.query('DROP TABLE IF EXISTS users')
            .then(() => {
              console.log("DROPPED USERS TABLE")
              return db.query('DROP TABLE IF EXISTS topics')
                .then(() => {
                  console.log("DROPPED TOPICS TABLE")
                  return createTopics()
                })
                .then(() => {
                  return createUsers()
                })
                .then(() => {
                  return createArticles()
                })
                .then(() => {
                  return createComments()
                })
                .then(() => {
                  return insertTopics(topicData)
                })
                .then(() => {
                  console.log("Inserted topics successfully!");
                }).then(() => {
                  return insertUsers(userData)
                }).then(() => {
                  console.log("Inserted user Data successfully!");
                  return insertArticles(articleData)
                }).then(({ rows }) => {
                  console.log("Inserted article data  successfully!");
                  const lookUpArticleId = {}
                  rows.forEach(row => {
                    lookUpArticleId[row.title] = row.article_id

                  })
                  const commentsFormat = commentData.map((comment) => {
                    return [
                      lookUpArticleId[comment.article_title],
                      comment.body,
                      comment.votes,
                      comment.author,
                      new Date(comment.created_at)


                    ];
                  })
                  const queryString = format('INSERT INTO comments (article_id,body,votes,author,created_at) VALUES %L RETURNING *', commentsFormat)

                  return db.query(queryString)


                })
            })
        })
    }).catch((err) =>{
      console.log(err)
    }) //<< write your first query in here.
};


function createArticles() {
  return db.query('CREATE TABLE articles(article_id SERIAL PRIMARY KEY, title VARCHAR(200), topic VARCHAR(40) REFERENCES topics(slug), author VARCHAR(40) REFERENCES users(username), body TEXT NOT NULL, created_at timestamp without time zone , votes INT DEFAULT 0, article_img_url VARCHAR(1000))');

}

function createUsers() {
  return db.query('CREATE TABLE users(username VARCHAR(40) PRIMARY KEY, name VARCHAR(30), avatar_url VARCHAR(1000))');
}

function createTopics() {
  return db.query('CREATE TABLE topics(slug VARCHAR PRIMARY KEY, description VARCHAR, img_url VARCHAR(1000))');
}

function createComments() {
  return db.query('CREATE TABLE comments(comment_id SERIAL PRIMARY KEY, article_id INT REFERENCES articles(article_id), body TEXT NOT NULL, votes INT DEFAULT 0, author VARCHAR(40) REFERENCES users(username), created_at TIMESTAMP )');
}

function insertTopics(topicData) {
  // fIrst to format our data. Use .map to return our array of arrays. we prepare the data

  const topicFormat = topicData.map((row) => {
    return [row.slug, row.description, row.img_url]
  })

  //create our query string pg.format(SQL template format string, array of arrays - each sub array reps 1 row). we build the query string
  const queryString = format('INSERT INTO topics (slug, description, img_url) VALUES %L', topicFormat)
  //query the database (db.query). we query the database
  return db.query(queryString)
  //pg.format

}
function insertUsers(userData) {
  const userFormat = userData.map((row) => {
    return [row.username, row.name, row.avatar_url]
  })

  const queryString = format('INSERT INTO users (username, name, avatar_url) VALUES %L', userFormat)

  //console.log("User Data Before Insertion:", userData);

  return db.query(queryString)
}
function insertArticles(articleData, userData, topicData) {
  const articleFormat = articleData.map((article) => {
    return [
      article.title,
      article.topic, // foreign key should match primary key slug 
      article.author, // author should match username in users
      article.body,
      convertTimestampToDate(article).created_at, // Convert timestamp to a proper date
      article.votes || 0,
      article.article_img_url
    ];
  })
  const queryString = format('INSERT INTO articles (title,topic,author,body,created_at,votes,article_img_url) VALUES %L RETURNING *', articleFormat)

  return db.query(queryString)
}



module.exports = seed;



// db.query.format INSERT INTO */