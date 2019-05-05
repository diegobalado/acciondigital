<!DOCTYPE HTML>
<!--
	Snapshot by TEMPLATED
	templated.co @templatedco
	Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
-->
<html>
<head>
	<title>Acción Digital</title>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="stylesheet" href="/assets/css/sections/sectionForms.css" />	
	
	<script type="text/javascript" src="/assets/js/jquery-2.2.3.min.js"></script>
	<script type="text/javascript" src="/assets/js/scripts_auth.js"></script>

</head>
<body class="form-page">
	<div class="page-wrap">

		<header class="header" id="header">
			<a class="logo" href="/"><img src="/assets/images/logo.png" alt="Accion Digital" /></a>
			<nav id="nav-header" class="nav"></nav>
		</header>

		<section id="main">
			<form action="create_gallery.php" method="post">
				<div class="btnGroup"></div>
				<h2>Crear Galería General</h2>
				<div data-role="fieldcontain">
					<fieldset>
						<label for="IdEvento">Eventos:</label>
						<select multiple name="IdEvento[]" id="IdEvento" value="">  

							<?php 
							error_reporting (E_ALL ^ E_NOTICE);
							function debug_to_console($data) {
								$output = $data;
								if ( is_array( $output ) )
									$output = implode( ',', $output);

								echo "<script>console.log( 'Debug: " . $output . "' );</script>";
							}
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
						<div class="checkEvents">
							<input type="checkbox" value="None" id="checkEvents" name="check" />
							<label for="checkEvents"></label>
						</div>
						<span class="checkLabel">Todos los eventos</span>
					</fieldset>
					<!-- <br /><br /> -->
					<!-- <script>console.log('*'+$('#IdEvento').val()+'*');</script> -->

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
									// debug_to_console($adFile);
									array_push($ads, $adFile);
								}
							}
							sort($ads);
							$data = file_get_contents($_SERVER["DOCUMENT_ROOT"].'/assets/datasources/ads.json');
							$adData = json_decode($data, true) ;
							$adsArr = array();

							foreach ($ads as $ad) {
								$tempAds = array(
									'name' => $ad,
									'href' => $adData[$ad]
									);
								array_push($adsArr, $tempAds);
								?>
								<option value="<?php echo $ad; ?>" >
									<?php echo $ad; ?>
								</option>
								<?php
							}
							?>       
						</select>
					</fieldset>
					<!-- <br /><br /> -->
					
					<fieldset><input type="submit" value="Guardar" /></fieldset>
				</div>      
			</form>

			<?php
			if (isset($_POST["IdEvento"])) {
				$idEventos = $_REQUEST[IdEvento];

				$file = $_SERVER["DOCUMENT_ROOT"].'/assets/datasources/galeria.json';
				$saveFile = [];
				$eventos = [];
				foreach ($idEventos as $idEvento) {
					$data = file_get_contents($_SERVER["DOCUMENT_ROOT"].'/assets/datasources/'.$idEvento.'.json');
					$product = json_decode($data, true) ;
					$evento = array(
						'ID' => $idEvento,
						'text' => $product[title]
						);
					array_push($eventos, $evento);
				}
				rsort($eventos);
				$ads = $_REQUEST[ads];
				$data = file_get_contents($_SERVER["DOCUMENT_ROOT"].'/assets/datasources/ads.json');
				$adData = json_decode($data, true) ;
				$adsN = array();

				foreach ($ads as $ad) {
					$tempAds = array(
						'name' => $ad,
						'href' => $adData[$ad]
						);
					array_push($adsN, $tempAds);
				}
				$saveFile = array(
					'eventos' => $eventos,
					'ads' => $adsN
					);
				if (file_put_contents($file, json_encode($saveFile)) != false) $message = "La galer\u00eda se cre\u00f3 correctamente";
				else $message = "Hubo un error al crear la galer\u00eda";

				echo "<script type='text/javascript'>alert('$message');</script>";
			}
			?>
		</section>
	</div>

	<!-- Scripts -->
	<script type="text/javascript" src="/assets/js/load_pieces.js"></script>	
	<script>
		$(document).ready(function() {
			$('#checkEvents').on('change', function(event) {
				if ($(this).is(':checked')) $("#IdEvento option").attr("selected","selected")
					else $("#IdEvento option").attr("selected",false)
				});
		});
	</script>

</body>
</html>