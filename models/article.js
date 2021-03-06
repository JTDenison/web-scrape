// Require mongoose
var mongoose = require("mongoose");
// Create Schema
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  // title = required string
  title: {
    type: String,
    required: true
  },
  // link = required string
  link: {
    type: String,
    required: true
  },
  
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = article;