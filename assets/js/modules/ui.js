/**
 * Módulo de UI
 * Maneja elementos de interfaz de usuario: header, navegación, utils
 */

/* Carga de footer */
$(document).ready(function () {
	$('#footer').load('/assets/includes/footer.htm');
});
const shrinkHeader = 100;

/*HEADER COLAPSABLE*/
$(function () {
	$(window).scroll(function () {
		const scroll = getCurrentScroll();
		if (scroll >= shrinkHeader) {
			$('#header').addClass('shrink');
			$('#btnTop').show('400');
		} else {
			$('#header').removeClass('shrink');
			$('#btnTop').hide('400');
		}
	});
});

/*PAGINA ACTIVA*/
$(function () {
	const pathname = location.pathname;
	switch (pathname) {
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
});

/*GENERALES*/
$(document).ready(function () {
	$('form').length > 0 && $('form').placeholder();
	$('.scrolly').length > 0 && $('.scrolly').scrolly();

	$('body').append('<div id="btnTop"><span class="fa fa-angle-up "></span></div>');

	$('#btnTop').click(function () {
		$('html,body').animate({
			scrollTop: 0
		}, 400);
		return false;
	});

	$('select#ph').append('<option value="all">Todos</option>');
	Object.keys(phs).forEach(function (phKey) {
		if (phKey !== 'default') {
			$('select#ph').append(`<option value="${phs[phKey].value}">${phs[phKey].label}</option>`);
		}
	});
});
