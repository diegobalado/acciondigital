$('#footer').load('/assets/includes/footer.htm');
$('#nav-header').load('/assets/includes/nav.htm', function() {
	if (!location.pathname.includes('/auth/') && !location.pathname.includes('/eventos/') && !location.pathname.includes('/individual/')) {
		$('body').append('<script type="text/javascript" src="/assets/js/scripts.min.1706250246.js"></script>');	
	} else if (location.pathname.includes('/eventos/')) {
		$('body').append('<script type="text/javascript" src="/assets/js/scripts_events.min.1706220037.js"></script>');			
	} else if (location.pathname.includes('/individual/')) {
		$('body').append('<script type="text/javascript" src="/assets/js/scripts_individual.js"></script>');			
	}
});