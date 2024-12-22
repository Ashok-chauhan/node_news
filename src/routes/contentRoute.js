const express = require('express');
const router = express.Router();
var URL = 'https://prodman.whizti.com/api/publication/580?limit=0';
var CAT = 'https://prodman.whizti.com/api/category';
var categories;
var _stories=[];
//const PUBID = 360; inforum -580



const util = require('../utility');
//home route.
router.get('/', async(req,res)=>{
    categories = await util.getData(URL);
    const url = `${CAT}/${categories[0].id}`;
    const content = await util.getCategory(url)
   
    const rightCol1 = content.response.content.slice(1,5);
    const firststory = content.response.content.slice(0,1);
    //pan1
    const pan1url = `${CAT}/${categories[1].id}`;
    const pan1title = categories[1].label;
    const pan1catid = categories[1].id;
    const pan1content = await util.getCategory(pan1url)
    const pan1 = pan1content.response.content.slice(0,4);

     //pan2
     const pan2url = `${CAT}/${categories[2].id}`;
     const pan2catid = categories[1].id;
     const pan2title = categories[2].label;
     const pan2content = await util.getCategory(pan2url)
     const pan2 = pan2content.response.content.slice(0,4);
     const pageTitle = pan1title + ' | ' + pan2title;
     _stories = [...pan1, ...pan2, ...rightCol1, ...firststory];
   
    res.render('content/index', {
      categories:categories,
       contents:content.response.content,
       rightCol1:rightCol1,
       pan1:pan1,
       pan1title:pan1title,
       pan2:pan2,
       pan2title:pan2title,
       pan1catid:pan1catid,
       pan2catid:pan2catid,
       pageTitle:pageTitle,
      });
    
});

router.get('/stories/:id', async(req, res)=>{
const url = `${CAT}/${req.params.id}`;
  const content = await util.getCategory(url)
  _stories = content.response.content;
  const pageTitle = _stories[0].title;
  res.render('content/stories', {stories:_stories, categories:categories, pageTitle:pageTitle})
 });

 router.get('/story/:id', async(req, res)=>{
  const id = req.params.id;
  const story = _stories.filter((story)=>{
    if(story.id == id){
      return story;
    }
  });
  res.render('content/story', {story:story[0], categories:categories, pageTitle:story[0].title});
  });


router.get('/sitemap',async(req,res)=>{
    categories = await util.getData(URL);
    res.setHeader('content-type', 'text/xml');
    res.render('content/sitemap', {categories:categories});
   
  });
router.get('/about',(req, res)=>{
    res.send('about us page');
});


module.exports = router;