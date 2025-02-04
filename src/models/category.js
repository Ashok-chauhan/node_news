const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    category_id:{
        type: Number,
        required: true,
        unique: true
    },
    name:{
        type:String,
        required: true,
        unique: true,
    },
    uri:{
        type: String
    },
    icon_uri:{
        type: String
    }
},{timestamps: true});

module.exports = mongoose.model('category', categorySchema);