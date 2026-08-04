const Category = require("../models/category");
const Story = require("../models/story");
const client = require("../redisClient");
var categories;

const util = require("../utility");
var CAT = "https://dispatch.whizti.com/api/category";

async function refreshContent() {
  try {
    await client.sendCommand(["FLUSHDB"]);
    console.log("Cleared old redis cache");
    console.log("Starting content refresh...");
    // Step 1
    await fetchLatestContent();
    // Step 2
    await refreshCategoryCache();
    console.log("Content refresh completed.");
  } catch (err) {
    console.error("Content refresh failed:", err);
  }
}

async function fetchLatestContent() {
  categories = await Category.find();
  categories.forEach(async (element) => {
    let stories = await util.getCategory(CAT + "/" + element.category_id);
    if (stories) {
      stories.response.content.forEach(async (item) => {
        let article = await Story.findOne({ title: item.title });
        if (!article) {
          const story_media = [];
          if (item.media.length > 0) {
            item.media.forEach((med) => {
              let storyMedia = {
                thumbnail: med.thumbnail,
                media: med.media,
                caption: med.caption,
                type: med.type,
              };
              story_media.push(storyMedia);
            });
          }
          let items = new Story({
            category_id: item.category_id,
            title: item.title,
            description: item.description,
            icon_uri: item.icon_uri,
            type: item.type,
            // content: item.content,
            content: item.content
              .replace(/Copyright\s+\d{4}[\s\S]*$/i, "")
              .trim(),
            pub_date: item.pub_date,
            media: story_media ? story_media : "",
          });
          items.save();
        }
      });
    }
  });
}

async function refreshCategoryCache() {
  const categories = await Category.find().lean();

  for (const category of categories) {
    //pinga.us/stories/5084/Health
    let topPan = await Story.find({ category_id: category.category_id })
      .sort({ pub_date: -1 })
      .limit(5);
    await client.setEx(
      `"topPan${category.category_id}"`,
      28800,
      JSON.stringify(topPan),
    );

    let content = await Story.find({
      category_id: category.category_id,
    })
      .sort({ pub_date: -1 })
      .skip(5)
      .limit(50);

    await client.setEx(
      `"${category.category_id}"`,
      28800,
      JSON.stringify(content),
    );

    console.log(
      `Category ${category.category_id} - ${category.name} refreshed`,
    );
  }
}

module.exports = {
  refreshContent,
};
