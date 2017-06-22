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
	<link rel="stylesheet" href="/assets/css/jquery-ui.css">
	
	<script type="text/javascript" src="https://code.jquery.com/jquery-2.2.3.min.js"></script>
	<script type="text/javascript" src="/assets/js/scripts_auth.js"></script>
	<script src="/assets/js/jquery-ui.js"></script>
	<script>
		$( function() {
			$( "#datepicker" ).datepicker();
		} );
	</script>
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
					<fieldset>
						<label for="datepicker">Fecha del evento:</label>
						<input type="text" id="datepicker" name="datepicker">
					</fieldset>
					<fieldset>
						<label for="place">Lugar del evento:</label>
						<input type="text" name="place" id="place" value=""  />
					</fieldset>
					<fieldset>
						<label for="picture">Imagen del evento:</label>
						<input type="text" name="picture" id="picture" value=""  />
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

					<fieldset><input type="submit" value="Guardar" /></fieldset>
				</div>      
			</form>

			<?php
			if (isset($_POST["title"])) {
				$file = $_SERVER["DOCUMENT_ROOT"].'/assets/datasources/agenda.json';
				$saveFile = [];
				$saveFile = array(
					'title' => $_REQUEST[title],
					'datepicker' => $_REQUEST[datepicker],
					'place' => $_REQUEST[place],
					'picture' => $_REQUEST[picture],
					'ads' => $_REQUEST[ads],
					);
					?>
					<?php
					if (file_put_contents($file, json_encode($saveFile), FILE_APPEND) != false) $message = "El evento se creó correctamente";
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