/**
 * Módulo Core
 * Estado y utilidades compartidas entre módulos.
 */
(function (window) {
	window.App = window.App || {};
	window.App.config = window.App.config || {};
	window.App.state = window.App.state || {};

	window.App.state.galleryDataCache = window.App.state.galleryDataCache || null;
	window.App.state.galleryDataUrl = window.App.state.galleryDataUrl || '';
	window.App.state.currentEventData = window.App.state.currentEventData || null;
	window.App.state.currentEventId = window.App.state.currentEventId || '';

	window.App.config.phs = {
		default: {
			value: 'JPF',
			label: 'Javier Piva Flos'
		},
		JPF: {
			value: 'JPF',
			label: 'Javier Piva Flos'
		},
		MC: {
			value: 'MC',
			label: 'Manuela Colavita'
		}
	};

	window.App.getCurrentScroll = function () {
		return window.pageYOffset || document.documentElement.scrollTop;
	};

	window.App.getGET = function () {
		var loc = document.location.href;
		if (loc.indexOf('?') > 0) {
			var getString = loc.split('?')[1];
			var GET = getString.split('&');
			var get = {};
			for (var i = 0, l = GET.length; i < l; i++) {
				var tmp = GET[i].split('=');
				var value = unescape(decodeURI(tmp[1] || ''));
				var hashIndex = value.indexOf('#');
				get[tmp[0]] = hashIndex !== -1 ? value.substr(0, hashIndex) : value;
			}
			return get;
		}
		return {};
	};

	// Backward-compatible global aliases expected by current modules.
	window.phs = window.App.config.phs;
	window.getGET = function () {
		return window.App.getGET();
	};
	window.getCurrentScroll = function () {
		return window.App.getCurrentScroll();
	};
})(window);
