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
			<form action="create_event.php" method="post">
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
								<span class="icon fa-chevron-down"></span>
							</div>
						</fieldset>
						<!-- <br /><br /> -->
						<!-- <script>console.log('*'+$('#IdEvento').val()+'*');</script> -->

						<!-- <br /><br /> -->
						<fieldset><label for="price">Precio de cada foto:</label>
							<input type="text" name="price" id="price" value="" /></fieldset>
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
					<!-- <label for="ads">Publicidades:</label>
					<input type="text" name="ads" id="ads" value=""  /><br /><br /> -->
					<fieldset><input type="submit" value="Guardar" /></fieldset>
				</div>      
			</form>

			<?php
			if (isset($_POST["IdEvento"])) {
				$folder = $_POST["IdEvento"];
				$directorio = opendir($_SERVER["DOCUMENT_ROOT"]."/assets/images/eventos/".$folder."/");
				$pics = array();
				$archivo = "";

				while ($archivo = readdir($directorio)) //obtenemos un archivo y luego otro sucesivamente
				{
					if (!is_dir($archivo))
					{			
						$parts = explode('.', $archivo);
						$name = $parts[0];
						$extension = end($parts);
						if ($extension == "jpg"  || $extension == "png") {
							array_push($pics, $name);
						}
					}
				}
				sort($pics);
				// echo json_encode($pics);
				$file = $_SERVER["DOCUMENT_ROOT"].'/assets/datasources/'.$folder.'.json';
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

				$saveFile = [];
				$saveFile = array(
					'IdEvento' => $_REQUEST[IdEvento],
					'title' => $_REQUEST[title],
					'pictures' => $pics,
					'ads' => $adsN,
					'price' => $_REQUEST[price]
					);
					?>
					<?php
					if (file_put_contents($file, json_encode($saveFile)) != false) $message = "El evento se creó correctamente";
					else $message = "Hubo un error al crear el evento";

					echo "<script type='text/javascript'>alert('$message');</script>";
				}

				?>
			</section>
		</div>

		<!-- Scripts -->
		<script type="text/javascript" src="/assets/js/load_pieces.js"></script>	

	</body>
	</html>