$(document).ready(function() {
	let $btns = '';
	let $param = location.pathname;
	let btnHome = '<a class="button btnRedirect" href="/auth/create_home.php"> Crear página de inicio </a>';
	// let btnGallery = '<a class="button btnRedirect" href="/auth/create_gallery.php"> Crear galería general </a>';
	let btnEvent = '<a class="button btnRedirect" href="/auth/create_event.php"> Crear evento </a>';
	let btnAds = '<a class="button btnRedirect" href="/auth/create_ads.php"> Linkear Publicidad </a>';
	switch($param) {
		case '/auth/create_home.php':
		$btns = btnEvent + btnAds;
		break;
		/*case '/auth/create_gallery.php':
		$btns = btnHome + btnEvent + btnAds;
		break;*/
		case '/auth/create_event.php':
		$btns = btnHome + btnAds;
		break;	    
		case '/auth/create_ads.php':
		$btns = btnHome + btnEvent;
		break;	    
		default:
		$btns = btnHome + btnEvent + btnAds;
		break;
	} 
	$('.btnGroup').html($btns);
});
