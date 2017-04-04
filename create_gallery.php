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
<!-- 	<link rel="stylesheet" href="assets/css/main.css" />	
	<link rel="stylesheet" href="carrito/css/bootstrap.min.css"> -->
	<style>
		.badge-notify{
			background:red;
			position: absolute;
			top: -10px;
			right: -10px;
		}
		/*.my-cart-icon-affix {
			position: fixed;
			z-index: 999;
		}*/
	</style>
	<script src="assets/js/jquery.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.6/handlebars.min.js" integrity="sha256-1O3BtOwnPyyRzOszK6P+gqaRoXHV6JXj8HkjZmPYhCI=" crossorigin="anonymous"></script>
	<!-- <script src="assets/js/plugins.js"></script> -->

</head>
<body>
	<div class="page-wrap">

		<section id="main">

			<section id="galleries">
				<form action="#" method="">
					<div data-role="fieldcontain">
						<label for="title">Título de evento:</label>
						<input type="text" name="title" id="title" value=""  /><br /><br />
						<label for="folder">Carpeta:</label>
						<input type="text" name="folder" id="folder" value=""  /><br /><br />
						<label for="ads">Publicidades:</label>
						<input type="text" name="ads" id="ads" value=""  /><br /><br />
						<input type="submit" value="Guardar" />
					</div>      
				</form>

				<?php

				if (isset($_GET["folder"])) {
					$folder = $_GET["folder"];
				$directorio = opendir("./galleries/".$folder."/thumbs/"); //ruta actual
				$pics = array();

				while ($archivo = readdir($directorio)) //obtenemos un archivo y luego otro sucesivamente
				{
					if (!is_dir($archivo))				    
					{
						array_push($pics, $archivo);
					}
				}
				echo json_encode([$_REQUEST, "pictures"=>$pics]);
				$file = dirname(__FILE__).'/galleries/'.$folder.'/data.json';
				file_put_contents($file, json_encode($_REQUEST));
			}

			?>

		</section>
	</section>
</div>

<!-- Scripts -->

<script src="assets/js/jquery.poptrox.min.js"></script>
<script src="assets/js/jquery.scrolly.min.js"></script>
<script src="assets/js/skel.min.js"></script>
<script src="assets/js/util.js"></script>
<script src="assets/js/main.js"></script>
<script src="assets/js/jquery-2.2.3.min.js"></script>
<script type='text/javascript' src="assets/js/carrito/bootstrap.min.js"></script>
<script type='text/javascript' src="assets/js/carrito/jquery.mycart.js"></script>
</body>
</html>