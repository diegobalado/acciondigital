/**
 * Módulo de Galería
 * Maneja la carga de galerías, templates Handlebars, scroll infinito y lightbox
 */

function getCurrentSection(pathname) {
	if (pathname.includes('/eventos/')) return 'eventos';
	if (pathname.includes('/inicio/')) return 'inicio';
	if (pathname.includes('/galeria/')) return 'galeria';
	return '';
}

function ensurePicturesTemplateTag() {
	if ($('#pictures-template').length === 0) {
		$('body').append('<script id="pictures-template" type="text/x-handlebars-template"></scr' + 'ipt>');
	}
}

function normalizeJsonPayload(data) {
	if (typeof data === 'string') {
		try {
			return JSON.parse(data);
		} catch (e) {
			return null;
		}
	}
	return data;
}

function buildDataUrl(section, jsonName) {
	const params = new URLSearchParams(location.search);
	const isLocalHost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
	const mirrorParam = params.get('mirror') === 'home5';
	const useMirrorHome5Home = section === 'inicio' && (mirrorParam || isLocalHost);
	const useMirrorHome5Event = section === 'eventos' && mirrorParam;

	if (useMirrorHome5Home) {
		return '/assets/datasources/mirror/home-5/inicio.5.json';
	}

	if (useMirrorHome5Event) {
		return '/assets/datasources/mirror/home-5/' + jsonName + '.json';
	}

	return '/assets/datasources/' + jsonName + '.json';
}

function registerGalleryHrefHelper(section) {
	if (section !== 'galeria' && section !== 'inicio') {
		return;
	}

	Handlebars.registerHelper('full_href', function (picture) {
		const params = new URLSearchParams(location.search);
		const isLocalHost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
		const shouldMirrorHome5 = section === 'inicio' && (params.get('mirror') === 'home5' || isLocalHost);
		return '/eventos/?g=' + picture.ID + (shouldMirrorHome5 ? '&mirror=home5' : '');
	});
}

/* CARGA DE EVENTOS - Función para home/inicio */
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
var last_data_url = '';

/*HANDLEBARS - Carga de galería principal */
const loadGallery = (filter = 'all') => {
	var $pathname = location.pathname;
	var $section = '';
	var $json = '';
	var $template = '';

	ensurePicturesTemplateTag();

	$section = getCurrentSection($pathname);
	if (!$pathname.includes('/amigos')) {
		$template = $section == 'eventos' ? 'eventos' : $section;

		$('#pictures-template').load('/assets/includes/' + $template + 'Template.htm', function () {
			var galleries = getGET();
			$json = $section === 'eventos' ? galleries.g : $section;
			registerGalleryHrefHelper($section);

			const dataUrl = buildDataUrl($section, $json);

			if (json_data === '' || last_data_url !== dataUrl) {
				$.get(dataUrl, function (data) {
					const parsedData = normalizeJsonPayload(data);
					if (!parsedData) {
						return;
					}

					let search = parsedData.search || parsedData.search === undefined;
					if (search) {
						$('#buscador').removeClass('hidden');
					}
					json_data = parsedData;
					last_data_url = dataUrl;
					loadEvents(json_data, filter);
				})
			} else {
				loadEvents(json_data, filter);
			}
		})
	}
}

/* EVENT PAGE - Carga específica para página de eventos */
$(document).ready(function () {
	let $pathname = location.pathname;
	let $section = '';
	let $json = '';
	let $template = '';

	ensurePicturesTemplateTag();

	$section = getCurrentSection($pathname);
	if (!$pathname.includes('/agenda')) {
		$template = $section == 'eventos' ? 'eventos' : $section;

		$('#pictures-template').load('/assets/includes/' + $template + 'Template.htm', function () {
			let raw_template = $('#pictures-template').html();
			let template = Handlebars.compile(raw_template);
			let events_placeholder = $("#gallery-wrapper");
			let title_placeholder = $("#gallery_title");
			let subtitle_placeholder = $("[data-subtitle='gallery_subtitle']");
			let ads_placeHolder = $("#ads-block");
			let galleries = getGET();
			$json = $section == 'eventos' ? galleries.g : $section;
			registerGalleryHrefHelper($section);

			const dataUrl = buildDataUrl($section, $json);

			$.get(dataUrl, function (data) {
				let parsedData = normalizeJsonPayload(data);
				if (!parsedData) {
					return;
				}

				let json_data = parsedData;
					let ph = json_data.ph ? json_data.ph : phs.default.value;
					let title = json_data.title;
					json_data.promo = json_data.promo ? json_data.promo : 0;
					let html_element = '';
					let pics_length = json_data?.pictures?.length;
					let $page_start = 0;
					let $page_limit = json_data?.pictures?.length < 9 ? json_data?.pictures?.length : 9;

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
							pic = data?.pictures?.[i];
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
								if ($('.media a[href="#' + data.IdEvento + '_' + data.pictures?.[page_start] + '"] img')[0]?.complete) {
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

					carrito();
					$('.open-popup-link').magnificPopup({
						gallery: {
							enabled: true,
							preload: 1
						}
					})
				})
		})
	}
});

/*GENERALES - Carga de galería y filtro PH*/
$(document).ready(function () {
	loadGallery();
	$('select#ph').on('change', event => loadGallery(event.target.value));
});
