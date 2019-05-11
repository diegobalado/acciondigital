<!DOCTYPE HTML>
<html>
<head>
	<title>Acción Digital</title>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="stylesheet" href="/assets/css/sections/sectionForms.css" />
	<link rel="stylesheet" href="/assets/css/pieces/multi-select.dev.css" />	
	
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
			<form action="save_home.php" method="post">
				<div class="btnGroup"></div>
				<h2>Crear Página de Inicio</h2>
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
						<!-- <div class="checkEvents">
							<input type="checkbox" value="None" id="checkEvents" name="check" />
							<label for="checkEvents"></label>
						</div>
						<span class="checkLabel">Todos los eventos</span> -->
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
	<script type="text/javascript" src="/assets/js/load_pieces.js"></script>
	<script type="text/javascript" src="/assets/js/jquery.multi-select.js"></script>
	<script type="text/javascript">
		var adsFinal = []
		$('#ads').multiSelect({
			keepOrder: true,
			afterSelect: function(values){
				adsFinal.push(values[0])
				$('#adsOrdered').val(JSON.stringify(adsFinal))
			},
			afterDeselect: function(values){
				adsFinal.splice(adsFinal.indexOf(values.toString()), 1)
				$('#adsOrdered').val(JSON.stringify(adsFinal))
			}
		});
	</script>

</body>
</html>