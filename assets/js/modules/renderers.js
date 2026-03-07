/**
 * Módulo de Renderers
 * Helpers de construcción de HTML reutilizables entre módulos.
 */
(function (window) {
	window.App = window.App || {};
	window.App.renderers = window.App.renderers || {};

	window.App.renderers.buildPhotoMediaItem = function (opts) {
		var eventId = opts.eventId;
		var pic = opts.pic;
		var title = opts.title;
		var price = opts.price;
		var promo = opts.promo;
		var ph = opts.ph;
		var galleryType = opts.galleryType || 'Galeria';
		var zoomType = opts.zoomType || 'Zoom';

		return `
			<div class="media">
				<div class="media-wrapper">
					<a href=#${eventId}_${pic} class="open-popup-link" >
						<img style="background:url(/assets/images/loading.gif) transparent no-repeat" src=/assets/images/eventos/${eventId}/thumbs/${pic}.jpg alt="" title="" />
					</a>
				</div>
				<div class="cart_btns">
					<button
						class="btn btn-danger my-cart-btn"
						data-id='${pic}'
						data-name='${title}'
						data-summary='foto_${pic}'
						data-price='${price}'
						data-promo='${promo}'
						data-quantity="1"
						data-event='${eventId}'
						data-ph='${ph}'
						data-image='/assets/images/eventos/${eventId}/thumbs/${pic}.jpg'
						data-type='${galleryType}'
					>Agregar al carrito</button>
				</div>
				<div id=${eventId}_${pic} class="white-popup mfp-hide">
					<div class="button-group">
						<a class="fb-xfbml-parse-ignore btn btn-facebook" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=http://acciondigitalfoto.com/assets/images/eventos/${eventId}/${pic}.jpg">
							<i class="fa fa-facebook-square"></i>
							Compartir
						</a>
						<div class="cart_btns">
							<button
								class="btn btn-danger my-cart-btn"
								data-id='${pic}'
								data-name='${title}'
								data-summary='foto_${pic}'
								data-price='${price}'
								data-promo='${promo}'
								data-quantity="1"
								data-event='${eventId}'
								data-ph='${ph}'
								data-image='/assets/images/eventos/${eventId}/thumbs/${pic}.jpg'
								data-type='${zoomType}'
							>Agregar al carrito</button>
						</div>
					</div>
					<div class="img-wrapper">
						<img src=/assets/images/eventos/${eventId}/${pic}.jpg alt="" title="" />
					</div>
				</div>
			</div>`;
	};

	window.App.renderers.buildAdLinkHtml = function (ad) {
		var href = ad.href || '#';
		var target = href !== '#' ? 'target="_blank"' : '';
		return `<a href="${href}" ${target} > <img src="/assets/images/ads/${ad.name}" alt="" onclick="ga('send', 'event', 'Ad Link Event', 'Ad', 'Ad Event');" /> </a>`;
	};
})(window);
