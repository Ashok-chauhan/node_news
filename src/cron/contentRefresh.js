const cron = require("node-cron");
const { refreshContent } = require("../services/contentService");

cron.schedule("0 * * * *", async () => {
  await refreshContent();
});
