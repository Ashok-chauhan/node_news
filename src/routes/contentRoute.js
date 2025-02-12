const express = require("express");
const router = express.Router();
const CategoryCollection = require("../models/category");
const StoryCollection = require("../models/story");
const client = require("../redisClient");
// const {
//   cacheMiddleware,
//   categoryMiddleware,
// } = require("../middleware/cacheMiddleware");
// var URL = 'https://prodman.whizti.com/api/publication/580?limit=0';
var URL = "https://dispatch.whizti.com/api/publication/861?limit=0";

var categories;
var _stories = [];
//const PUBID = 360; inforum -580

const util = require("../utility");

//home route.
router.get("/", async (req, res) => {
  try {
    const cachedCategory = await client.get("categories");
    if (cachedCategory) {
      categories = JSON.parse(cachedCategory);
      console.log("Cached Category");
    } else {
      categories = await CategoryCollection.find();
      await client.setEx("categories", 28800, JSON.stringify(categories));
    }

    const category_id = categories[0].category_id;
    const cachedContent = await client.get("content");
    let content;
    if (cachedContent) {
      content = JSON.parse(cachedContent);
      console.log("Cached Contents...");
    } else {
      content = await StoryCollection.find({
        category_id: category_id,
      }).sort({ pub_date: -1 });
      await client.setEx("content", 28800, JSON.stringify(content));
    }

    const rightCol1 = content.slice(1, 5);
    const firststory = content.slice(0, 1);

    //pan1

    const pan1title = categories[1].name;
    const pan1catid = categories[1].category_id;
    const cachedPan1Content = await client.get(
      `"${categories[1].category_id}"`
    );
    let pan1content;

    if (cachedPan1Content) {
      pan1content = JSON.parse(cachedPan1Content);
      console.log("Cached pan1 content...");
    } else {
      pan1content = await StoryCollection.find({
        category_id: categories[1].category_id,
      }).sort({ pub_date: -1 });

      await client.setEx(
        `"${categories[1].category_id}"`,
        28800,
        JSON.stringify(pan1content)
      );
    }

    const pan1 = pan1content.slice(0, 6);

    //pan2

    const pan2catid = categories[2].category_id;
    const pan2title = categories[2].name;

    const cachedPan2Content = await client.get(
      `"${categories[2].category_id}"`
    );
    let pan2content;
    if (cachedPan2Content) {
      pan2content = JSON.parse(cachedPan2Content);
      console.log("Cached pand2 content");
    } else {
      pan2content = await StoryCollection.find({
        category_id: categories[2].category_id,
      }).sort({ pub_date: -1 });

      await client.setEx(
        `"${categories[2].category_id}"`,
        28800,
        JSON.stringify(pan2content)
      );
    }

    const pan2 = pan2content.slice(0, 6);
    const pageTitle = pan1title + " | " + pan2title;

    // 3rd right col
    const cachedBusiness = await client.get("5083");
    let business;
    if (cachedBusiness) {
      business = JSON.parse(cachedBusiness);
      console.log("Cached Business...");
    } else {
      business = await StoryCollection.find({ category_id: 5083 })
        .sort({ pub_date: -1 })
        .limit(5);

      await client.setEx("5083", 28800, JSON.stringify(business));
    }

    _stories = [...pan1, ...pan2, ...rightCol1, ...firststory, ...business];

    // Sports category bof

    const cachedToppan = await client.get("sportsCategory");
    let topPan;
    if (cachedToppan) {
      topPan = JSON.parse(cachedToppan);
    } else {
      topPan = await StoryCollection.find({ category_id: 5095 })
        .sort({ pub_date: -1 })
        .limit(5);
      await client.setEx("sportsCategory", 28800, JSON.stringify(topPan));
    }
    const cachedSportsContent = await client.get("sportsContentData");
    let sportsContent;

    if (cachedSportsContent) {
      sportsContent = JSON.parse(cachedSportsContent);
    } else {
      sportsContent = await StoryCollection.find({
        category_id: 5095,
      })
        .sort({ pub_date: -1 })
        .skip(5)
        .limit(10);

      await client.setEx(
        "sportsContentData",
        28800,
        JSON.stringify(sportsContent)
      );
    }

    const firsSportststory = topPan.splice(0, 1);

    // Sports category eof
    const ogmeta = {
      title: firststory[0].title,
      description: firststory[0].content
        .substring(0, 200)
        .replace(/<[^>]*>/g, ""),
      image: firststory[0].media[0] ? firststory[0].media[0].media : "",
      url: `/story/${firststory[0]._id}?${firststory[0].title}`,
    };

    res.render("content/index", {
      categories: categories,
      contents: content,
      rightCol1: rightCol1,
      pan1: pan1,
      pan1title: pan1title,
      pan2: pan2,
      pan2title: pan2title,
      pan1catid: pan1catid,
      pan2catid: pan2catid,
      pageTitle: pageTitle,
      business: business,
      category_id: category_id,
      topPan: topPan,
      stories: sportsContent,
      firststory: firsSportststory,
      ogmeta: ogmeta,
      // opinions: opinions,
    });
  } catch {
    res.send("Something went wrong!, try again later");
  }
});

router.get("/stories/:id/:categoryname", async (req, res) => {
  try {
    const cachedToppan = await client.get(`"topPan${req.params.id}"`);

    let topPan;
    if (cachedToppan) {
      topPan = JSON.parse(cachedToppan);
    } else {
      topPan = await StoryCollection.find({ category_id: req.params.id })
        .sort({ pub_date: -1 })
        .limit(5);
      await client.setEx(
        `"topPan${req.params.id}"`,
        28800,
        JSON.stringify(topPan)
      );
    }
    const cachedContent = await client.get(`"${req.params.id}"`);
    let content;
    if (cachedContent) {
      content = JSON.parse(cachedContent);

      console.log("Cacheed Category content", req.params.id);
    } else {
      content = await StoryCollection.find({
        category_id: req.params.id,
      })
        .sort({ pub_date: -1 })
        .skip(5)
        .limit(50);

      await client.setEx(`"${req.params.id}"`, 28800, JSON.stringify(content));
    }

    const pageTitle = content.length ? content[0].title : "pinga.us";
    const firststory = topPan.splice(0, 1);
    const ogmeta = {
      title: firststory[0].title,
      description: firststory[0].content
        .substring(0, 200)
        .replace(/<[^>]*>/g, ""),
      image: firststory[0].media[0] ? firststory[0].media[0].media : "",
      url: `/story/${firststory[0]._id}?${firststory[0].title}`,
    };

    res.render("content/stories", {
      stories: content,
      categories: categories,
      pageTitle: pageTitle,
      topPan: topPan,
      firststory: firststory,
      categoryname: req.params.categoryname,
      ogmeta: ogmeta,
    });
  } catch {
    res.send("Something went wrong!, try again later");
  }
});

router.get("/story/:id", async (req, res) => {
  try {
    const id = req.params.id;
    let story;
    const cachedStory = await client.get(`"${id}"`);
    if (cachedStory) {
      story = JSON.parse(cachedStory);
      console.log("Cahsed Story...");
    } else {
      story = await StoryCollection.findById(id);
      await client.setEx(`"${id}"`, 28800, JSON.stringify(story));
    }
    const ogmeta = {
      title: story.title,
      description: story.content.substring(0, 200).replace(/<[^>]*>/g, ""),
      image: story.media[0] ? story.media[0].media : "",
      url: `/story/${story._id}?${story.title}`,
    };

    res.render("content/story", {
      story: story,
      categories: categories,
      pageTitle: story.title,
      ogmeta: ogmeta,
    });
  } catch {
    res.send("Something went wrong!, try again later");
  }
});

router.get("/sitemap", async (req, res) => {
  categories = await util.getData(URL);
  res.setHeader("content-type", "text/xml");
  res.render("content/sitemap", { categories: categories });
});
router.get("/about", (req, res) => {
  res.send("about us page");
});

module.exports = router;
