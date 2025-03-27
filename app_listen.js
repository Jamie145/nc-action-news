const app = require("./app.js");
const { PORT = 9090 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));


/*const express = require("express");
const app = express();



app.listen(9090, () => {
    console.log("Server is listening on port 9090...");
  });
  */