// $('#header').load('/assets/includes/header.htm');
// $('#gallery-ad').load('/assets/includes/gallery-ad.htm');
// $('#contact').load('/assets/includes/section-contact.htm');
// $('#nav').load('/assets/includes/nav.htm');
$('#footer').load('/assets/includes/footer.htm');
$('#nav-header').load('/assets/includes/nav.htm', function() {
	if (!location.pathname.includes('/auth/')) {
		$('body').append('<script type="text/javascript" src="/assets/js/scripts.js"></script>');	
	}
});