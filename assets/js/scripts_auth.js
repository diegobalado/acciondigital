$(document).ready(function() {
	let $btns = '';
	let $param = location.pathname;
	let btnHome = '<button class="btnRedirect" data-href="/auth/create_home.php"> Crear página de inicio </button>';
	let btnGallery = '<button class="btnRedirect" data-href="/auth/create_gallery.php"> Crear galería general </button>';
	let btnEvent = '<button class="btnRedirect" data-href="/auth/create_event.php"> Crear evento </button>';
	switch($param) {
		case '/auth/create_home.php':
		$btns = btnGallery + btnEvent;
		break;
		case '/auth/create_gallery.php':
		$btns = btnHome + btnEvent;
		break;
		case '/auth/create_event.php':
		$btns = btnHome + btnGallery;
		break;	    
		default:
		return false;
	} 
	$('.btnGroup').html($btns);
	$('.btnRedirect').on('click', function(event) {
		window.location.href = $(this).data('href');
	})	
});
