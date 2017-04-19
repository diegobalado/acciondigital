/*HANDLEBARS*/
let $pathname = location.pathname;
let $section = '';
let $json = '';
let $template = '';

$('body').append('<script id="pictures-template" type="text/x-handlebars-template"></scr'+'ipt>');

$section = $pathname.includes('/eventos/')?'eventos':($pathname.includes('/inicio/')?'inicio':($pathname.includes('/galeria/')?'galeria':''));
$template = $section=='eventos'?'eventos':$section;

console.log('$section ' + $section);
console.log('$json ' + $json);
console.log('$template ' + $template);

$('#pictures-template').load('/assets/includes/'+$template+'Template.htm', function() {
  $(document).ready(function(){
    let raw_template = $('#pictures-template').html();
    let template = Handlebars.compile(raw_template);
    let placeHolder = $("#gallery");
    let galleries = getGET();
    $json = $section=='eventos'?galleries.g:$section;

    if ($section == 'galeria' || $section == 'inicio') {
      Handlebars.registerHelper('full_href', function(picture) {
        return '/eventos/?g=' + picture.evento;
      });

      Handlebars.registerHelper('full_thumb', function(picture) {
        return '/assets/images/eventos/' + picture.evento + '/thumbs/' + picture.thumb + '.jpg';
      });
    }

    $.get("/assets/datasources/"+$json+".json", function(data,status,xhr){
      let html = location.hostname=='localhost'?template(JSON.parse(data)):template(data);
      placeHolder.append(html);
      $('body').append('<script type="text/javascript" src="/assets/js/carrito/carrito.js"></script>');
      if ($section == 'eventos') $('body').append('<script type="text/javascript" src="/assets/js/jquery.poptrox.min.js"></script>');
      $('body').append('<script type="text/javascript" src="/assets/js/skel.min.js"></script>');
      $('body').append('<script type="text/javascript" src="/assets/js/jquery.scrolly.min.js"></script>');
      $('body').append('<script type="text/javascript" src="/assets/js/util.js"></script>');
      $('body').append('<script type="text/javascript" src="/assets/js/main.js"></script>');
     //  $('#gallery').poptrox({
     //   usePopupCaption: true
     // });
   });
  })
})


function getCurrentScroll() {
  return window.pageYOffset || document.documentElement.scrollTop;
}
const shrinkHeader = 100;
/*HEADER COLAPSABLE*/
$(function(){
  $(window).scroll(function() {
    let scroll = getCurrentScroll();
    if ( scroll >= shrinkHeader ) {
      $('#header').addClass('shrink');
      $('#btnTop').show('400');
    }
    else {
      $('#header').removeClass('shrink');
      $('#btnTop').hide('400');
    }
  });
});

$(document).ready(function() {
  $('body').append('<div id="btnTop"><span class="fa fa-angle-up "></span></div>');
  if (getCurrentScroll() <= shrinkHeader) $('#btnTop').hide();
  $('#btnTop').click(function(){ 
    $('html,body').animate({ scrollTop: 0 }, 400);
    return false; 
  });
});

/*PARAMETROS*/
function getGET()
{
  let loc = document.location.href;
  if(loc.indexOf('?')>0)

  {
    let getString = loc.split('?')[1];
    let GET = getString.split('&');
    let get = {};
    for(let i = 0, l = GET.length; i < l; i++){
      let tmp = GET[i].split('=');
      get[tmp[0]] = unescape(decodeURI(tmp[1]));
    }
    console.log('Parametros ' + get.g);
    return get;
  }

}

/*PAGINA ACTIVA*/
$(function() {
  let $param = location.pathname;
  console.log('$param ' + $param);
  switch($param) {
    case '/index.html':
    $('#nav-header ul li.home').addClass('active');
    break;
    case '/galeria/':
    $('#nav-header ul li.gallery').addClass('active');
    break;
    case '/eventos/':
    $('#nav-header ul li.gallery').addClass('active');
    break;
    case '/contacto/':
    $('#nav-header ul li.contact').addClass('active');
    break;
    default:
    $('#nav-header ul li.home').addClass('active');
  } 
})

/*BUSCADOR*/
$(function() {
  let $param = location.pathname;
  console.log('$param ' + $param);
  if ($param != '/index.html' || $param != '/inicio/') {
    $('#nav-header ul li.toggle_search').removeClass('hidden');
  } 
  $('.toggle_search').on('click', function(event) {
    event.preventDefault();
    $('#nav-header ul').toggleClass('shown').toggleClass('hidden');
    $('#nav-header .buscador').toggleClass('hidden').toggleClass('shown');
  });
})

function buscar(foto) {
  console.log('foto ' + foto);
  let galleries = getGET();
  console.log('SCRIPTS.JS - galleries ' + JSON.stringify(galleries));
  $.get("/assets/datasources/"+galleries.g+".json", function(data,status,xhr){
    let html = location.hostname=='localhost'?JSON.parse(data):data;
    let arrFiltro = [];
    let sinCodigo = [];
    let codigo = '';
    html.pictures.forEach(function(el, index) {
      if (el.indexOf('-') == -1) sinCodigo.push(el)
        else {
          codigo = el.substr(el.indexOf('-'), el.length);
          if (codigo.indexOf(foto) != -1) arrFiltro.push(el);
        }
      });
    console.log('SCRIPTS - sinCodigo ' + sinCodigo);

    if (arrFiltro.length != 0) {
      // $('#gallery header')
      let $results = '<h3>Resultado de la búsqueda "'+foto+'": '+ arrFiltro.length + (arrFiltro.length>1?' fotos':' foto')+'</h3><div id="results"></div>';
      $('#gallery-wrapper').html($results);
      arrFiltro.forEach(function(el, index) {
        $('#results').append('<div class="media"> <a href="/assets/images/eventos/'+galleries.g+'/'+el+'" data-lighter> <img src="/assets/images/eventos/'+galleries.g+'/thumbs/'+el+'" alt="" title="" /> </a> <div class="cart_btns"><button class="btn btn-danger my-cart-btn" data-id="3" data-name="product 3" data-summary="summary 3" data-price="20" data-quantity="1" data-image="images/170301/thumbs/03.jpg">Agregar al carrito</button> </div> </div>');
      })
    } else {
      let $results = '<h3>Su búsqueda "'+foto+'" no produjo resultados</h3><h4>Las siguientes fotos no tienen código asignado:</h4><div id="results"></div>';
      $('#gallery-wrapper').html($results);
      sinCodigo.forEach(function(el, index) {
        $('#results').append('<div class="media"> <a href="/assets/images/eventos/'+galleries.g+'/'+el+'" data-lighter> <img src="/assets/images/eventos/'+galleries.g+'/thumbs/'+el+'" alt="" title="" /> </a> <div class="cart_btns"><button class="btn btn-danger my-cart-btn" data-id="3" data-name="product 3" data-summary="summary 3" data-price="20" data-quantity="1" data-image="images/170301/thumbs/03.jpg">Agregar al carrito</button> </div> </div>');
      })
    }

  });
}

/*GENERALES*/
$('form').placeholder();
$('.scrolly').scrolly();
