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

		<section id="main" style="padding-bottom: 40px">
			<form action="./save_event.php" method="post">
				<div class="btnGroup"></div>
				<h2>Crear Evento</h2>
				<div data-role="fieldcontain">
					<fieldset>
						<label for="title">Título del evento:</label>
						<input type="text" name="title" id="title" value=""  />
					</fieldset>
					<!-- <br /><br /> -->
						<!-- <label for="IdEvento">Carpeta:</label>
						<input type="text" name="IdEvento" id="IdEvento" value=""  /><br /><br /><br /><br /> -->
					<fieldset>
						<label for="IdEvento">Carpeta:</label>
						<div class="select-custom">
							<select name="IdEvento" id="IdEvento" value="">

								<?php
								error_reporting (E_ALL ^ E_NOTICE);
								function debug_to_console($msg, $data) {
									$output = $data;
									if ( is_array( $output ) )
										$output = implode( ',', $output);

									echo "<script>console.log( 'Debug " . $msg . ": " . $output . "' );</script>";
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
							<span class="icon fa-chevron-down"></span>
						</div>
					</fieldset>
					<!-- <br /><br /> -->
					<!-- <script>console.log('*'+$('#IdEvento').val()+'*');</script> -->

					<!-- <br /><br /> -->

					<!-- <fieldset>
						<label for="pricePromo">Precio de la promoción:</label>
						<input type="text" name="pricePromo" id="pricePromo" value="" />
					</fieldset>

					<fieldset>
						<label for="promo">Cantidad de la promoción:</label>
						<input type="text" name="promo" id="promo" value="" />
					</fieldset> -->

					<fieldset>
						<label for="price">Precio de cada foto:</label>
						<input type="text" name="price" id="price" value="" />
					</fieldset>

					<fieldset>
						<label for="promo">Valor de la promoción:</label>
						<input type="text" name="promo" id="promo" value="" />
					</fieldset>

					<fieldset>
						<label for="ph">Fotógrafo:</label>
						<div class="select-custom">
							<select name="ph" id="ph" value="">
								<option value="JPF">Javier</option>
								<option value="MR">Maribel</option>
							</select>
							<span class="icon fa-chevron-down"></span>
						</div>
					</fieldset>

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
