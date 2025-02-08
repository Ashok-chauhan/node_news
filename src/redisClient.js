const redis = require("redis");
require("dotenv").config();
const client = redis.createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
  port: process.env.PORT,
});

client.on("error", (err) => console.error("Redis Client Error", err));

//await client.connect();
const connectRedis = async () => {
  try {
    await client.connect();
    console.log("Connected to Redis Cloud");
  } catch (error) {
    console.error("Redis connection error:", error);
  }
};

connectRedis();

module.exports = client;
