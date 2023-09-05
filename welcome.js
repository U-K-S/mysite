$(document).ready(function() {
    animateText(".welcome-text", "Welcome");
  });
  
  function animateText(element, text) {
    var characters = text.split("");
    var newText = "";
  
    for (var i = 0; i < characters.length; i++) {
      newText += "<span style='opacity: 0;'>" + characters[i] + "</span>";
    }
  
    $(element).html(newText);
  
    $(element + " span").each(function(index) {
      $(this).delay(500 * index).animate({ opacity: 1 }, 500);
    });
  }
  