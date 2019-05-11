<!DOCTYPE HTML>
<html>
<head>
	<title>Acción Digital</title>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="stylesheet" href="/assets/css/sections/sectionCheckout.css" />
	<link rel="stylesheet" href="/assets/css/pieces/forms.css" />
	
	<script type="text/javascript" src="/assets/js/jquery-2.2.3.min.js"></script>
	<script type="text/javascript" src="/assets/js/scripts_auth.js"></script>
	
	<style type="text/css">
		.form-page fieldset:nth-child(2n) {
			padding-right: 50px;
		}
		.table-container {
			display: block;
			clear: both;
			margin: auto;
			padding: 40px 0;
			overflow-x: auto;
		}
		.table-container h3 {
			margin-bottom: 20px;
		}
		.table-container table {
			border-radius: 4px;
			border: solid 2px #FAC200;
			background-color: white;
		}
		.table-container table thead {
			font-weight: bold;
			border-bottom: solid 3px #ddd;
		}
		.table-container table td {
			border-right: solid 1px #ddd;			
		}
		.table-container table td:first-child {
			text-align: center;
		}
		.table-container table td:nth-child(2){
			width: 25%;
		}
		.form-page #main {
			font-size: 14px;
		}
		.form-page .select-custom {
			height: 38px;
		}
		select:-moz-focusring {
			color: transparent;
			text-shadow: 0 0 0 #000;
		}
		.form-page form .xl-4 fieldset {
			width: calc(50% - 50px);
		}
		.form-page form .xl-4 fieldset:last-child {
			width: 100px;
			clear: none;
		}
		.form-page form .xl-4 fieldset:last-child input {
			margin-top: 25px;
		}
		.submitBtnGroup {
			overflow: auto;
		}
		.submitBtnGroup fieldset {
			margin-top: 0;
		}
		.submitBtnGroup fieldset input:last-child {
			margin-left: 20px;
		}
	</style>

</head>
<body class="form-page">
	<div class="page-wrap">

		<header class="header" id="header">
			<a class="logo" href="/"><img src="/assets/images/logo.png" alt="Accion Digital" /></a>
			<nav id="nav-header" class="nav"></nav>
		</header>

		<section id="main">
			<form action="#" method="post">
				<div class="btnGroup"></div>
				<h2>Linkear publicidades</h2>
				<div data-role="fieldcontain" class="xl-4">
					<fieldset>
						<label for="ad">Publicidad para ingresar:</label>
						<div class="select-custom">
							<select name="ad" id="ad" value="">
								<option value="" ></option>
								<?php
								$adsFolder = opendir($_SERVER["DOCUMENT_ROOT"]."/assets/images/ads/");
								$ads = array();
								while ($adFile = readdir($adsFolder))
								{
									if (!is_dir($adFile))
										array_push($ads, $adFile);
								}
								usort($ads, function ($a, $b) { return strcasecmp($a["name"], $b["name"]); }); 

								foreach ($ads as $ad) {
									?>
									<option value="<?php echo $ad; ?>" >
										<?php echo $ad; ?>
									</option>
									<?php
								}
								?>       
							</select>
							<span class="icon fa-chevron-down"></span>
						</div>
					</fieldset>

					<fieldset>
						<label for="href">Dirección Web:</label>
						<input type="text" id="href" name="href" />
					</fieldset>

					<fieldset><input type="button" value="Agregar" id="addButton" /></fieldset>
				</div>      

				<div class="table-container">
					<h3>Publicidades cargadas:</h3>
					<table>
						<thead>
							<tr>
								<td>Imagen</td>
								<td>Publicidad</td>
								<td>Enlace</td>
							</tr>
						</thead>
						<tbody id="loadedAds"></tbody>
					</table>
				</div>
	
				<div class="submitBtnGroup"> 
					<fieldset>
						<input type="button" value="Guardar" class="submitBtn"/>
						<input type="button" value="Cancelar" class="cancelBtn">
					</fieldset>
				</div>
			</form>

		</section>
	</div>

	<!-- Scripts -->
	<script type="text/javascript" src="/assets/js/load_pieces.js"></script>
	
	<script type="text/javascript">
		loadAds = ads => {
			ads.sort((a,b) => a.name.toLowerCase() > b.name.toLowerCase())
			var tableAds = ''
			for (var ad in ads) {
				let isNew = ads[ad].isNew?' style="background-color: #ccc"':''
				let dataId = `data-id="${ads[ad].name.replace('.', '_').toLowerCase()}"`
				tableAds += `<tr ${isNew}>
				<td><img src='/assets/images/ads/${ads[ad].name}' style="height: 75px; width: auto" /></td>
				<td>${ads[ad].name}</td>
				<td><a href="${ads[ad].href}" target="_blank">${ads[ad].href}</a></td>
				</tr>`
			}
			$('#loadedAds').html(tableAds)
			return ads
		}

		handleCancel = () => {
			window.location.href = '/auth/';
		}

		handleSubmit = data => {
			let adData = data.map(ad=>Object.assign({}, {}, {'name': ad.name, 'href': ad.href}))

			$.ajax({
			    data: 'adData=' + JSON.stringify(adData),
			    url: 'save_ads.php',
			    method: 'POST', 
			    success: function(msg) {
			        if (msg == 200) {
			        	alert("La publicidad se cargó correctamente.");
			        	window.location.href = '/auth/';
			        } else {
			        	alert("Hubo un error al cargar la publicidad.\nPor favor intentá de nuevo.")
			        	window.location.href = '/';
			        }
			    }
			})
		}

		$(document).ready(function() {
			var state = {
				adData: []			
			}
			$.get( "/assets/datasources/ads.json", function( data ) {
				state.adData = data.map(ad=>Object.assign({}, {}, {'_id': ad.name.replace('.', '_').toLowerCase(), 'name': ad.name, 'href': ad.href}))
				state.adData = loadAds(state.adData)
			}, "json");

			$('#addButton').click(function() {
				let $ad = $('#ad')
				let $href = $('#href')
				let name = $ad.val()
				let href = $href.val()
				let adIndex = null
				
				state.adData.forEach((ad, i)=>{adIndex=(ad.name===name)?i:adIndex})
				if (adIndex!==null) {
					var msg = window.confirm("La publicidad ya existe.\n¿Querés sobreescribirla?");
					if (msg)
						state.adData[adIndex] = {name, href, isNew: true}
				}
				else 
					state.adData.push({name, href, isNew: true})
				
				state.adData = loadAds(state.adData)				
				$ad.val('')
				$href.val('')
			})

			$('.cancelBtn').click(()=>handleCancel())
			$('.submitBtn').click(()=>handleSubmit(state.adData))
		})
	</script>
</body>
</html>