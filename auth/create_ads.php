<!DOCTYPE HTML>
<html>
<head>
	<title>Acción Digital</title>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="stylesheet" href="/assets/css/sections/sectionCheckout.css" />
	<link rel="stylesheet" href="/assets/css/pieces/forms.css" />

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
								//usort($ads, function ($a, $b) { return strcasecmp($a, $b); });

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
	<script type="text/javascript" src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
	<script type="text/javascript" src="/assets/js/modules/core.js"></script>
	<script type="text/javascript" src="/assets/js/modules/ui.js"></script>
	<script type="text/javascript" src="/assets/js/scripts_auth.js"></script>
	<script type="text/javascript" src="/assets/js/modules/auth-ads-links.js"></script>
</body>
</html>