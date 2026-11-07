
const { default: Redis } = require("ioredis");
const config = require("./config");

const redis = new Redis(config.REDIS_URL);

redis.on("connect", () => {
  console.log("Redis Connected Successfully");
});


redis.on("error", (error) => {
  console.log("Redis Error:", error.message);
});

redis.on("close", () => {
  console.log("Redis Connection Closed");
});


module.exports = redis