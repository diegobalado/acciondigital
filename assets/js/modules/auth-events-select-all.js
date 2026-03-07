/**
 * Módulo Auth Events Select All
 * Sincroniza el checkbox "Todos los eventos" con el select múltiple de eventos.
 */
(function (window, $) {
	if (!$) {
		return;
	}

	function initAuthEventsSelectAll() {
		const $checkEvents = $('#checkEvents');
		const $eventOptions = $('#IdEvento option');

		if ($checkEvents.length === 0 || $eventOptions.length === 0) {
			return;
		}

		$checkEvents.on('change', function () {
			if ($(this).is(':checked')) {
				$eventOptions.attr('selected', 'selected');
			} else {
				$eventOptions.attr('selected', false);
			}
		});
	}

	window.App = window.App || {};
	window.App.initAuthEventsSelectAll = initAuthEventsSelectAll;

	$(document).ready(function () {
		initAuthEventsSelectAll();
	});
})(window, window.jQuery);
