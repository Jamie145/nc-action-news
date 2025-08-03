const db = require("../db/connection")



exports.fetchArticleById = (article_id) => {
    return db.query("SELECT * FROM articles WHERE article_id = $1;", [article_id]).then(({ rows }) => {
      if (rows.length === 0) {
       return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows[0];
    })
};
    exports.fetchArticles = () => {
      return db.query(`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes,article_img_url, 
      COUNT(comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes,article_img_url
      ORDER BY created_at DESC;`).then(({ rows }) => {
        
        return rows;
      })
       
  };

  exports.fetchArticleComments = (article_id) =>{
    return db.query('SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY created_at DESC;', [article_id])
    .then(({rows}) =>{
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows
    })
  }

  exports.addComment = (article_id, username, body) => {
    return db.query(
      'INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;',
      [article_id, username, body] // This array holds the values for $1, $2, $3
    )
    .then(({ rows }) => {
      // The 'RETURNING *' in the SQL gives us an array with the new comment.
      // Since we only inserted one comment, it will be the first (and only) item in 'rows'.
      return rows[0]; // We return just that single new comment object.
    });
  };

  exports.updateArticleById = (inc_votes, article_id) =>{
    return db.query("UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *", [inc_votes, article_id]).then((result) =>{
      const article = result.rows[0]

      if (article === undefined) { // Check if the article is undefined
        //  We need to reject the promise
        return Promise.reject({ status: 404, msg: 'Article Not Found' });
      }


      return article})
  }

 

  exports.removeCommentById = (comment_id) => {
    // 1. Execute the SQL DELETE query.
    //    - We use $1 to prevent SQL injection and pass comment_id as an array.
    //    - RETURNING * is crucial here: it tells the database to send back the
    //      data of the row(s) that were just deleted.
    console.log("Model received comment_id:", comment_id);
    return db.query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [comment_id]) // Added semicolon to SQL query, good practice
        .then((result) => {
          console.log("Result rows from DELETE query:", result.rows);
            // 2. Check the result of the query.
            //    - If result.rows.length is 0, it means no row was found with that comment_id
            //      and therefore nothing was deleted. This indicates a 404 Not Found error.
            if (result.rows.length === 0) {
                // If no comment was found, reject the promise with a 404 status and message.
                // This error will be caught by the .catch() in the controller.
                return Promise.reject({ status: 404, msg: 'Comment Not Found' }); // <--- FIXED: Missing closing parenthesis here
            }
            // 3. If result.rows.length is 1 (meaning a comment WAS deleted),
            //    we don't need to return anything specific here.
            //    The promise simply resolves successfully, and the controller's
            //    .then(() => res.status(204).send()) will then execute.
        });
};
      
exports.selectArticles = (sort_by = 'created_at', order = 'desc', topic) => {
  // List of columns the user is allowed to sort by.
  const validSortByColumns = [
    'article_id', 'title', 'topic', 'author', 'created_at', 'votes', 'comment_count'
  ];
  // List of valid sort orders.
  const validOrderOptions = ['asc', 'desc'];
  const queryValues = [];

  // --- Input Validation ---
  if (!validSortByColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: 'Invalid sort_by query' });
  }
  if (!validOrderOptions.includes(order)) {
    return Promise.reject({ status: 400, msg: 'Invalid order query' });
  }

  // Define which columns to apply LOWER() to for case-insensitive sorting.
  const lowerCaseColumns = ['title', 'topic'];

  let orderByColumn;
  if (sort_by === 'comment_count') {
    // Corrected logic: Use the alias 'comment_count' directly.
    orderByColumn = 'comment_count';
  } else if (lowerCaseColumns.includes(sort_by)) {
    // For title and topic, apply LOWER() and use the table prefix.
    orderByColumn = `LOWER(articles.${sort_by})`;
  } else {
    // THIS IS THE CORRECTED PART:
    // For all other valid columns, explicitly use the articles table prefix.
    orderByColumn = `articles.${sort_by}`;
  }

  // --- SQL Query Construction ---
  let queryString = `
        SELECT
            articles.author,
            articles.title,
            articles.article_id,
            articles.topic,
            articles.created_at,
            articles.votes,
            articles.article_img_url,
            COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id`;

  if (topic) {
    queryString += `
            WHERE articles.topic = $1`;
    queryValues.push(topic);
  }

  queryString += `
      GROUP BY
            articles.author,
            articles.title,
            articles.article_id,
            articles.topic,
            articles.created_at,
            articles.votes,
            articles.article_img_url
      ORDER BY ${orderByColumn} ${order};`;

  // Execute the database query and return the results.
  return db.query(queryString, queryValues)
    .then(({ rows }) => {
      return rows;
    })
    .catch((err) => {
      console.error('DB Query Error:', err);
      throw err;
    });
};