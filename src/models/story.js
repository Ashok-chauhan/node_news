const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    thumbnail: String,
    media: String,
    caption: String,
    type: String
  });
  
const storySchema = new mongoose.Schema({
    category_id:{
        type: Number,
       },
    title:{
        type:String,
      },
    content:String,
    pub_date: Date,
    description: String,
    icon_uri:String,
    type: String,
    media:[{
        thumbnail: {type:String},
        media: {type:String},
        caption: {type:String},
        type: {type: String}
    }]
},{timestamps: true});

module.exports = mongoose.model('story', storySchema);