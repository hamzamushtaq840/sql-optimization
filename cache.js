import express from "express";
import mysql from "mysql2/promise";
import NodeCache from "node-cache";

const app = express();
const cache = new NodeCache({ stdTTL: 600 }); // Cache time-to-live of 10 minutes

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
      maxIdle: 10,
      idleTimeout: 60000,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });

    // Example route with caching
    app.get("/roles/:role", async (req, res) => {
      const role = req.params.role;

      // Check cache first
      const cacheKey = `roles_${role}`;
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        console.log("Cache hit");
        return res.json(cachedData);
      }

      console.log("Cache miss");
      const startTime = new Date().getTime();
      const [results] = await connection.query(
        "SELECT * FROM roles WHERE role = ?",
        [role]
      );
      const endTime = new Date().getTime();

      const timeTaken = endTime - startTime;
      console.log(`Query executed in ${timeTaken} ms`);

      // Cache the result
      cache.set(cacheKey, results);

      res.json(results);
    });

    app.listen(5000, () => {
      console.log("Server is listening on port 5000");
      console.log("Connected to the database");
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
}

startServer();
