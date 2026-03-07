/**
 * Módulo de Búsqueda
 * Maneja la funcionalidad de búsqueda de fotos por número de corredor
 */

function buscar(foto) {
	let galleries = getGET();
	$.get("/assets/datasources/" + galleries.g + ".json", function (data, status, xhr) {
		let html = data;
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
