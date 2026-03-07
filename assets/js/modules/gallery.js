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

function getAppState() {
	window.App = window.App || {};
	window.App.state = window.App.state || {};
	return window.App.state;
}

const EVENT_SCROLL_NS = '.eventGallery';

function initPopupAndCart() {
	carrito();
	$('.open-popup-link').magnificPopup({
		gallery: {
			enabled: true,
			preload: 1
		}
	});
}

function appendEventPage(placeholder, pageStart, pageLimit, data) {
	placeholder.append($('.loading').detach());
	$('.loading').fadeIn('fast');

	let title = data.title;
	let ph = data.ph ? data.ph : phs.default.value;
	let lastPic = '';

	for (let i = pageStart; i < pageStart + pageLimit; i++) {
		const pic = data?.pictures?.[i];
		if (!pic) {
			continue;
		}
		lastPic = pic;
		placeholder.append(window.App.renderers.buildPhotoMediaItem({
			eventId: data.IdEvento,
			pic: pic,
			title: title,
			price: data.price,
			promo: data.promo,
			ph: ph,
			galleryType: 'Galeria',
			zoomType: 'Zoom'
		}));
	}

	const firstPic = data?.pictures?.[pageStart];
	if (!firstPic) {
		$('.loading').fadeOut('fast');
		initPopupAndCart();
		return '';
	}

	(function waitForFirstThumb() {
		setTimeout(function () {
			if ($('.media a[href="#' + data.IdEvento + '_' + firstPic + '"] img')[0]?.complete) {
				$('.loading').fadeOut('fast');
			} else {
				waitForFirstThumb();
			}
		}, 500);
	})();

	initPopupAndCart();
	return data.IdEvento + '_' + lastPic;
}

function renderEventAds(placeholder, data) {
	placeholder.empty();
	if (!data.ads) {
		return;
	}

	for (let i = 0; i < data.ads.length; i++) {
		let ad = data.ads[i];
		const htmlAd = window.App.renderers.buildAdLinkHtml(ad);
		placeholder.append(htmlAd);
	}
}

function bindEventInfiniteScroll(handler) {
	$(window).off('scroll' + EVENT_SCROLL_NS);
	$(window).on('scroll' + EVENT_SCROLL_NS, _.debounce(handler, 200));
}

/* CARGA DE EVENTOS - Función para home/inicio */
const loadEvents = (json, filter) => {
	const parsedJson = {
		ads: json.ads,
		eventos: filter !== 'all' ? json.eventos.filter(e => (e.ph === filter || (filter === phs.default.value && !e.ph))) : json.eventos
	};
	const placeHolder = $('#homeGallery');
	const rawTemplate = $('#pictures-template').html();
	const template = Handlebars.compile(rawTemplate);

	parsedJson.ads.forEach(ad => {
		if (!ad.href) ad.href = '#';
		ad.target = (ad.href !== '#') ? '_blank' : '_self';
	});
	const html = template(parsedJson);
	placeHolder.html(html);
};

/*HANDLEBARS - Carga de galería principal */
const loadGallery = (filter = 'all') => {
	const state = getAppState();
	const pathname = location.pathname;
	let section = '';
	let jsonName = '';
	let templateName = '';

	ensurePicturesTemplateTag();

	section = getCurrentSection(pathname);
	if (!pathname.includes('/amigos')) {
		templateName = section === 'eventos' ? 'eventos' : section;

		$('#pictures-template').load('/assets/includes/' + templateName + 'Template.htm', function () {
			const galleries = getGET();
			jsonName = section === 'eventos' ? galleries.g : section;
			registerGalleryHrefHelper(section);

			const dataUrl = buildDataUrl(section, jsonName);

			if (!state.galleryDataCache || state.galleryDataUrl !== dataUrl) {
				$.get(dataUrl, function (data) {
					const parsedData = normalizeJsonPayload(data);
					if (!parsedData) {
						return;
					}

					const searchEnabled = parsedData.search || parsedData.search === undefined;
					if (searchEnabled) {
						$('#buscador').removeClass('hidden');
					}
					state.galleryDataCache = parsedData;
					state.galleryDataUrl = dataUrl;
					if (section === 'eventos') {
						state.currentEventData = parsedData;
						state.currentEventId = String(parsedData.IdEvento || '');
					}
					loadEvents(state.galleryDataCache, filter);
				});
			} else {
				loadEvents(state.galleryDataCache, filter);
			}
		});
	}
};

/* EVENT PAGE - Carga específica para página de eventos */
$(document).ready(function () {
	const state = getAppState();
	let $pathname = location.pathname;
	let $section = '';
	let $json = '';
	let $template = '';

	ensurePicturesTemplateTag();

	$section = getCurrentSection($pathname);
	if (!$pathname.includes('/agenda')) {
		$template = $section == 'eventos' ? 'eventos' : $section;

		$('#pictures-template').load('/assets/includes/' + $template + 'Template.htm', function () {
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

				let eventData = parsedData;
				state.currentEventData = eventData;
				state.currentEventId = String(eventData.IdEvento || '');
				eventData.promo = eventData.promo ? eventData.promo : 0;

				const ph = eventData.ph ? eventData.ph : phs.default.value;
				const title = eventData.title;
				const picsLength = eventData?.pictures?.length || 0;
				let pageStart = 0;
				let pageLimit = picsLength < 9 ? picsLength : 9;

				title_placeholder.text(title);
				subtitle_placeholder.text(phs[ph].label);
				renderEventAds(ads_placeHolder, eventData);

				appendEventPage(events_placeholder, pageStart, pageLimit, eventData);
				pageStart += pageLimit;

				bindEventInfiniteScroll(function () {
					if (pageStart + pageLimit <= picsLength && pageLimit !== 0 && !$('#gallery-wrapper').hasClass('results')) {
						if (($(window).outerHeight(true) + $(window).scrollTop()) > ($('#gallery-wrapper').height() - 200)) {
							appendEventPage(events_placeholder, pageStart, pageLimit, eventData);
							pageStart += pageLimit;
							pageLimit = (pageStart + pageLimit > picsLength) ? (picsLength - pageStart) : pageLimit;
						}
					}
				});
			})
		})
	}
});

/*GENERALES - Carga de galería y filtro PH*/
$(document).ready(function () {
	loadGallery();
	$('select#ph').on('change', event => loadGallery(event.target.value));
});
