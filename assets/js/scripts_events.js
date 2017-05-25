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

      $.post('/checkout/index3.php', {
      	products: products
      })
      .success(function(html) {
      	// console.log('**products ' + JSON.stringify(products)); 
      	$('body').html(html);
      })
      .error(function() {
      	alert('ERROR');
      });

      // console.log('***products ' + JSON.stringify(products));
      console.log("checking out", products, totalPrice, totalQuantity);
    },
    getDiscountPrice: function(products, totalPrice, totalQuantity) {
    	const cantPromo = 5;
    	let finalPrice = totalPrice;
    	let unityPrice = totalPrice/totalQuantity;
    	if (totalQuantity >= cantPromo) {
    		finalPrice = Math.floor(totalQuantity/cantPromo)*unityPrice/1.2*cantPromo + (totalQuantity%cantPromo)*unityPrice;
    		console.log('***finalPrice ' + finalPrice);
    		return finalPrice;
    	} else return null;
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

	// console.log('$section ' + $section);
	// console.log('$json ' + $json);
	// console.log('$template ' + $template);

	$('#pictures-template').load('/assets/includes/' + $template + 'Template.htm', function() {
		$(document).ready(function() {
			let raw_template = $('#pictures-template').html();
			let template = Handlebars.compile(raw_template);
			let events_placeholder = $("#gallery-wrapper");
			let title_placeholder = $("#gallery_title");
			let ads_placeHolder = $("#gallery-ad");
			let galleries = getGET();
			$json = $section == 'eventos' ? galleries.g : $section;

			if ($section == 'galeria' || $section == 'inicio') {
				// console.log('$section ' + $section);
				Handlebars.registerHelper('full_href', function(picture) {
					return '/eventos/?g=' + picture.ID;
				});

				// Handlebars.registerHelper('full_thumb', function(picture) {
				//   return '/assets/images/eventos/' + picture.evento + '/thumbs/' + picture.thumb + '.jpg';
				// });
			}

			$.get("/assets/datasources/" + $json + ".json", function(data, status, xhr) {
				// let html = location.hostname == 'localhost' ? template(JSON.parse(data)) : template(data);
				// data.forEach(function(element){
				// 	console.log(element);
				// })
				// console.log(JSON.parse(data).pictures);

				// console.log('***data ' + data);
				let IdEvento = location.hostname == 'localhost' ? JSON.parse(data).IdEvento : data.IdEvento;
				let title = location.hostname == 'localhost' ? JSON.parse(data).title : data.title;
				let price = location.hostname == 'localhost' ? JSON.parse(data).price : data.price;
				let json_data = location.hostname == 'localhost' ? JSON.parse(data) : data;

				let html_element = '';
				let pics_length = location.hostname == 'localhost' ? JSON.parse(data).pictures.length : data.pictures.length;
				let index = 0;

				let $page_start = 0;
				let $page_limit = 9;

				var load_page = function(placeholder, page_start, page_limit, data){
					// console.log('***arranca ');
					placeholder.append($('.loading').detach());
					$('.loading').fadeIn("fast");
					let pic = '';					
					var i = 0;
					for (i = page_start; i < page_start+page_limit; i++) {
						pic = data.pictures[i];
						html_element = '<div class="media">  <a href=#' + data.IdEvento + '_' + pic + ' class="open-popup-link" > <img style="background:url(/assets/images/loading.gif) transparent no-repeat" src=/assets/images/eventos/' + data.IdEvento + '/thumbs/' + pic + '.jpg alt="" title="" /> </a> <div class="cart_btns"><button class="btn btn-danger my-cart-btn" data-id=' + pic + ' data-name="['+title+'] foto ' + pic + '" data-summary=foto_' + pic + ' data-price="' + data.price + '" data-quantity="1" data-image=/assets/images/eventos/' + data.IdEvento + '/thumbs/' + pic + '.jpg >Agregar al carrito</button> </div> <div id=' + data.IdEvento + '_' + pic + ' class="white-popup mfp-hide"> <div class="button-group"> <a target="_blank" class="btn btn-facebook" href="https://www.facebook.com/dialog/share?app_id=1465682393746715&amp;display=popup&amp;redirect_uri=&amp;href=http://www.acciondigitalfoto.com/assets/images/eventos/'+ data.IdEvento + '/' + pic + '.jpg"><i class="fa fa-facebook-square"></i>Compartir</a> <div class="cart_btns"><button class="btn btn-danger my-cart-btn" data-id=' + pic + ' data-name="['+title+'] foto ' + pic + '" data-summary=foto_' + pic + ' data-price="' + data.price + '" data-quantity="1" data-image=/assets/images/eventos/' + data.IdEvento + '/thumbs/' + pic + '.jpg >Agregar al carrito</button> </div> </div> <div class="img-wrapper"> <img src=/assets/images/eventos/' + data.IdEvento + '/' + pic + '.jpg alt="" title="" /> </div> </div> </div>';
						placeholder.append(html_element);
						// if ($('#'+ galleries.g + '_' + pic +' .img-wrapper img')[0].complete) $('.'+ galleries.g + '_' + pic).fadeOut("slow");
						
					}
					console.log('***data.pictures[i-1] ' + $('#'+ data.IdEvento + '_' + data.pictures[i-2] +' .img-wrapper img')[0].complete);
					let loading = setInterval(function(){ 
						if ($('#'+ data.IdEvento + '_' + data.pictures[page_start] +' .img-wrapper img')[0].complete) {
							console.log('***intento ');
							$('.loading').fadeOut("fast");
							clearInterval(loading);
						}
					}, 500); 
					// console.log('***data.pictures[i-1] ' + (data.pictures[i-1]));
					// console.log('***$(data.pictures[i-1] ' + ($('#'+ data.IdEvento + '_' + data.pictures[i-1]+' .img-wrapper img').attr('src')));
					// console.log('***complete '+ $('#'+ data.IdEvento + '_' + data.pictures[i-1] +' .img-wrapper img')[0].complete);
					carrito();
					$('.open-popup-link').magnificPopup({
						gallery:{
							enabled:true,
							preload:0
						}
					})
				}

				$('.events-page').on('click', '.mfp-arrow-right', function(event) {

					if ($('#'+$('.mfp-arrow-right').parent().find('.mfp-content .white-popup').attr('id')) == $('.media').next().last()) { 
						alert('ultimo');
					}
				});

				load_page(events_placeholder, $page_start, $page_limit, json_data);						
				$page_start += $page_limit;
				let $pagina = 1;

				$(window).on('scroll', _.debounce(function() {
					if ($page_start + $page_limit <= pics_length && $page_limit != 0 && !$('#gallery-wrapper').hasClass('results')) {
						if (($(window).outerHeight(true) + $(window).scrollTop()) > ($('#gallery-wrapper').height() - 200)) {
							load_page(events_placeholder, $page_start, $page_limit, json_data);
							
							$page_start += $page_limit;				
							
							$page_limit = ($page_start + $page_limit > pics_length)?(pics_length-$page_start):$page_limit;
						}
					}
				}, 200));


				let html_ads = '<div id="gallery-ad" id="gallery-ad"> {{#ads}} <a href={{this.href}} target="_blank"> <img src=/assets/images/ads/{{this.name}} alt="" /> </a> {{/ads}} </div>';

				var load_ads = function(placeholder, data){
					let ad = '';				
					
					// console.log('***data.ads.length ' + data.ads.length);

					for (var i = 0; i < data.ads.length; i++) {
						ad = data.ads[i];
						// console.log('***ad.href ' + ad.href);
						html_ads = '<a href=' + ad.href + ' target="_blank"> <img src=/assets/images/ads/' + ad.name + ' alt="" /> </a>';
						placeholder.append(html_ads);
					}
				}

				load_ads(ads_placeHolder, json_data);

				title_placeholder.append(title);
								
				// $('body').append('<script type="text/javascript" class="scriptCarrito" src="/assets/js/carrito/carrito.js"></script>');
				$('body').append('<script type="text/javascript" src="/assets/js/skel.min.js"></script>');
				$('body').append('<script type="text/javascript" src="/assets/js/jquery.scrolly.min.js"></script>');
				$('body').append('<script type="text/javascript" src="/assets/js/util.js"></script>');
				$('body').append('<script type="text/javascript" src="/assets/js/main.js"></script>');
				
				carrito();
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
	carrito();
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
		let title = html.title;
		let price = html.price;
		let codigo = '';
		
		html.pictures.forEach(function(el, index) {
			if (el.indexOf('-') == -1) sinCodigo.push(el)
				else {
					codigo = el.substr(el.indexOf('-')+1, el.length);
					if (codigo.split('-').length > 1) {
						codigo.split('-').forEach(function(element, i){
							console.log('***element ' + element);
							if (element == foto) arrFiltro.push(el);
						})
					} else if (codigo == foto) arrFiltro.push(el);
					// console.log('***codigo.split(-) ' + codigo.split('-').length);
				}
			});
		// console.log('SCRIPTS - sinCodigo ' + sinCodigo);

		var load_page = function(placeholder, page_start, page_limit, data){
			// console.log('***data ' + data);
			// console.log('***JSON.stringify(data) ' + JSON.stringify(data));

			let pic = '';					

			for (var i = page_start; i < page_start+page_limit; i++) {
				pic = data[i];

				// console.log('***pic ' + pic);
				
				html_element = '<div class="media"><a href=#' + galleries.g + '_' + pic + ' class="open-popup-link" > <img style="background:url(/assets/images/loading.gif) transparent no-scroll" src=/assets/images/eventos/' + galleries.g + '/thumbs/' + pic + '.jpg alt="" title="" /> </a> <div class="cart_btns"><button class="btn btn-danger my-cart-btn" data-id=' + pic + ' data-name"=['+title+'] foto ' + pic + '" data-summary=foto_' + pic + ' data-price="' + price + '" data-quantity="1" data-image=/assets/images/eventos/' + galleries.g + '/thumbs/' + pic + '.jpg >Agregar al carrito</button> </div> <div id=' + galleries.g + '_' + pic + ' class="white-popup mfp-hide"> <div class="button-group"> <a target="_blank" class="btn btn-facebook" href="https://www.facebook.com/dialog/share?app_id=1465682393746715&amp;display=popup&amp;redirect_uri=&amp;href=http://www.acciondigitalfoto.com/assets/images/eventos/'+ galleries.g + '/' + pic + '.jpg"><i class="fa fa-facebook-square"></i>Compartir</a> <div class="cart_btns"><button class="btn btn-danger my-cart-btn" data-id=' + pic + ' data-name="['+title+'] foto ' + pic + '" data-summary=foto_' + pic + ' data-price="' + price + '" data-quantity="1" data-image=/assets/images/eventos/' + galleries.g + '/thumbs/' + pic + '.jpg >Agregar al carrito</button> </div> </div> <div class="img-wrapper"> <img src=/assets/images/eventos/' + galleries.g + '/' + pic + '.jpg alt="" title="" /> </div> </div> </div>';

				// console.log('***placeholder ' + placeholder);
				// console.log('***html_element ' + html_element);
				
				$('#results').append(html_element);
			}
			// if ($('#'+ galleries.g + '_' + data[i] +' .img-wrapper img')[0].complete) $('.'+ galleries.g + '_' + data[i]).fadeOut("slow");
			carrito();
			$('.open-popup-link').magnificPopup({
				gallery:{
					enabled:true,
					preload:0
				}
			})
		}

		if (arrFiltro.length != 0) {
			// console.log('***arrFiltro.length ' + arrFiltro.length);
			// $('#gallery header')
			let $results = '<h3>Resultado de la búsqueda "' + foto + '": ' + arrFiltro.length + (arrFiltro.length > 1 ? ' fotos' : ' foto') + '</h3><div id="results"></div>';
			
			let events_placeholder = $('#results');

			// console.log('***events_placeholder ' + events_placeholder);

			$('#gallery-wrapper').addClass('results').html($results);
			
			// console.log('***arrFiltro ' + arrFiltro);
			
			let IdEvento = html.IdEvento;
			let title = html.title;
			// let price = arrFiltro.price;
			let json_arrFiltro = arrFiltro;

			let html_element = '';
			let pics_length = arrFiltro.length;
			let index = 0;

			let $page_start = 0;
			let $page_limit = 9;

			$page_limit = ($page_limit > pics_length)?pics_length:$page_limit;

			load_page(events_placeholder, $page_start, $page_limit, arrFiltro);						
			$page_start += $page_limit;
			let $pagina = 1;

			$(window).scroll(function(){
				if ($page_start + $page_limit <= pics_length && $page_limit != 0) {
					if (($(window).outerHeight(true) + $(window).scrollTop()) > ($(document).height() - 300)) {
						load_page(events_placeholder, $page_start, $page_limit, arrFiltro);
						
						$page_start += $page_limit;				
						
						$page_limit = ($page_start + $page_limit > pics_length)?(pics_length-$page_start):$page_limit;
					}
				}
			})

			// arrFiltro.forEach(function(el, index) {
			// 	$('#results').append('<div class="media"> '+
			// 		'	<a href="#' + galleries.g + '_' + el + '" class="open-popup-link" > '+
			// 		'		<img src="/assets/images/eventos/' + galleries.g + '/thumbs/' + el + '.jpg" alt="" title="" /> '+
			// 		'	</a> '+
			// 		'	<div class="cart_btns">'+
			// 		'		<button class="btn btn-danger my-cart-btn" data-id="' + el + '" data-name="foto_' + el + '" data-summary="foto_' + el + '"' + ' data-price="' + html.price + '" data-quantity="1" data-image="/assets/images/eventos/' + galleries.g + '/thumbs/' + el + '.jpg">Agregar al carrito</button> '+
			// 		'	</div> '+
			// 		'</div> '+
			// 		'<div id=' + galleries.g + '_' + el + ' class="white-popup mfp-hide"> '+
			// 		'	<div class="button-group"> '+
			// 		'		<iframe class="fb_iframe_widget" src="https://www.facebook.com/plugins/share_button.php?href=http://acciondigital.000webhostapp.com/assets/images/eventos/' + galleries.g + '/' + el + '.jpg&layout=button&size=large&mobile_iframe=true&width=100&height=28&appId" width="100" height="28" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true"></iframe>'+
			// 		'		<div class="cart_btns">'+
			// 		'			<button class="btn btn-danger my-cart-btn" data-id=' + el + ' data-name=foto_' + el + ' data-summary=foto_' + el + ' data-price="' +  html.price + '" data-quantity="1" data-image=/assets/images/eventos/' + galleries.g + '/thumbs/' + el + '>Agregar al carrito</button> '+ 
			// 		'		</div> '+
			// 		'	</div> '+
			// 		'	<div class="img-wrapper"> '+
			// 		'		<img src=/assets/images/eventos/' + galleries.g + '/' + el + '.jpg alt="" title="" /> '+
			// 		'	</div> '+
			// 		'</div>');
			// })
		} else {
			
			let $results = '<h3>Su búsqueda "' + foto + '" no produjo resultados</h3><h4>Las siguientes fotos no tienen código asignado:</h4><div id="results"></div>';
			let events_placeholder = $('#results');

			// console.log('***events_placeholder ' + events_placeholder);

			$('#gallery-wrapper').addClass('results').html($results);

			// console.log('***sinCodigo ' + sinCodigo);

			let IdEvento = html.IdEvento;
			let title = html.title;
						// let price = sinCodigo.price;
						let json_sinCodigo = sinCodigo;

						let html_element = '';
						let pics_length = sinCodigo.length;
						let index = 0;

						let $page_start = 0;
						let $page_limit = 9;

						$page_limit = ($page_limit > pics_length)?pics_length:$page_limit;

						load_page(events_placeholder, $page_start, $page_limit, sinCodigo);						
						$page_start += $page_limit;
						let $pagina = 1;

						$(window).scroll(function(){
							if ($page_start + $page_limit <= pics_length && $page_limit != 0) {
								if (($(window).outerHeight(true) + $(window).scrollTop()) > ($(document).height() - 300)) {
									load_page(events_placeholder, $page_start, $page_limit, sinCodigo);
									
									$page_start += $page_limit;				
									
									$page_limit = ($page_start + $page_limit > pics_length)?(pics_length-$page_start):$page_limit;
								}
							}
						})

			// sinCodigo.forEach(function(el, index) {
			// 	$('#results').append(
			// 		'<div class="media"> '+
			// 		'	<a href="#' + galleries.g + '_' + el + '" class="open-popup-link" > '+
			// 		'		<img src="/assets/images/eventos/' + galleries.g + '/thumbs/' + el + '.jpg" alt="" title="" /> '+
			// 		'	</a> '+
			// 		'	<div class="cart_btns">'+
			// 		'		<button class="btn btn-danger my-cart-btn" data-id="' + el + '" data-name="foto_' + el + '" data-summary="foto_' + el + '" data-price="' + html.price + '" data-quantity="1" data-image="/assets/images/eventos/' + galleries.g + '/thumbs/' + el + '.jpg">Agregar al carrito</button> '+
			// 		'	</div> '+
			// 		'</div> '+
			// 		'<div id=' + galleries.g + '_' + el + ' class="white-popup mfp-hide"> '+
			// 		'	<div class="button-group"> '+
			// 		'		<iframe class="fb_iframe_widget" src="https://www.facebook.com/plugins/share_button.php?href=http://acciondigital.000webhostapp.com/assets/images/eventos/' + galleries.g + '/' + el + '.jpg&layout=button&size=large&mobile_iframe=true&width=100&height=28&appId" width="100" height="28" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true"></iframe> '+
			// 		'		<div class="cart_btns">'+
			// 		'			<button class="btn btn-danger my-cart-btn" data-id=' + el + ' data-name=foto_' + el + ' data-summary=foto_' + el + ' data-price="' + html.price + '" data-quantity="1" data-image=/assets/images/eventos/' + galleries.g + '/thumbs/' + el + '>Agregar al carrito</button> '+
			// 		'		</div> '+
			// 		'	</div> '+
			// 		'	<div class="img-wrapper"> '+
			// 		'		<img src=/assets/images/eventos/' + galleries.g + '/' + el + '.jpg alt="" title="" /> '+
			// 		'	</div> '+
			// 		'</div>');
			// })
		}
		carrito();
		$('.open-popup-link').magnificPopup({
			gallery:{
				enabled:true,
				preload:0
			}
		})
	});
}

/*GENERALES*/
$('form').placeholder();
$('.scrolly').scrolly();