/**
 * Módulo Auth Ads Links
 * Maneja alta/edición de links de publicidad en auth/create_ads.php.
 */
(function (window, $) {
	if (!$) {
		return;
	}

	function loadAds(ads) {
		ads.sort(function (a, b) {
			return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
		});

		let tableAds = '';
		for (let adIndex = 0; adIndex < ads.length; adIndex++) {
			const ad = ads[adIndex];
			const isNew = ad.isNew ? ' style="background-color: #ccc"' : '';
			tableAds += `<tr ${isNew}>\n`
				+ `<td><img src='/assets/images/ads/${ad.name}' style="height: 75px; width: auto" /></td>\n`
				+ `<td>${ad.name}</td>\n`
				+ `<td><a href="${ad.href}" target="_blank">${ad.href}</a></td>\n`
				+ '</tr>';
		}

		$('#loadedAds').html(tableAds);
		return ads;
	}

	function handleCancel() {
		window.location.href = '/auth/';
	}

	function handleSubmit(data) {
		const adData = data.map(function (ad) {
			return Object.assign({}, {}, { name: ad.name, href: ad.href });
		});

		$.ajax({
			data: 'adData=' + JSON.stringify(adData),
			url: 'save_ads.php',
			method: 'POST',
			success: function (msg) {
				if (msg == 200) {
					alert('La publicidad se cargó correctamente.');
					window.location.href = '/auth/';
				} else {
					alert('Hubo un error al cargar la publicidad.\nPor favor intentá de nuevo.');
					window.location.href = '/';
				}
			}
		});
	}

	function initAuthAdsLinks() {
		const state = {
			adData: []
		};

		$.get('/assets/datasources/ads.json', function (data) {
			state.adData = data.map(function (ad) {
				return Object.assign({}, {}, {
					_id: ad.name.replace('.', '_').toLowerCase(),
					name: ad.name,
					href: ad.href
				});
			});
			state.adData = loadAds(state.adData);
		}, 'json');

		$('#addButton').click(function () {
			const $ad = $('#ad');
			const $href = $('#href');
			const name = $ad.val();
			const href = $href.val();
			let adIndex = null;

			state.adData.forEach(function (ad, index) {
				adIndex = ad.name === name ? index : adIndex;
			});

			if (adIndex !== null) {
				const confirmOverwrite = window.confirm('La publicidad ya existe.\n¿Querés sobreescribirla?');
				if (confirmOverwrite) {
					state.adData[adIndex] = { name: name, href: href, isNew: true };
				}
			} else {
				state.adData.push({ name: name, href: href, isNew: true });
			}

			state.adData = loadAds(state.adData);
			$ad.val('');
			$href.val('');
		});

		$('.cancelBtn').click(function () {
			handleCancel();
		});
		$('.submitBtn').click(function () {
			handleSubmit(state.adData);
		});
	}

	window.App = window.App || {};
	window.App.initAuthAdsLinks = initAuthAdsLinks;

	$(document).ready(function () {
		initAuthAdsLinks();
	});
})(window, window.jQuery);
