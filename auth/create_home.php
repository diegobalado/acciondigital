<!DOCTYPE HTML>
<html>
<head>
	<title>Acción Digital</title>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="stylesheet" href="/assets/css/sections/sectionForms.css" />
	<link rel="stylesheet" href="/assets/css/pieces/multi-select.dev.css" />	

</head>
<body class="form-page">
	<div class="page-wrap">

		<header class="header" id="header">
			<a class="logo" href="/"><img src="/assets/images/logo.png" alt="Accion Digital" /></a>
			<nav id="nav-header" class="nav"></nav>
		</header>

		<section id="main">
			<form action="save_home.php" method="post">
				<div class="btnGroup"></div>
				<h2>Crear Página de Inicio</h2>
				<div data-role="fieldcontain">
					<fieldset>
						<label for="IdEvento">Eventos:</label>
						<select multiple name="IdEvento[]" id="IdEvento" value="">  

							<?php
							error_reporting (E_ALL ^ E_NOTICE);
							?>

							<?php
							$directorio = opendir($_SERVER["DOCUMENT_ROOT"]."/assets/images/eventos/");
							$carpetas = array();
							while ($carpeta = readdir($directorio))
							{
								if (!is_dir($carpeta))
								{
									array_push($carpetas, $carpeta);
								}
							}
							sort($carpetas);

							foreach ($carpetas as $carpeta) {
								?>
								<option value="<?php echo $carpeta; ?>" >
									<?php echo $carpeta; ?>
								</option>
								<?php
							}
							?>       
						</select>
						<!-- <div class="checkEvents">
							<input type="checkbox" value="None" id="checkEvents" name="check" />
							<label for="checkEvents"></label>
						</div>
						<span class="checkLabel">Todos los eventos</span> -->
					</fieldset>
					<!-- <br /><br /> -->

					<fieldset>
						<label for="ads">Publicidades:</label>
						<select multiple name="ads[]" id="ads" value="">  
							<?php
							$adsFolder = opendir($_SERVER["DOCUMENT_ROOT"]."/assets/images/ads/");
							$ads = array();
							while ($adFile = readdir($adsFolder))
							{
								if (!is_dir($adFile))
								{
									array_push($ads, $adFile);
								}
							}
							sort($ads);
							$data = file_get_contents($_SERVER["DOCUMENT_ROOT"].'/assets/datasources/ads.json');
							$adData = json_decode($data, true) ;
							$adsArr = array();

							foreach ($ads as $ad) {
								?>
								<option value="<?php echo $ad; ?>" >
									<?php echo $ad; ?>
								</option>
								<?php
							}
							?>       
						</select>
						<input type="hidden" name="adsOrdered" id="adsOrdered">
					</fieldset>
					<!-- <br /><br /> -->
					
					<fieldset><input type="submit" value="Guardar" /></fieldset>
				</div>      
			</form>
		</section>
	</div>

	<!-- Scripts -->
	<script type="text/javascript" src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
	<script type="text/javascript" src="/assets/js/modules/core.js"></script>
	<script type="text/javascript" src="/assets/js/modules/ui.js"></script>
	<script type="text/javascript" src="/assets/js/scripts_auth.js"></script>
	<script type="text/javascript" src="/assets/js/jquery.multi-select.js"></script>
	<script type="text/javascript" src="/assets/js/modules/auth-ads-multiselect.js"></script>

</body>
</html>