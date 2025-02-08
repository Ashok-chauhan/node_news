const redis = require("redis");
require("dotenv").config();
const client = redis.createClient({
  // url: process.env.REDIS_URL,
  // password: process.env.REDIS_PASSWORD,
  // url: "redis://default:aJbA7oDf43UHDIxJYGjLPFO4ZYn2fSyr@redis-19099.c256.us-east-1-2.ec2.redns.redis-cloud.com:19099",
  // password: "Redis@975",
  url: "redis://127.0.0.1:6379",
  password: "ashokkumar",
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
