/**
 * Módulo Auth Ads MultiSelect
 * Centraliza la inicialización del selector múltiple de ads en formularios auth.
 */
(function (window, $) {
	if (!$) {
		return;
	}

	function initAuthAdsMultiSelect(adsSelector, outputSelector) {
		const $ads = $(adsSelector);
		const $output = $(outputSelector);

		if ($ads.length === 0 || $output.length === 0 || typeof $ads.multiSelect !== 'function') {
			return;
		}

		const selectedAds = [];
		$ads.multiSelect({
			keepOrder: true,
			afterSelect: function (values) {
				selectedAds.push(values[0]);
				$output.val(JSON.stringify(selectedAds));
			},
			afterDeselect: function (values) {
				selectedAds.splice(selectedAds.indexOf(values.toString()), 1);
				$output.val(JSON.stringify(selectedAds));
			}
		});
	}

	window.App = window.App || {};
	window.App.initAuthAdsMultiSelect = initAuthAdsMultiSelect;

	$(document).ready(function () {
		initAuthAdsMultiSelect('#ads', '#adsOrdered');
	});
})(window, window.jQuery);
