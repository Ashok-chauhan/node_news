const express = require("express");
const router = express.Router();
const CategoryCollection = require("../models/category");
const StoryCollection = require("../models/story");
// var URL = 'https://prodman.whizti.com/api/publication/580?limit=0';
var URL = "https://dispatch.whizti.com/api/publication/861?limit=0";

var categories;
var _stories = [];
//const PUBID = 360; inforum -580

const util = require("../utility");
//home route.
router.get("/", async (req, res) => {
  try {
    categories = await CategoryCollection.find();
    const category_id = categories[0].category_id;
    const content = await StoryCollection.find({
      category_id: category_id,
    }).sort({ pub_date: -1 });

    const rightCol1 = content.slice(1, 5);
    const firststory = content.slice(0, 1);
    //pan1

    const pan1title = categories[1].name;
    const pan1catid = categories[1].category_id;
    const pan1content = await StoryCollection.find({
      category_id: categories[1].category_id,
    }).sort({ pub_date: -1 });
    const pan1 = pan1content.slice(0, 6);

    //pan2

    const pan2catid = categories[2].category_id;
    const pan2title = categories[2].name;
    const pan2content = await StoryCollection.find({
      category_id: categories[2].category_id,
    }).sort({ pub_date: -1 });
    const pan2 = pan2content.slice(0, 6);
    const pageTitle = pan1title + " | " + pan2title;

    // 3rd right col
    const business = await StoryCollection.find({ category_id: 5083 })
      .sort({ pub_date: -1 })
      .limit(5);
    _stories = [...pan1, ...pan2, ...rightCol1, ...firststory, ...business];

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
      // opinions: opinions,
    });
  } catch {
    res.send("Something went wrong!, try again later");
  }
});

router.get("/stories/:id", async (req, res) => {
  try {
    const content = await StoryCollection.find({
      category_id: req.params.id,
    }).sort({ pub_date: -1 });

    const pageTitle = content.length ? content[0].title : "pinga.us";

    res.render("content/stories", {
      stories: content,
      categories: categories,
      pageTitle: pageTitle,
    });
  } catch {
    res.send("Something went wrong!, try again later");
  }
});

router.get("/story/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const story = await StoryCollection.findById(id);

    res.render("content/story", {
      story: story,
      categories: categories,
      pageTitle: story.title,
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
