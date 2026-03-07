/**
 * Módulo de Búsqueda
 * Maneja la funcionalidad de búsqueda de fotos por número de corredor
 */

const SEARCH_SCROLL_NS = '.searchResults';

function clearSearchScrollHandler() {
	$(window).off('scroll' + SEARCH_SCROLL_NS);
}

function bindSearchScrollHandler(handler) {
	clearSearchScrollHandler();
	$(window).on('scroll' + SEARCH_SCROLL_NS, handler);
}

function renderSearchResults(wrapperHtml, items, loadPage) {
	$('#gallery-wrapper').addClass('results').html(wrapperHtml);

	var eventsPlaceholder = $('#results');
	var pageStart = 0;
	var pageLimit = Math.min(9, items.length);
	var picsLength = items.length;

	loadPage(eventsPlaceholder, pageStart, pageLimit, items);
	pageStart += pageLimit;

	bindSearchScrollHandler(function () {
		if (pageStart + pageLimit <= picsLength && pageLimit !== 0) {
			if (($(window).outerHeight(true) + $(window).scrollTop()) > ($(document).height() - 300)) {
				loadPage(eventsPlaceholder, pageStart, pageLimit, items);
				pageStart += pageLimit;
				pageLimit = (pageStart + pageLimit > picsLength) ? (picsLength - pageStart) : pageLimit;
			}
		}
	});
}

function getSearchDataUrl(galleryId) {
	const params = new URLSearchParams(location.search);
	const mirrorParam = params.get('mirror') === 'home5';
	if (mirrorParam) {
		return "/assets/datasources/mirror/home-5/" + galleryId + ".json";
	}
	return "/assets/datasources/" + galleryId + ".json";
}

function getAppState() {
	window.App = window.App || {};
	window.App.state = window.App.state || {};
	return window.App.state;
}

function withEventData(galleries, onSuccess) {
	const state = getAppState();
	const sameEventLoaded =
		typeof state.currentEventData === 'object' &&
		state.currentEventData !== null &&
		String(state.currentEventId) === String(galleries.g);

	if (sameEventLoaded) {
		onSuccess(state.currentEventData);
		return;
	}

	$.get(getSearchDataUrl(galleries.g), function (data) {
		let parsed = data;
		if (typeof parsed === 'string') {
			try {
				parsed = JSON.parse(parsed);
			} catch (e) {
				return;
			}
		}

		if (!parsed) {
			return;
		}

		state.currentEventData = parsed;
		state.currentEventId = String(parsed.IdEvento || '');
		onSuccess(parsed);
	});
}

function buscar(foto) {
	clearSearchScrollHandler();

	if (!foto) {
		return;
	}

	foto = String(foto).trim();
	if (!foto) {
		return;
	}

	let galleries = getGET();
	if (!galleries || !galleries.g) {
		return;
	}

	withEventData(galleries, function (data) {
		let html = data;
		if (typeof html === 'string') {
			try {
				html = JSON.parse(html);
			} catch (e) {
				return;
			}
		}

		if (!html || !Array.isArray(html.pictures)) {
			return;
		}

		let arrFiltro = [];
		let sinCodigo = [];
		let title = html.title;
		let price = html.price;
		let ph = html.ph ? html.ph : phs.default.value;
		let codigo = '';
		html.promo = html.promo ? html.promo : 0;
		let promo = html.promo ? html.promo : 0;
		html.pictures.forEach(function (el, index) {
			const pic = String(el);
			if (pic.indexOf('-') == -1) sinCodigo.push(pic)
			else {
				codigo = pic.substr(pic.indexOf('-') + 1, pic.length);
				if (codigo.split('-').length > 1) {
					codigo.split('-').forEach(function (element, i) {
						if (String(element).trim() == foto) arrFiltro.push(pic);
					})
				} else if (String(codigo).trim() == foto) arrFiltro.push(pic);
			}
		});

		/*CARGA PARA LA BUSQUEDA*/
		var load_page = function (placeholder, page_start, page_limit, data) {
			let pic = '';
			let html_element = '';

			for (var i = page_start; i < page_start + page_limit; i++) {
				pic = data[i];
				html_element = window.App.renderers.buildPhotoMediaItem({
					eventId: galleries.g,
					pic: pic,
					title: title,
					price: price,
					promo: promo,
					ph: ph,
					galleryType: 'Galeria - Filtro',
					zoomType: 'Zoom - Filtro'
				});

				placeholder.append(html_element);
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
			let resultsHtml = '<h3>Resultado de la búsqueda "' + foto + '": ' + arrFiltro.length + (arrFiltro.length > 1 ? ' fotos' : ' foto') + '</h3><p>Además de éstas, puede haber fotos tuyas sin clasificar.</p><div id="results"></div>';
			renderSearchResults(resultsHtml, arrFiltro, load_page);

			if (typeof gtag === 'function') {
				gtag('event', 'Filtros', { 'event_category': 'Evento', 'event_label': 'Búsqueda con resultados' });
			}
		} else {
			let resultsHtml = '';
			if (foto != 'untagged') {
				resultsHtml = '<h3>Tu búsqueda "' + foto + '" no produjo resultados.</h3><h4>Las siguientes fotos no tienen código asignado:</h4><div id="results"></div>';
				if (typeof gtag === 'function') {
					gtag('event', 'Filtros', { 'event_category': 'Evento', 'event_label': 'Búsqueda sin resultados' });
				}
			} else {
				resultsHtml = '<h4>Las siguientes fotos no tienen código asignado:</h4><div id="results"></div>';
				if (typeof gtag === 'function') {
					gtag('event', 'Filtros', { 'event_category': 'Evento', 'event_label': 'Sin Clasificar' });
				}
			}

			renderSearchResults(resultsHtml, sinCodigo, load_page);
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
	$(document).on('submit', 'form#buscador', function (event) {
		event.preventDefault();
		buscar($('#userID').val());
	});

	$(document).on('click', '#untagged', function (event) {
		event.preventDefault();
		buscar('untagged');
	});
})
