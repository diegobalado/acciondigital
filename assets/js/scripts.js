const phs = {
	default: {
		value: 'JPF',
		label: 'Javier Piva Flos'
	},
	JPF: {
		value: 'JPF',
		label: 'Javier Piva Flos'
	},
	// MR: {
	// 	value: 'MR',
	// 	label:  'Maribel Rodríguez'
	// }
}

/*CARRITO*/
function carrito() {

	var goToCartIcon = function ($addTocartBtn) {
		var $cartIcon = $(".my-cart-icon");
		var $image = $('<img width="30px" height="30px" src="' + $addTocartBtn.data("image") + '"/>').css({
			position: "fixed",
			"z-index": "999"
		});
		$addTocartBtn.prepend($image);
		var position = $cartIcon.position();
		$image.animate({
			top: position.top,
			right: position.right
		}, 500, "linear", function () {
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
		clickOnAddToCart: function ($addTocart) {
			goToCartIcon($addTocart);
		},
		afterAddOnCart: function (products, totalPrice, totalQuantity) {
			// sessionStorage.setItem('products', JSON.stringify(products));
			// sessionStorage.setItem('price', totalPrice);
			// sessionStorage.setItem('quantity', totalQuantity);
		},
		clickOnCartIcon: function ($cartIcon, products, totalPrice, totalQuantity) {
			// console.log("cart icon clicked", $cartIcon, products, totalPrice, totalQuantity);
		},
		checkoutCart: function (products, totalPrice, totalQuantity) {
			var checkoutString = "Total Price: " + totalPrice + "\nTotal Quantity: " + totalQuantity;
			checkoutString += "\n\n id \t name \t summary \t price \t quantity \t image path \t ph";
			$.each(products, function () {
				checkoutString += ("\n " + this.id + " \t " + this.name + " \t " + this.summary + " \t " + this.price + " \t " + this.quantity + " \t " + this.image + " \t " + this.ph);
			});
			$.post('/checkout/index.php', {
				products: products,
				totalPrice: totalPrice
			})
				.success(function (html) {
					$('#main').html(html);
				})
				.error(function () {
					alert('ERROR');
				});

		},
		getDiscountPrice: function (products, totalPrice, totalQuantity) {
			const cantPromo = 5;
			let finalPrice = totalPrice;
			let unityPrice = totalPrice / totalQuantity;
			if (totalQuantity >= cantPromo) {
				finalPrice = 0
				return finalPrice;
			} else return null;
		}
	});
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

	$('#pictures-template').load('/assets/includes/' + $template + 'Template.htm', function () {
		$(document).ready(function () {
			let raw_template = $('#pictures-template').html();
			let template = Handlebars.compile(raw_template);
			let events_placeholder = $("#gallery-wrapper");
			let title_placeholder = $("#gallery_title");
			let subtitle_placeholder = $("[data-subtitle='gallery_subtitle']");
			let ads_placeHolder = $("#ads-block");
			let galleries = getGET();
			$json = $section == 'eventos' ? galleries.g : $section;

			if ($section == 'galeria' || $section == 'inicio') {
				Handlebars.registerHelper('full_href', function (picture) {
					return '/eventos/?g=' + picture.ID;
				});

				// Handlebars.registerHelper('full_thumb', function(picture) {
				//   return '/assets/images/eventos/' + picture.evento + '/thumbs/' + picture.thumb + '.jpg';
				// });
			}

			$.get("/assets/datasources/" + $json + ".json", function (data, status, xhr) {
				let json_data = location.hostname == 'localhost' ? JSON.parse(data) : data;
				let ph = json_data.ph ? json_data.ph : phs.default.value;
				let title = json_data.title;
				json_data.promo = json_data.promo ? json_data.promo : 0;
				let html_element = '';
				let pics_length = json_data.pictures.length;
				let $page_start = 0;
				let $page_limit = json_data.pictures.length < 9 ? json_data.pictures.length : 9;

				let = lastItem = 0;

				/*CARGA GENERAL DE LAS IMAGENES*/
				var load_page = function (placeholder, page_start, page_limit, data) {

					placeholder.append($('.loading').detach());
					$('.loading').fadeIn("fast");
					let pic = '';
					let title = data.title;
					let ph = data.ph ? data.ph : phs.default.value;
					var i = 0;
					for (i = page_start; i < page_start + page_limit; i++) {
						pic = data.pictures[i];
						html_element = `
							<div class="media">
								<div class="media-wrapper">
									<a href=#${data.IdEvento}_${pic} class="open-popup-link" >
										<img style="background:url(/assets/images/loading.gif) transparent no-repeat" src=/assets/images/eventos/${data.IdEvento}/thumbs/${pic}.jpg alt="" title="" />
									</a>
								</div>
								<div class="cart_btns">
									<button
										class="btn btn-danger my-cart-btn"
										data-id='${pic}'
										data-name='${title}'
										data-summary='foto_${pic}'
										data-price='${data.price}'
										data-promo='${data.promo}'
										data-quantity="1"
										data-event='${data.IdEvento}'
										data-ph='${ph}'
										data-image='/assets/images/eventos/${data.IdEvento}/thumbs/${pic}.jpg'
										data-type='Galeria'
									>Agregar al carrito</button>
								</div>
								<div id=${data.IdEvento}_${pic} class="white-popup mfp-hide">
									<div class="button-group">
										<a class="fb-xfbml-parse-ignore btn btn-facebook" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=http://acciondigitalfoto.com/assets/images/eventos/${data.IdEvento}/${pic}.jpg">
											<i class="fa fa-facebook-square"></i>
											Compartir
										</a>
										<div class="cart_btns">
											<button
												class="btn btn-danger my-cart-btn"
												data-id='${pic}'
												data-name='${title}'
												data-summary='foto_${pic}'
												data-price='${data.price}'
												data-promo='${data.promo}'
												data-quantity="1"
												data-event='${data.IdEvento}'
												data-ph='${ph}'
												data-image='/assets/images/eventos/${data.IdEvento}/thumbs/${pic}.jpg'
												data-type='Zoom'
											>Agregar al carrito</button>
										</div>
									</div>
									<div class="img-wrapper">
										<img src=/assets/images/eventos/${data.IdEvento}/${pic}.jpg alt="" title="" />
									</div>
								</div>
							</div>`;

						placeholder.append(html_element);
					}
					lastItem = data.IdEvento + '_' + pic;
					function loading() {
						setTimeout(function () {
							if ($('.media a[href="#' + data.IdEvento + '_' + data.pictures[page_start] + '"] img')[0].complete) {
								$('.loading').fadeOut("fast");
							} else {
								loading();
							}
						}, 500);
					}

					loading();
					carrito();
					$('.open-popup-link').magnificPopup({
						gallery: {
							enabled: true,
							preload: 1
						}
					})
				}
				$('.mfp-arrow-right').on('click', function (event) {
					event.preventDefault();
					let actual_pic = $(this).parent().find('.white-popup').attr('id');
					if (actual_pic == lastItem) {
						alert('es');
					}
				});

				load_page(events_placeholder, $page_start, $page_limit, json_data);
				$page_start += $page_limit;

				$(window).on('scroll', _.debounce(function () {
					if ($page_start + $page_limit <= pics_length && $page_limit != 0 && !$('#gallery-wrapper').hasClass('results')) {
						if (($(window).outerHeight(true) + $(window).scrollTop()) > ($('#gallery-wrapper').height() - 200)) {
							load_page(events_placeholder, $page_start, $page_limit, json_data);

							$page_start += $page_limit;

							$page_limit = ($page_start + $page_limit > pics_length) ? (pics_length - $page_start) : $page_limit;
						}
					}
				}, 200));

				$('.events-page').on('click', '.mfp-arrow-right', function (event) {
					event.preventDefault();
					let actual_pic = $(this).parent().find('.white-popup').attr('id');
					if (actual_pic == lastItem) {
						load_page(events_placeholder, $page_start, $page_limit, json_data);
						$('.open-popup-link').magnificPopup({
							gallery: {
								enabled: true,
								preload: 1
							}
						})
					}
				});

				let html_ads = '<div id="gallery-ad" id="gallery-ad"><div id="ads-block">{{#ads}} <a href={{this.href}} target="_blank" > <img src=/assets/images/ads/{{this.name}} alt="" /> </a> {{/ads}} </div></div';

				var load_ads = function (placeholder, data) {
					if (data.ads) {
						let ad = '';

						for (var i = 0; i < data.ads.length; i++) {
							ad = data.ads[i];
							if (!ad.href) ad.href = '#';
							ad.target = ad.href !== '#' ? 'target="_blank"' : '';

							if (ad) {
								html_ads = `<a href="${ad.href}" ${ad.target} > <img src="/assets/images/ads/${ad.name}" alt="" onclick="ga('send', 'event', 'Ad Link Event', 'Ad', 'Ad Event');" /> </a>`;
								placeholder.append(html_ads);
							}
						}
					}
				}

				load_ads(ads_placeHolder, json_data);

				title_placeholder.append(title);
				subtitle_placeholder.append(phs[ph].label);

				$('body').append('<script type="text/javascript" src="/assets/js/skel.min.js"></script>');
				$('body').append('<script type="text/javascript" src="/assets/js/jquery.scrolly.min.js"></script>');
				$('body').append('<script type="text/javascript" src="/assets/js/util.js"></script>');
				$('body').append('<script type="text/javascript" src="/assets/js/main.js"></script>');

				carrito();
				$('.open-popup-link').magnificPopup({
					gallery: {
						enabled: true,
						preload: 1
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
$(function () {
	$(window).scroll(function () {
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

/*PARAMETROS*/
function getGET() {
	let loc = document.location.href;
	if (loc.indexOf('?') > 0) {
		let getString = loc.split('?')[1];
		let GET = getString.split('&');
		let get = {};
		for (let i = 0, l = GET.length; i < l; i++) {
			let tmp = GET[i].split('=');
			//tomo el parametro sin lo que viene despues del #
			get[tmp[0]] = unescape(decodeURI(tmp[1])).indexOf('#') != -1 ? unescape(decodeURI(tmp[1])).substr(0, unescape(decodeURI(tmp[1])).indexOf('#')) : unescape(decodeURI(tmp[1]));
		}
		return get;
	}

}

/*PAGINA ACTIVA*/
$(function () {
	var $param = location.pathname;
	switch ($param) {
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
})

/*BUSCADOR*/
$(function () {
	let $param = location.pathname;
	if ($param != '/index.html' || $param != '/inicio/') {
		$('#nav-header ul li.toggle_search').removeClass('hidden');
	}
	$('.toggle_search').on('click', function (event) {
		event.preventDefault();
		$('#nav-header ul').toggleClass('shown').toggleClass('hidden');
		$('#nav-header .buscador').toggleClass('hidden').toggleClass('shown');
	});
})

function buscar(foto) {
	let galleries = getGET();
	$.get("/assets/datasources/" + galleries.g + ".json", function (data, status, xhr) {
		let html = location.hostname == 'localhost' ? JSON.parse(data) : data;
		let arrFiltro = [];
		let sinCodigo = [];
		let title = html.title;
		let price = html.price;
		let ph = html.ph ? html.ph : phs.default.value;
		let codigo = '';
		html.promo = html.promo ? html.promo : 0;
		let promo = html.promo ? html.promo : 0;
		html.pictures.forEach(function (el, index) {
			if (el.indexOf('-') == -1) sinCodigo.push(el)
			else {
				codigo = el.substr(el.indexOf('-') + 1, el.length);
				if (codigo.split('-').length > 1) {
					codigo.split('-').forEach(function (element, i) {
						if (element == foto) arrFiltro.push(el);
					})
				} else if (codigo == foto) arrFiltro.push(el);
			}
		});

		/*CARGA PARA LA BUSQUEDA*/
		var load_page = function (placeholder, page_start, page_limit, data) {
			let pic = '';

			for (var i = page_start; i < page_start + page_limit; i++) {
				pic = data[i];
				html_element = `
					<div class="media">
						<div class="media-wrapper">
							<a href=#${galleries.g}_${pic} class="open-popup-link">
								<img style="background:url(/assets/images/loading.gif) transparent no-scroll" src=/assets/images/eventos/${galleries.g}/thumbs/${pic}.jpg alt="" title="" />
							</a>
						</div>
						<div class="cart_btns">
							<button
								class="btn btn-danger my-cart-btn"
								data-id='${pic}'
								data-name='${title}'
								data-summary='foto_${pic}'
								data-ph='${ph}'
								data-price='${price}'
								data-promo='${promo}'
								data-quantity="1"
								data-event='${galleries.g}'
								data-image='/assets/images/eventos/${galleries.g}/thumbs/${pic}.jpg'
								data-type='Galeria - Filtro'
							>Agregar al carrito</button>
						</div>
						<div id=${galleries.g}_${pic} class="white-popup mfp-hide">
							<div class="button-group">
								<a class="fb-xfbml-parse-ignore btn btn-facebook" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=http://acciondigitalfoto.com/assets/images/eventos/${galleries.g}/${pic}.jpg">
									<i class="fa fa-facebook-square"></i>
									Compartir
								</a>
								<div class="cart_btns">
									<button
										class="btn btn-danger my-cart-btn"
										data-id='${pic}'
										data-name='${title}'
										data-summary='foto_${pic}'
										data-ph='${ph}'
										data-price='${price}'
										data-promo='${promo}'
										data-quantity="1"
										data-event='${galleries.g}'
										data-image='/assets/images/eventos/${galleries.g}/thumbs/${pic}.jpg'
										data-type='Zoom - Filtro'
									>Agregar al carrito</button>
								</div>
							</div>
							<div class="img-wrapper">
								<img src=/assets/images/eventos/${galleries.g}/${pic}.jpg alt="" title="" />
							</div>
						</div>
					</div>`;

				$('#results').append(html_element);
			}
			carrito();
			$('.open-popup-link').magnificPopup({
				gallery: {
					enabled: true,
					preload: 1
				}
			})
		}

		if (arrFiltro.length != 0) {
			let $results = '<h3>Resultado de la búsqueda "' + foto + '": ' + arrFiltro.length + (arrFiltro.length > 1 ? ' fotos' : ' foto') + '</h3><p>Además de éstas, puede haber fotos tuyas sin clasificar.</p><div id="results"></div>';

			let events_placeholder = $('#results');

			$('#gallery-wrapper').addClass('results').html($results);

			let IdEvento = html.IdEvento;
			let ph = html.ph ? html.ph : phs.default.value;
			let title = html.title;
			let json_arrFiltro = arrFiltro;

			let html_element = '';
			let pics_length = arrFiltro.length;
			let index = 0;

			let $page_start = 0;
			let $page_limit = 9;

			$page_limit = ($page_limit > pics_length) ? pics_length : $page_limit;

			load_page(events_placeholder, $page_start, $page_limit, arrFiltro);
			$page_start += $page_limit;
			$page_limit = ($page_start + $page_limit > pics_length) ? (pics_length - $page_start) : $page_limit;
			let $pagina = 1;

			$(window).scroll(function () {
				if ($page_start + $page_limit <= pics_length && $page_limit != 0) {
					if (($(window).outerHeight(true) + $(window).scrollTop()) > ($(document).height() - 300)) {
						load_page(events_placeholder, $page_start, $page_limit, arrFiltro);

						$page_start += $page_limit;

						$page_limit = ($page_start + $page_limit > pics_length) ? (pics_length - $page_start) : $page_limit;
					}
				}
			})
			gtag('event', 'Filtros', { 'event_category': 'Evento', 'event_label': 'Búsqueda con resultados' });
		} else {

			if (foto != 'untagged') {
				var $results = '<h3>Tu búsqueda "' + foto + '" no produjo resultados.</h3><h4>Las siguientes fotos no tienen código asignado:</h4><div id="results"></div>';
				gtag('event', 'Filtros', { 'event_category': 'Evento', 'event_label': 'Búsqueda sin resultados' });
			} else {
				var $results = '<h4>Las siguientes fotos no tienen código asignado:</h4><div id="results"></div>';
				gtag('event', 'Filtros', { 'event_category': 'Evento', 'event_label': 'Sin Clasificar' });
			}

			let events_placeholder = $('#results');
			$('#gallery-wrapper').addClass('results').html($results);

			let IdEvento = html.IdEvento;
			let title = html.title;
			let json_sinCodigo = sinCodigo;

			let html_element = '';
			let pics_length = sinCodigo.length;
			let index = 0;

			let $page_start = 0;
			let $page_limit = 9;

			$page_limit = ($page_limit > pics_length) ? pics_length : $page_limit;

			load_page(events_placeholder, $page_start, $page_limit, sinCodigo);
			$page_start += $page_limit;
			let $pagina = 1;

			$(window).scroll(function () {
				if ($page_start + $page_limit <= pics_length && $page_limit != 0) {
					if (($(window).outerHeight(true) + $(window).scrollTop()) > ($(document).height() - 300)) {
						load_page(events_placeholder, $page_start, $page_limit, sinCodigo);

						$page_start += $page_limit;

						$page_limit = ($page_start + $page_limit > pics_length) ? (pics_length - $page_start) : $page_limit;
					}
				}
			})
		}
		carrito();
		$('.open-popup-link').magnificPopup({
			gallery: {
				enabled: true,
				preload: 1
			}
		})
	});
}

$(function () {
	$('#untagged').on('click', function (event) {
		event.preventDefault();
		buscar('untagged');
	});
})

/* CARGA DE EVENTOS*/
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


/*GENERALES*/
$(document).ready(function () {
	$('form').length > 0 && $('form').placeholder();
	$('.scrolly').length > 0 && $('.scrolly').scrolly();

	$('body').append('<div id="btnTop"><span class="fa fa-angle-up "></span></div>');
	// if (getCurrentScroll() <= shrinkHeader) $('#btnTop').hide();

	$('#btnTop').click(function () {
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
	carrito();
});
