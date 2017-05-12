/*CARRITO*/
function carrito() {

  var goToCartIcon = function($addTocartBtn) {
    var $cartIcon = $(".my-cart-icon");
    var $image = $('<img width="30px" height="30px" src="' + $addTocartBtn.data("image") + '"/>').css({
      position: "fixed",
      "z-index": "999"
    });
    $addTocartBtn.prepend($image);
    var position = $cartIcon.position();
    $image.animate({
      top: position.top,
      left: position.left
    }, 500, "linear", function() {
      $image.remove();
    });
  };

  $('.my-cart-btn').myCart({
    currencySymbol: '$',
    classCartIcon: 'my-cart-icon',
    classCartBadge: 'my-cart-badge',
    classProductQuantity: 'my-product-quantity',
    classProductRemove: 'my-product-remove',
    classCheckoutCart: 'my-cart-checkout',
    affixCartIcon: true,
    showCheckoutModal: true,
    cartItems: [],
    clickOnAddToCart: function($addTocart) {
      goToCartIcon($addTocart);
    },
    afterAddOnCart: function(products, totalPrice, totalQuantity) {
      console.log("afterAddOnCart", products, totalPrice, totalQuantity);
      // sessionStorage.setItem('products', JSON.stringify(products));
      // sessionStorage.setItem('price', totalPrice);
      // sessionStorage.setItem('quantity', totalQuantity);
    },
    clickOnCartIcon: function($cartIcon, products, totalPrice, totalQuantity) {
      console.log("cart icon clicked", $cartIcon, products, totalPrice, totalQuantity);
    },
    checkoutCart: function(products, totalPrice, totalQuantity) {
      var checkoutString = "Total Price: " + totalPrice + "\nTotal Quantity: " + totalQuantity;
      checkoutString += "\n\n id \t name \t summary \t price \t quantity \t image path";
      $.each(products, function() {
        checkoutString += ("\n " + this.id + " \t " + this.name + " \t " + this.summary + " \t " + this.price + " \t " + this.quantity + " \t " + this.image);
      });
      // window.location.href = "/checkout/?n=fotosAD&p="+totalPrice+"&q="+totalQuantity;
      // alert(checkoutString)

      $.post('/checkout/index2.php', {
          products: JSON.stringify(products)
        })
        .success(function(html) {
          // alert(html); 
          $('body').append(html);
        })
        .error(function() {
          alert('ERROR');
        });

      console.log('***products ' + JSON.stringify(products));
      console.log("checking out", products, totalPrice, totalQuantity);
    },
    getDiscountPrice: function(products, totalPrice, totalQuantity) {
      console.log("calculating discount", products, totalPrice, totalQuantity);
      return totalPrice * 0.5;
    }
  });

  // if (sessionStorage.getItem('products') && sessionStorage.getItem('price') && sessionStorage.getItem('quantity')) {
  //   if (sessionStorage.getItem('quantity') > 0) $('.my-cart-badge').removeClass('empty').html(sessionStorage.getItem('quantity'));
  //   console.log('price ' + sessionStorage.getItem('price'));
  //   console.log('quantity ' + sessionStorage.getItem('quantity'));
  //   console.log('products ' + sessionStorage.getItem('products'));
  // }
}

/*HANDLEBARS*/
let $pathname = location.pathname;
let $section = '';
let $json = '';
let $template = '';

$('body').append('<script id="pictures-template" type="text/x-handlebars-template"></scr' + 'ipt>');

$section = $pathname.includes('/eventos/') ? 'eventos' : ($pathname.includes('/inicio/') ? 'inicio' : ($pathname.includes('/galeria/') ? 'galeria' : ''));
if (!$pathname.includes('/agenda')) {
	$template = $section == 'eventos' ? 'eventos' : $section;

	console.log('$section ' + $section);
	// console.log('$json ' + $json);
	// console.log('$template ' + $template);

	$('#pictures-template').load('/assets/includes/' + $template + 'Template.htm', function() {
		$(document).ready(function() {
			let raw_template = $('#pictures-template').html();
			let template = Handlebars.compile(raw_template);
			let placeHolder = $("#gallery");
			let galleries = getGET();
			$json = $section == 'eventos' ? galleries.g : $section;

			if ($section == 'galeria' || $section == 'inicio') {
				console.log('$section ' + $section);
				Handlebars.registerHelper('full_href', function(picture) {
					return '/eventos/?g=' + picture.ID;
				});

				// Handlebars.registerHelper('full_thumb', function(picture) {
				//   return '/assets/images/eventos/' + picture.evento + '/thumbs/' + picture.thumb + '.jpg';
				// });
			}

			$.get("/assets/datasources/" + $json + ".json", function(data, status, xhr) {
				let html = location.hostname == 'localhost' ? template(JSON.parse(data)) : template(data);
				placeHolder.append(html);
				// $('body').append('<script type="text/javascript" class="scriptCarrito" src="/assets/js/carrito/carrito.js"></script>');
				$('body').append('<script type="text/javascript" src="/assets/js/skel.min.js"></script>');
				$('body').append('<script type="text/javascript" src="/assets/js/jquery.scrolly.min.js"></script>');
				$('body').append('<script type="text/javascript" src="/assets/js/util.js"></script>');
				$('body').append('<script type="text/javascript" src="/assets/js/main.js"></script>');
				carrito();
	/*			 $('#gallery').poptrox({
				  usePopupCaption: true
				});*/
				$('.open-popup-link').magnificPopup({
				  gallery:{
				    enabled:true,
				    preload:0
				  }
				})
			})
		})
	})
}


function getCurrentScroll() {
	return window.pageYOffset || document.documentElement.scrollTop;
}
const shrinkHeader = 100;


/*HEADER COLAPSABLE*/
$(function() {
	$(window).scroll(function() {
		let scroll = getCurrentScroll();
		if (scroll >= shrinkHeader) {
			$('#header').addClass('shrink');
			$('#btnTop').show('400');
		} else {
			$('#header').removeClass('shrink');
			$('#btnTop').hide('400');
		}
	});
});

$(document).ready(function() {
	$('body').append('<div id="btnTop"><span class="fa fa-angle-up "></span></div>');
	if (getCurrentScroll() <= shrinkHeader) $('#btnTop').hide();
	$('#btnTop').click(function() {
		$('html,body').animate({
			scrollTop: 0
		}, 400);
		return false;
	});
});

/*PARAMETROS*/
function getGET() {
	let loc = document.location.href;
	if (loc.indexOf('?') > 0)

	{
		let getString = loc.split('?')[1];
		let GET = getString.split('&');
		let get = {};
		for (let i = 0, l = GET.length; i < l; i++) {
			let tmp = GET[i].split('=');
			//tomo el parametro sin lo que viene despues del #
			get[tmp[0]] = unescape(decodeURI(tmp[1])).indexOf('#')!=-1?unescape(decodeURI(tmp[1])).substr(0, unescape(decodeURI(tmp[1])).indexOf('#')):unescape(decodeURI(tmp[1]));
		}
		// console.log('Parametros ' + get.g);
		return get;
	}

}

/*PAGINA ACTIVA*/
$(function() {
	let $param = location.pathname;
	// console.log('$param ' + $param);
	switch ($param) {
		case '/index.html':
			$('#nav-header ul li.home').addClass('active');
			break;
		case '/galeria/':
			$('#nav-header ul li.gallery').addClass('active');
			break;
		case '/agenda/':
			$('#nav-header ul li.calendar').addClass('active');
			// carrito();
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
	// console.log('$param ' + $param);
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
	// console.log('foto ' + foto);
	let galleries = getGET();
	// console.log('SCRIPTS.JS - galleries ' + JSON.stringify(galleries));
	$.get("/assets/datasources/" + galleries.g + ".json", function(data, status, xhr) {
		let html = location.hostname == 'localhost' ? JSON.parse(data) : data;
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
		// console.log('SCRIPTS - sinCodigo ' + sinCodigo);

		if (arrFiltro.length != 0) {
			// $('#gallery header')
			let $results = '<h3>Resultado de la búsqueda "' + foto + '": ' + arrFiltro.length + (arrFiltro.length > 1 ? ' fotos' : ' foto') + '</h3><div id="results"></div>';
			$('#gallery-wrapper').html($results);
			arrFiltro.forEach(function(el, index) {
				$('#results').append('<div class="media"> <a href="/assets/images/eventos/' + galleries.g + '/' + el + '" data-lighter> <img src="/assets/images/eventos/' + galleries.g + '/thumbs/' + el + '" alt="" title="" /> </a> <div class="cart_btns"><button class="btn btn-danger my-cart-btn" data-id="' + el + '" data-name="foto_' + el + '" data-summary="foto_' + el + '" data-price="' + html.price + '" data-quantity="1" data-image="/assets/images/eventos/' + galleries.g + '/thumbs/' + el + '">Agregar al carrito</button> </div> </div>');
			})
		} else {
			let $results = '<h3>Su búsqueda "' + foto + '" no produjo resultados</h3><h4>Las siguientes fotos no tienen código asignado:</h4><div id="results"></div>';
			$('#gallery-wrapper').html($results);
			sinCodigo.forEach(function(el, index) {
				$('#results').append('<div class="media"> <a href="/assets/images/eventos/' + galleries.g + '/' + el + '" data-lighter> <img src="/assets/images/eventos/' + galleries.g + '/thumbs/' + el + '" alt="" title="" /> </a> <div class="cart_btns"><button class="btn btn-danger my-cart-btn" data-id="' + el + '" data-name="foto_' + el + '" data-summary="foto_' + el + '" data-price="' + html.price + '" data-quantity="1" data-image="/assets/images/eventos/' + galleries.g + '/thumbs/' + el + '">Agregar al carrito</button> </div> </div>');
			})
		}
		carrito();
	});
}

/*GENERALES*/
$('form').placeholder();
$('.scrolly').scrolly();