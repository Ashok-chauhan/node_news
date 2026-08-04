const cron = require("node-cron");
const { refreshContent } = require("../services/contentService");

cron.schedule("*/2 * * * *", async () => {
  await refreshContent();
});
