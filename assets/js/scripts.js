const phs = {
	default: {
		value: 'JPF',
		label: 'Javier Piva Flos'
	},
	JPF: {
		value: 'JPF',
		label: 'Javier Piva Flos'
	}
}

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

	$('.my-cart-btn').off();
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
    },
    clickOnCartIcon: function($cartIcon, products, totalPrice, totalQuantity) {
    	// console.log("cart icon clicked", $cartIcon, products, totalPrice, totalQuantity);
    },
    checkoutCart: function(products, totalPrice, totalQuantity) {
    	var checkoutString = "Total Price: " + totalPrice + "\nTotal Quantity: " + totalQuantity;
    	checkoutString += "\n\n id \t name \t summary \t price \t quantity \t image path";
    	$.each(products, function() {
    		checkoutString += ("\n " + this.id + " \t " + this.name + " \t " + this.summary + " \t " + this.price + " \t " + this.quantity + " \t " + this.image);
    	});

      $.post('/checkout/index3.php', {
      	products: products,
      	totalPrice: totalPrice
      })
      .success(function(html) {
      	$('#main').html(html);
      })
      .error(function() {
      	alert('ERROR');
      });

    },
    getDiscountPrice: function(products, totalPrice, totalQuantity) {
    	const cantPromo = 5;
    	let finalPrice = totalPrice;
    	let unityPrice = totalPrice/totalQuantity;
    	if (totalQuantity >= cantPromo) {
    		finalPrice = 0
    		return finalPrice;
    	} else return null;
    }
  });
}

const loadEvents = (json, filter) => {
	const parsedJson = {
		ads: json.ads,
		eventos: filter !== 'all' ? json.eventos.filter(e => (e.ph === filter || (filter === phs.default.value && !e.ph))) : json.eventos
	}
	var placeHolder = $("#homeGallery");
	var raw_template = $('#pictures-template').html();
	var template = Handlebars.compile(raw_template);

	parsedJson.ads.forEach(ad => {
		if (!ad.href) ad.href = '#';
		ad.target = (ad.href !== '#') ? '_blank' : '_self'
	})
	var html = template(parsedJson);
	placeHolder.html(html);
	carrito();
}

var json_data = '';
/*HANDLEBARS*/
const loadGallery = (filter = 'all') => {
	var $pathname = location.pathname;
	var $section = '';
	var $json = '';
	var $template = '';

	$('body').append('<script id="pictures-template" type="text/x-handlebars-template"></scr' + 'ipt>');

	$section = $pathname.includes('/eventos/') ? 'eventos' : ($pathname.includes('/inicio/') ? 'inicio' : ($pathname.includes('/galeria/') ? 'galeria' : ''));
	if (!$pathname.includes('/amigos')) {
		$template = $section == 'eventos' ? 'eventos' : $section;

		$('#pictures-template').load('/assets/includes/' + $template + 'Template.htm', function () {
			$(document).ready(function () {
				var galleries = getGET();
				$json = $section === 'eventos' ? galleries.g : $section;

				if ($section == 'galeria' || $section == 'inicio') {
					Handlebars.registerHelper('full_href', function (picture) {
						return '/eventos/?g=' + picture.ID;
					});
				}

				if (json_data === '') {
					$.get("/assets/datasources/" + $json + ".json", function (data, status, xhr) {
						json_data = location.hostname === 'localhost' ? JSON.parse(data) : data;
						loadEvents(json_data, filter);
					})
				} else {
					loadEvents(json_data, filter);				
				}
			})
		})
	}
}

function getCurrentScroll() {
	return window.pageYOffset || document.documentElement.scrollTop;
}
const shrinkHeader = 100;

/*HEADER COLAPSABLE*/
$(function() {
	$(window).scroll(function() {
		var scroll = getCurrentScroll();
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
	$('select#ph').append('<option value="all">Todos</option>')
	Object.keys(phs).map(ph => {
		ph !== 'default' && $('select#ph').append(`<option value="${phs[ph].value}">${phs[ph].label}</option>`)
	})
	loadGallery();
	$('select#ph').on('change', event => loadGallery(event.target.value));
});

/*PARAMETROS*/
function getGET() {
	var loc = document.location.href;
	if (loc.indexOf('?') > 0)

	{
		var getString = loc.split('?')[1];
		var GET = getString.split('&');
		var get = {};
		for (var i = 0, l = GET.length; i < l; i++) {
			var tmp = GET[i].split('=');
			//tomo el parametro sin lo que viene despues del #
			get[tmp[0]] = unescape(decodeURI(tmp[1])).indexOf('#')!=-1?unescape(decodeURI(tmp[1])).substr(0, unescape(decodeURI(tmp[1])).indexOf('#')):unescape(decodeURI(tmp[1]));
		}
		// console.log('Parametros ' + get.g);
		return get;
	}

}

/*PAGINA ACTIVA*/
$(function() {
	var $param = location.pathname;
	// console.log('$param ' + $param);
	switch ($param) {
		case '/index.html':
			$('#nav-header ul li.home').addClass('active');
			break;
		case '/galeria/':
			$('#nav-header ul li.gallery').addClass('active');
			break;
		case '/amigos/':
			$('#nav-header ul li.friends').addClass('active');
			break;
		case '/eventos/':
			$('#nav-header ul li.gallery').addClass('active');
			break;
		case '/contacto/':
			$('#nav-header ul li.contact').addClass('active');
			break;
		case '/faq/':
			$('#nav-header ul li.faq').addClass('active');
			break;
		default:
			$('#nav-header ul li.home').addClass('active');
	}
	carrito();
})

/*BUSCADOR*/
$(function() {
	var $param = location.pathname;
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
	var galleries = getGET();
	$.get("/assets/datasources/" + galleries.g + ".json", function(data, status, xhr) {
		var html = location.hostname == 'localhost' ? JSON.parse(data) : data;
		var arrFiltro = [];
		var sinCodigo = [];
		var codigo = '';
		html.pictures.forEach(function(el, index) {
			if (el.indexOf('-') == -1) sinCodigo.push(el)
			else {
				codigo = el.substr(el.indexOf('-'), el.length);
				if (codigo.indexOf(foto) != -1) arrFiltro.push(el);
			}
		});

		if (arrFiltro.length != 0) {
			var $results = '<h3>Resultado de la búsqueda "' + foto + '": ' + arrFiltro.length + (arrFiltro.length > 1 ? ' fotos' : ' foto') + '</h3><div id="results"></div>';
			$('#gallery-wrapper').html($results);
			arrFiltro.forEach(function(el, index) {
				// $('#results').append('<div class="media"> '+
				// 	'	<a href="#' + galleries.g + '_' + el + '" class="open-popup-link" > '+
				// 	'		<img src="/assets/images/eventos/' + galleries.g + '/thumbs/' + el + '.jpg" alt="" title="" /> '+
				// 	'	</a> '+
				// 	'	<div class="cart_btns">'+
				// 	'		<button class="btn btn-danger my-cart-btn" data-id="' + el + '" data-name="foto_' + el + '" data-summary="foto_' + el + '"' + ' data-price="' + html.price + '" data-quantity="1" data-image="/assets/images/eventos/' + galleries.g + '/thumbs/' + el + '.jpg">Agregar al carrito</button> '+
				// 	'	</div> '+
				// 	'</div> '+
				// 	'<div id=' + galleries.g + '_' + el + ' class="white-popup mfp-hide"> '+
				// 	'	<div class="button-group"> '+
				// 	'		<iframe class="fb_iframe_widget" src="https://www.facebook.com/plugins/share_button.php?href=http://www.acciondigitalfoto.com/assets/images/eventos/' + galleries.g + '/' + el + '.jpg&layout=button&size=large&mobile_iframe=true&width=100&height=28&appId" width="100" height="28" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true"></iframe>'+
				// 	'		<div class="cart_btns">'+
				// 	'			<button class="btn btn-danger my-cart-btn" data-id=' + el + ' data-name=foto' + el + ' data-summary=foto_' + el + ' data-price="' +  html.price + '" data-quantity="1" data-image=/assets/images/eventos/' + galleries.g + '/thumbs/' + el + '>Agregar al carrito</button> '+ 
				// 	'		</div> '+
				// 	'	</div> '+
				// 	'	<div class="img-wrapper"> '+
				// 	'		<img src=/assets/images/eventos/' + galleries.g + '/' + el + '.jpg alt="" title="" /> '+
				// 	'	</div> '+
				// 	'</div>');

				$('#results').append(`<div class="media"> 
						<a href="#${galleries.g}_${el}" class="open-popup-link" > 
							<img src="/assets/images/eventos/${galleries.g}/thumbs/${el}.jpg" alt="" title="" /> 
						</a> 
						<div class="cart_btns">
							<button class="btn btn-danger my-cart-btn" data-id="${el}" data-name="foto_${el}" data-summary="foto_${el}" data-price="${html.price}" data-quantity="1" data-image="/assets/images/eventos/${galleries.g}/thumbs/${el}.jpg">Agregar al carrito</button> 
						</div> 
					</div> 
					<div id=${galleries.g}_${el} class="white-popup mfp-hide"> 
						<div class="button-group"> 
							<iframe class="fb_iframe_widget" src="https://www.facebook.com/plugins/share_button.php?href=http://www.acciondigitalfoto.com/assets/images/eventos/${galleries.g}/${el}.jpg&layout=button&size=large&mobile_iframe=true&width=100&height=28&appId" width="100" height="28" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true"></iframe>
							<div class="cart_btns">
								<button class="btn btn-danger my-cart-btn" data-id=${el} data-name=foto${el} data-summary=foto_${el} data-price="${html.price}" data-quantity="1" data-image=/assets/images/eventos/${galleries.g}/thumbs/${el}>Agregar al carrito</button>  
							</div> 
						</div> 
						<div class="img-wrapper"> 
							<img src=/assets/images/eventos/${galleries.g}/${el}.jpg alt="" title="" /> 
						</div> 
					</div>`);
			})
		} else {
			var $results = '<h3>Tu búsqueda "' + foto + '" no produjo resultados.</h3><h4>Las siguientes fotos no tienen código asignado:</h4><div id="results"></div>';
			$('#gallery-wrapper').html($results);
			sinCodigo.forEach(function(el, index) {
				// $('#results').append(
				// 	'<div class="media"> '+
				// 	'	<a href="#' + galleries.g + '_' + el + '" class="open-popup-link" > '+
				// 	'		<img src="/assets/images/eventos/' + galleries.g + '/thumbs/' + el + '.jpg" alt="" title="" /> '+
				// 	'	</a> '+
				// 	'	<div class="cart_btns">'+
				// 	'		<button class="btn btn-danger my-cart-btn" data-id="' + el + '" data-name="foto_' + el + '" data-summary="foto_' + el + '" data-price="' + html.price + '" data-quantity="1" data-image="/assets/images/eventos/' + galleries.g + '/thumbs/' + el + '.jpg">Agregar al carrito</button> '+
				// 	'	</div> '+
				// 	'</div> '+
				// 	'<div id=' + galleries.g + '_' + el + ' class="white-popup mfp-hide"> '+
				// 	'	<div class="button-group"> '+
				// 	'		<iframe class="fb_iframe_widget" src="https://www.facebook.com/plugins/share_button.php?href=http://www.acciondigitalfoto.com/assets/images/eventos/' + galleries.g + '/' + el + '.jpg&layout=button&size=large&mobile_iframe=true&width=100&height=28&appId" width="100" height="28" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true"></iframe> '+
				// 	'		<div class="cart_btns">'+
				// 	'			<button class="btn btn-danger my-cart-btn" data-id=' + el + ' data-name=foto' + el + ' data-summary=foto_' + el + ' data-price="' + html.price + '" data-quantity="1" data-image=/assets/images/eventos/' + galleries.g + '/thumbs/' + el + '>Agregar al carrito</button> '+
				// 	'		</div> '+
				// 	'	</div> '+
				// 	'	<div class="img-wrapper"> '+
				// 	'		<img src=/assets/images/eventos/' + galleries.g + '/' + el + '.jpg alt="" title="" /> '+
				// 	'	</div> '+
				// 	'</div>');

				$('#results').append(`<div class="media">
						<a href="#${galleries.g}_${el}" class="open-popup-link" >
							<img src="/assets/images/eventos/${galleries.g}/thumbs/${el}.jpg" alt="" title="" />
						</a>
						<div class="cart_btns"
							<button class="btn btn-danger my-cart-btn" data-id="${el}" data-name="foto_${el}" data-summary="foto_${el}" data-price="${html.price}" data-quantity="1" data-image="/assets/images/ventos/${galleries.g}/thumbs/${el}.jpg">Agregar al carrito</button>
						</div>
					</div>
					<div id=${galleries.g}_${el} class="white-popup mfp-hide">
						<div class="button-group">
							<iframe class="fb_iframe_widget" src="https://www.facebook.com/plugins/share_button.php?href=http://www.acciondigitalfoto.com/assets/images/eventos/${galleries.g}/${el}.jpg&layout=button&size=large&mobile_iframe=true&width=100&height=28&appId" width="100" height="28" tyle="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true"></iframe>
							<div class="cart_btns"
								<button class="btn btn-danger my-cart-btn" data-id=${el} data-name=foto${el} data-summary=foto_${el} data-price="${html.price}" data-quantity="1" data-image=/assets/images/eventos/${galleries.g}/humbs/${el}>Agregar al carrito</button>
							</div>
						</div>
						<div class="img-wrapper">
							<img src=/assets/images/eventos/${galleries.g}/${el}.jpg alt="" title="" />
						</div>
					</div>`);
			})
		}
		carrito();
	});
}

/*GENERALES*/
$('form').length>0 && $('form').placeholder();
$('.scrolly').length>0 && $('.scrolly').scrolly();