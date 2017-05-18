// Dependencies

//Scraping Tools
var request = require("request");
var cheerio = require("cheerio");
//Server & Database tools
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Requiring our Note and Article models(UNTIL HANDLEBARS)
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Initialize Express
var app = express();

//setting up morgan and body-parser.
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/scraperdb");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
    console.log("Mongoose connection successful.");
});

// Routes
// ======

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
    res.send("Welcome to the Matrix... follow the white rabbit");
});

// A GET request to scrape website
app.get("/scrape", function(req, res) {
  //  body of the html with request
  request("https://www.reddit.com/r/cybersecurity/", function(error, response, html) {
    // load  into cheerio = $ 
        var $ = cheerio.load(html);
    // grab title within an p tag
    $("p.title").each(function(i, element) {

      // Save an empty result object
      var result = {};

      // text and href of every link,  save them as properties the result object
      result.title = $(this).text();
      result.link = $(this).children("a").attr("href");

      //  model, create a new entry
      // passes object to the entry (and the title and link)
      var entry = new Article(result);

            // save entry to db
      entry.save(function(err, doc) {
        // Log errors
        if (err) {
          console.log(err);
}
        // Or log the doc
        else {
          console.log(doc);
        }
      });

    });
  });
  // finished scraping  text
     res.send("You've been mongo'ed");
});

// Articles scraped from the mongoDB
app.get("/Articles", function(req, res) {
  // Grab doc in the Articles array
  Article.find({}, function(error, doc) {
    
    if (error) {
      console.log(error);
    }
    
    else {
      res.json(doc);
    }
  });

});



// Article by ObjectId
app.get("/Articles/:id", function(req, res) {
  // Using the id in the id parameter, query that finds  matching one in  db
  Article.findOne({ "_id": req.params.id })
  // populate Notes
  .populate("Note")
  
  .exec(function(error, doc) {
    
    if (error) {
      console.log(error);
    }
    
    else {
      res.json(doc);
    }
  });
});

// Listen on port 3000
app.listen(3000, function() {
    console.log("App running on port 3000!");
});