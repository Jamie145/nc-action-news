const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || "development";

require('dotenv').config({ path: `${__dirname}/../.env.${ENV}` });

// This variable will hold our single, shared database pool
let db;

// Check if a pool already exists. If not, create one.
// This ensures that all parts of your application and tests use the same connection.
if (!db) {
  const config = {};

  if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
    throw new Error("PGDATABASE or DATABASE_URL not set");
  } else {
    // Log which database is being connected to (optional, but good for debugging)
    console.log(`Connecting to database: ${process.env.PGDATABASE || process.env.DATABASE_URL}`);
  }

  if (ENV === "production") {
    config.connectionString = process.env.DATABASE_URL;
    config.ssl = {
      rejectUnauthorized: false,
    };
    config.max = 2; // Keep max connections low for production
  }

  try {
    db = new Pool(config); // Create the single pool
    console.log('DEBUG: Database Pool successfully created (or reused).');
  } catch (err) {
    console.error('ERROR: Failed to create database Pool:', err);
    throw err;
  }
}

module.exports = db; // Export the single, shared pool


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