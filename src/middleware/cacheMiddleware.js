// Middleware to check cache
const cacheMiddleware = async (req, res, next) => {
  const cachedData = await client.get("content");
  if (cachedData) {
    return res.json({ content: JSON.parse(cachedData) });
  }
  next();
};
// Middleware to check cache
const categoryMiddleware = async (req, res, next) => {
  const cachedData = await client.get("categories");
  if (cachedData) {
    return res.json({ categories: JSON.parse(cachedData) });
  }
  next();
};

module.exports = {
  cacheMiddleware,
  categoryMiddleware,
};
