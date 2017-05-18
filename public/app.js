// articles as a json
$.getJSON("/articles", function(data) {
  // For each 
  for (var i = 0; i < data.length; i++) {
    // Display information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});


//  clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes 
  $("#notes").empty();
g
  var thisId = $(this).attr("data-id");

 // ajax call

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })

    .done(function(data) {
      console.log(data);
      
      $("#notes").append("<h2>" + data.title + "</h2>");
      
      $("#notes").append("<input id='titleinput' name='title' >");
      
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// save note button
$(document).on("click", "#savenote", function() {

  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      
      title: $("#titleinput").val(),
      
      body: $("#bodyinput").val()
    }
  })
    
    .done(function(data) {

      console.log(data);
      // Empty the notes 
      $("#notes").empty();
    });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});