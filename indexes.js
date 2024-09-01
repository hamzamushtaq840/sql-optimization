import express from "express";
import mysql from "mysql2/promise";

const app = express();

async function startServer() {
  try {
    // Create the connection to the database
    const connection = mysql.createPool({
      host: "localhost",
      user: "root",
      password: "root",
      database: "imdb",
      waitForConnections: true,
      connectionLimit: 10,
      maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
      idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
    const startTime = new Date().getTime(); // Get the start time in milliseconds

    //
    const [results] = await connection.query(
      "SELECT * FROM roles WHERE role = 'Diana'"
    );

    const endTime = new Date().getTime(); // Get the end time in milliseconds
    const timeTaken = endTime - startTime; // Calculate the time taken
    console.log(`Query executed in ${timeTaken} ms`);

    app.listen(5000, () => {
      console.log("Server is listening on port 5000");
      console.log("Connected to the database");
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
}

startServer();
