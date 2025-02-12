const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const Story = require("../models/story");

var URL = "https://dispatch.whizti.com/api/publication/861?limit=0";

var CAT = "https://dispatch.whizti.com/api/category";
const client = require("../redisClient");
var categories;
var _stories = [];
const util = require("../utility");

router.get("/", (req, res) => {
  res.send("contents...");
});

router.get("/clear-cache", async (req, res) => {
  await client.sendCommand(["FLUSHDB"]);
  res.send("Cache cleared!");
});

router.get("/addcategory", async (req, res) => {
  categories = await util.getData(URL);
  categories.forEach(async (element) => {
    try {
      let cat = await Category.findOne({ category_id: element.id });
      if (!cat) {
        let catData = new Category({
          category_id: element.id,
          name: element.label,
          uri: element.uri,
          icon_uri: element.icon_uri,
        });
        let category = await catData.save();
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  res.send("inserted ...");
});

router.get("/addcontent", async (req, res) => {
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
            content: item.content,
            pub_date: item.pub_date,
            media: story_media ? story_media : "",
          });
          items.save();
        }
      });
    }
  });
  res.json("done!");
});

router.get("/category/:catid", async (req, res) => {
  console.log(req.params.catid);
  const stories = await Story.find({ category_id: req.params.catid });
  res.json(stories);
});

module.exports = router;
