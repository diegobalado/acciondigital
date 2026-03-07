$(document).ready(function () {
	let buttonsHtml = '';
	const pathname = location.pathname;
	const btnHome = '<a class="button btnRedirect" href="/auth/create_home.php"> Crear página de inicio </a>';
	// let btnGallery = '<a class="button btnRedirect" href="/auth/create_gallery.php"> Crear galería general </a>';
	const btnEvent = '<a class="button btnRedirect" href="/auth/create_event.php"> Crear evento </a>';
	const btnAds = '<a class="button btnRedirect" href="/auth/create_ads.php"> Linkear Publicidad </a>';
	switch (pathname) {
		case '/auth/create_home.php':
			buttonsHtml = btnEvent + btnAds;
			break;
		/*case '/auth/create_gallery.php':
		buttonsHtml = btnHome + btnEvent + btnAds;
		break;*/
		case '/auth/create_event.php':
			buttonsHtml = btnHome + btnAds;
			break;
		case '/auth/create_ads.php':
			buttonsHtml = btnHome + btnEvent;
			break;
		default:
			buttonsHtml = btnHome + btnEvent + btnAds;
			break;
	}
	$('.btnGroup').html(buttonsHtml);
});
