<!DOCTYPE HTML>
<html>
<head>
	<title>Acción Digital</title>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="description" content="Acción Digital Foto. Fotografía de eventos deportivos.">
	<link rel="canonical" href="http://www.acciondigitalfoto.com" />

	<!-- <link rel="stylesheet" href="/assets/css/sections/sectionContact.css" /> -->
	<link rel="stylesheet" href="/assets/css/pieces/main.min.css" />
	<link rel="stylesheet" href="/assets/css/pieces/contact.css" />
	<link rel="stylesheet" href="/assets/css/pieces/bootstrap.min.css" />

	<!-- Facebook Pixel Code -->
	<script>
	!function(f,b,e,v,n,t,s)
	{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
	n.callMethod.apply(n,arguments):n.queue.push(arguments)};
	if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
	n.queue=[];t=b.createElement(e);t.async=!0;
	t.src=v;s=b.getElementsByTagName(e)[0];
	s.parentNode.insertBefore(t,s)}(window,document,'script',
	'https://connect.facebook.net/en_US/fbevents.js');
	fbq('init', '239873273094193'); 
	fbq('track', 'PageView');
	</script>
	<noscript>
	<img height="1" width="1" 
	src="https://www.facebook.com/tr?id=239873273094193&ev=PageView
	&noscript=1"/>
	</noscript>
	<!-- End Facebook Pixel Code -->
</head>

<body class="home">
	<div class="page-wrap">

		<header class="header" id="header">
			<a class="logo" href="/"><img src="/assets/images/logo.png" alt="Accion Digital" /></a>
			<nav id="nav-header" class="nav"></nav>
		</header>

		<section id="main">

			<section id="contact">
				<!-- Social -->
				<div class="social column">
					<h3>Nosotros</h3>
					<p>Fotografía de deportes</p>
					<p>Javier Piva Flos y Guillermo Silva</p>
					<h4>Teléfono</h4>
					<p>0249 450-3791</p>
					<h3>Seguinos</h3>
					<ul class="icons">
						<li><a href="https://www.facebook.com/AccionDigitalfoto/" class="icon fa-facebook"><span class="label">Facebook</span></a></li>
						<li><a href="https://www.flickr.com/photos/xav561/albums" class="icon fa-flickr"><span class="label">Flickr</span></a></li>
						<!-- <li><a href="#" class="icon fa-phone"><span class="label">0249 450-3791</span></a></li> -->
					</ul>
				</div>

				
				<!-- Form -->
				<div class="column">
					<h3>Contacto</h3>
					<form action="index.php" method="post">
						<div class="field half first">
							<label for="name">Nombre</label>
							<input name="name" id="name" type="text" placeholder="Nombre">
						</div>
						<div class="field half">
							<label for="email">Email</label>
							<input name="email" id="email" type="email" placeholder="Email">
						</div>
						<div class="field">
							<label for="message">Mensaje</label>
							<textarea name="message" id="message" rows="6" placeholder="Mensaje"></textarea>
						</div>
						<ul class="actions">
							<li><input value="Enviar" class="button" type="submit"></li>
						</ul>
					</form>
					<?php
					if (isset($_POST["email"])) {
						$to      = 'acciondigitalfoto@gmail.com, jdiegomdq@gmail.com';
						$subject = 'Nuevo mensaje de '.$_REQUEST[name].' desde www.acciondigitalfoto.com';
						$message = $_REQUEST[message];
						$headers = 'From: ' . $_REQUEST[email] . "\r\n" .
						'Reply-To: ' . $_REQUEST[email] . "\r\n" .
						'X-Mailer: PHP/' . phpversion();
						if (mail($to, $subject, $message, $headers)) echo "<script type='text/javascript'>alert('El mensaje fue enviado con éxito');</script>";
						else echo "<script type='text/javascript'>alert('Hubo un error al enviar el mensaje.');</script>";
					}
					?> 
				</div>
			</section>

			<!-- Footer -->
			<footer id="footer"></footer>
		</section>
	</div>

	<!-- Scripts -->
	<script type="text/javascript" src="/assets/js/jquery-2.2.3.min.js"></script>
	<script type="text/javascript" src="/assets/js/load_pieces.1706220037.js"></script>
	<script type="text/javascript" src="/assets/js/plugins.min.js"></script>	
<!-- 	<script type="text/javascript" src="/assets/js/handlebars.min.js"></script>
	<script type="text/javascript" src="/assets/js/jquery.scrolly.min.js"></script>
	<script type="text/javascript" src="/assets/js/util.js"></script>
	<script type="text/javascript" src="/assets/js/carrito/bootstrap.min.js"></script>
	<script type="text/javascript" src="/assets/js/carrito/jquery.mycart.js"></script> -->
	<!-- <script type="text/javascript" src="/assets/js/jquery.poptrox.min.js"></script> -->
	<!-- <script type="text/javascript" src="/assets/js/carrito/carrito.js"></script> -->
	<!-- <script type="text/javascript" src="/assets/js/skel.min.js"></script> -->
	<!-- <script type="text/javascript" src="/assets/js/main.js"></script> -->
</body>
</html>