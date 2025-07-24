const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || "development";

require('dotenv').config({ path: `${__dirname}/../.env.${ENV}` });

const config = {};

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}else console.log(process.env.PGDATABASE)


if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.ssl = {
    rejectUnauthorized: false,
  };
  config.max = 2;
}
try {
  module.exports = new Pool(config);
  console.log('DEBUG: Database Pool successfully created.'); // ADD THIS LINE
} catch (err) {
  console.error('ERROR: Failed to create database Pool:', err); // ADD THIS LINE
  throw err; // Re-throw to ensure the process fails if connection fails
}


/*const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || 'development'

require('dotenv').config({path: `${__dirname}/../.env.${ENV}`})

const db = new Pool();

if (!process.env.PGDATABASE) {
    throw new Error("No PGDATABASE configured")
} else { 
    console.log(`Connected to ${process.env.PGDATABASE}`)
}


module.exports = db;
*/