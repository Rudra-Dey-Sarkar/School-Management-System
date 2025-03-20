// Users Schema and Model Creation
const mongoose = require("mongoose");


const schoolsSchemaModel = new mongoose.Schema({
    name:String,
    address:String,
    latitude:Number,
    longitude:Number
});

module.exports = mongoose.model("schools", schoolsSchemaModel);