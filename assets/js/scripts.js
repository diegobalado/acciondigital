/*HANDLEBARS*/
if (location.pathname.includes('gallery.html')){
  $('body').append('<script id="pictures-template" type="text/x-handlebars-template"></scr'+'ipt>');
  $('#pictures-template').load('dataDetailsTemplate.htm', function() {
    $(document).ready(function(){
      var raw_template = $('#pictures-template').html();
      var template = Handlebars.compile(raw_template);
      var placeHolder = $("#gallery");
      var galleries = getGET();
      $.get("galleries/"+galleries.g+"/data.json", function(data,status,xhr){
        var html = template(JSON.parse(data));
        placeHolder.append(html);
      });
      $('body').append('<script type="text/javascript" src="assets/js/main.js"></script>');
      $('body').append('<script type="text/javascript" src="assets/js/carrito/carrito.js"></script>');
    });  
  });
} else {
  console.log('header');
  $('body').append('<script type="text/javascript" src="assets/js/carrito/carrito.js"></script>');
}

/*HEADER COLAPSABLE*/
$(function(){
  var shrinkHeader = 100;
  $(window).scroll(function() {
    var scroll = getCurrentScroll();
    if ( scroll >= shrinkHeader ) {
      $('#header').addClass('shrink');
    }
    else {
      $('#header').removeClass('shrink');
    }
  });
  function getCurrentScroll() {
    return window.pageYOffset || document.documentElement.scrollTop;
  }
});

/*PARAMETROS*/
function getGET()
{
  var loc = document.location.href;
  if(loc.indexOf('?')>0)

  {
    var getString = loc.split('?')[1];
    var GET = getString.split('&');
    var get = {};
    for(var i = 0, l = GET.length; i < l; i++){
      var tmp = GET[i].split('=');
      get[tmp[0]] = unescape(decodeURI(tmp[1]));
    }
    console.log('Parametros ' + get.g);
    return get;
  }

}

/*PAGINA ACTIVA*/
$(function() {
  var $param = location.pathname;
  console.log('$param ' + $param);
  switch($param) {
      case '/index.html':
          $('#nav-header ul li.home').addClass('active');
          break;
      case '/gallery.html':
          $('#nav-header ul li.gallery').addClass('active');
          break;
      case '/contact.html':
          $('#nav-header ul li.contact').addClass('active');
          break;
      default:
          $('#nav-header ul li.home').addClass('active');
  } 
})