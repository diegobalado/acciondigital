/*HANDLEBARS*/
$('body').append('<script id="pictures-template" type="text/x-handlebars-template"></scr'+'ipt>');
$('#pictures-template').load('dataDetailsTemplate.htm', function() {
//wait for page to load
$(document).ready(function(){
  // Extract the text from the template .html() is the jquery helper method for that
  var raw_template = $('#pictures-template').html();
  // Compile that into an handlebars template
  var template = Handlebars.compile(raw_template);
  // Retrieve the placeHolder where the Posts will be displayed 
  var placeHolder = $("#gallery-wrapper");
  // Fetch all Blog Posts data from server in JSON
  $.get("pictures.json", function(data,status,xhr){
  	var html = template(JSON.parse(data));
    // Render the posts into the page
    placeHolder.append(html);
  });
});  
});

/*HEADER COLAPSABLE*/
$(function(){
  var shrinkHeader = 150;
  $(window).scroll(function() {
    var scroll = getCurrentScroll();
    if ( scroll >= shrinkHeader ) {
      $('#header').addClass('shrink');
      $('#nav-header').addClass('fixed');
    }
    else {
      $('#header').removeClass('shrink');
      $('#nav-header').removeClass('fixed');
    }
  });
  function getCurrentScroll() {
    return window.pageYOffset || document.documentElement.scrollTop;
  }
});