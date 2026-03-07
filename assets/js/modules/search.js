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

	const eventsPlaceholder = $('#results');
	let pageStart = 0;
	let pageLimit = Math.min(9, items.length);
	const picsLength = items.length;

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

function withEventData(queryParams, onSuccess) {
	const state = getAppState();
	const sameEventLoaded =
		typeof state.currentEventData === 'object' &&
		state.currentEventData !== null &&
		String(state.currentEventId) === String(queryParams.g);

	if (sameEventLoaded) {
		onSuccess(state.currentEventData);
		return;
	}

	$.get(getSearchDataUrl(queryParams.g), function (data) {
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

	const photoCode = String(foto).trim();
	if (!photoCode) {
		return;
	}

	const queryParams = getGET();
	if (!queryParams || !queryParams.g) {
		return;
	}

	withEventData(queryParams, function (data) {
		let eventData = data;
		if (typeof eventData === 'string') {
			try {
				eventData = JSON.parse(eventData);
			} catch (e) {
				return;
			}
		}

		if (!eventData || !Array.isArray(eventData.pictures)) {
			return;
		}

		const filteredPics = [];
		const untaggedPics = [];
		const title = eventData.title;
		const price = eventData.price;
		const ph = eventData.ph ? eventData.ph : phs.default.value;
		let bibCodeSuffix = '';
		eventData.promo = eventData.promo ? eventData.promo : 0;
		const promo = eventData.promo ? eventData.promo : 0;

		eventData.pictures.forEach(function (el) {
			const pic = String(el);
			if (pic.indexOf('-') === -1) {
				untaggedPics.push(pic);
			} else {
				bibCodeSuffix = pic.substr(pic.indexOf('-') + 1, pic.length);
				if (bibCodeSuffix.split('-').length > 1) {
					bibCodeSuffix.split('-').forEach(function (element) {
						if (String(element).trim() === photoCode) filteredPics.push(pic);
					})
				} else if (String(bibCodeSuffix).trim() === photoCode) {
					filteredPics.push(pic);
				}
			}
		});

		/*CARGA PARA LA BUSQUEDA*/
		const loadPage = function (placeholder, pageStart, pageLimit, dataSet) {
			let pic = '';
			let htmlElement = '';

			for (let i = pageStart; i < pageStart + pageLimit; i++) {
				pic = dataSet[i];
				htmlElement = window.App.renderers.buildPhotoMediaItem({
					eventId: queryParams.g,
					pic: pic,
					title: title,
					price: price,
					promo: promo,
					ph: ph,
					galleryType: 'Galeria - Filtro',
					zoomType: 'Zoom - Filtro'
				});

				placeholder.append(htmlElement);
			}
			carrito();
			$('.open-popup-link').magnificPopup({
				gallery: {
					enabled: true,
					preload: 1
				}
			});
		};

		if (filteredPics.length !== 0) {
			const resultsHtml = '<h3>Resultado de la búsqueda "' + photoCode + '": ' + filteredPics.length + (filteredPics.length > 1 ? ' fotos' : ' foto') + '</h3><p>Además de éstas, puede haber fotos tuyas sin clasificar.</p><div id="results"></div>';
			renderSearchResults(resultsHtml, filteredPics, loadPage);

			if (typeof gtag === 'function') {
				gtag('event', 'Filtros', { 'event_category': 'Evento', 'event_label': 'Búsqueda con resultados' });
			}
		} else {
			let resultsHtml = '';
			if (photoCode !== 'untagged') {
				resultsHtml = '<h3>Tu búsqueda "' + photoCode + '" no produjo resultados.</h3><h4>Las siguientes fotos no tienen código asignado:</h4><div id="results"></div>';
				if (typeof gtag === 'function') {
					gtag('event', 'Filtros', { 'event_category': 'Evento', 'event_label': 'Búsqueda sin resultados' });
				}
			} else {
				resultsHtml = '<h4>Las siguientes fotos no tienen código asignado:</h4><div id="results"></div>';
				if (typeof gtag === 'function') {
					gtag('event', 'Filtros', { 'event_category': 'Evento', 'event_label': 'Sin Clasificar' });
				}
			}

			renderSearchResults(resultsHtml, untaggedPics, loadPage);
		}
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
