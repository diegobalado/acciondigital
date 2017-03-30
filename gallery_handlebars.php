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
	<link rel="stylesheet" href="assets/css/main.css" />	
	<link rel="stylesheet" href="carrito/css/bootstrap.min.css">
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

		<!-- Nav -->
		<nav id="nav">
			<ul>
				<li><a href="index.html"><span class="icon fa-home"></span></a></li>
				<li><a href="gallery.html" class="active"><span class="icon fa-camera-retro"></span></a></li>
				<li><a href="generic.html"><span class="icon fa-file-text-o"></span></a></li>
				<li><a href="#"><span class="glyphicon glyphicon-shopping-cart my-cart-icon"><span class="badge badge-notify my-cart-badge"></span></span></a></li>
			</ul>
		</nav>

		<!-- Main -->
		<section id="main">

			<!-- Header -->
			<header id="header">
				<!-- <div>Snapshot <span>by TEMPLATED</span></div> -->
			</header>

			<!-- Gallery -->
			<section id="galleries">
				<?php
				$directorio = opendir("./images/170301/thumbs/"); //ruta actual
				
				$pics = array();


				while ($archivo = readdir($directorio)) //obtenemos un archivo y luego otro sucesivamente
				{
				    if (!is_dir($archivo))				    
				    {
								array_push($pics, "thumb ", $archivo);
				        // echo $archivo . "<br />";
				    }
				}
				print_r($pics);
				$file = 'pictures_php2.json';
				file_put_contents($file, json_encode($pics));
				?>
				
				<form action="#" method="">
					<div data-role="fieldcontain">
						<label for="eventCode">Código de evento:</label>
						<input type="date" name="eventCode" id="date" value=""  /><br /><br />
						<label for="textarea">Event:</label>
						<textarea cols="10" rows="1" name="textarea" id="textarea"></textarea>
						<input type="submit" value="Guardar" />
					</div>      
				</form>

				<?php 
				  $file = dirname(__FILE__).'/form-data-'.time().'-'.rand(1000,9999);
				  file_put_contents($file, json_encode($_REQUEST));
				?>

				<!-- Photo Galleries -->
				<div class="gallery">

					<!-- Filters -->
					<header>
						<h1>Gallery</h1>
						<ul class="tabs">
							<li><a href="#" data-tag="all" class="button active">All</a></li>
							<li><a href="#" data-tag="people" class="button">People</a></li>
							<li><a href="#" data-tag="place" class="button">Places</a></li>
							<li><a href="#" data-tag="thing" class="button">Things</a></li>
						</ul>
					</header>

					<div id="gallery-wrapper" class="gallery-wrapper"></div>
				</div>
			</section>

			<!-- Contact -->
			<section id="contact">
				<!-- Social -->
				<div class="social column">
					<h3>Nosotros</h3>
					<p>Mus sed interdum nunc dictum rutrum scelerisque erat a parturient condimentum potenti dapibus vestibulum condimentum per tristique porta. Torquent a ut consectetur a vel ullamcorper a commodo a mattis ipsum class quam sed eros vestibulum quisque a eu nulla scelerisque a elementum vestibulum.</p>
					<p>Aliquet dolor ultricies sem rhoncus dolor ullamcorper pharetra dis condimentum ullamcorper rutrum vehicula id nisi vel aptent orci litora hendrerit penatibus erat ad sit. In a semper velit eleifend a viverra adipiscing a phasellus urna praesent parturient integer ultrices montes parturient suscipit posuere quis aenean. Parturient euismod ultricies commodo arcu elementum suspendisse id dictumst at ut vestibulum conubia quisque a himenaeos dictum proin dis purus integer mollis parturient eros scelerisque dis libero parturient magnis.</p>
					<h3>Seguinos</h3>
					<ul class="icons">
						<li><a href="#" class="icon fa-twitter"><span class="label">Twitter</span></a></li>
						<li><a href="#" class="icon fa-facebook"><span class="label">Facebook</span></a></li>
						<li><a href="#" class="icon fa-instagram"><span class="label">Instagram</span></a></li>
					</ul>
				</div>

				<!-- Form -->
				<div class="column">
					<h3>Get in Touch</h3>
					<form action="#" method="post">
						<div class="field half first">
							<label for="name">Name</label>
							<input name="name" id="name" type="text" placeholder="Name">
						</div>
						<div class="field half">
							<label for="email">Email</label>
							<input name="email" id="email" type="email" placeholder="Email">
						</div>
						<div class="field">
							<label for="message">Message</label>
							<textarea name="message" id="message" rows="6" placeholder="Message"></textarea>
						</div>
						<ul class="actions">
							<li><input value="Send Message" class="button" type="submit"></li>
						</ul>
					</form>
				</div>

			</section>

			<!-- Footer -->
			<footer id="footer">
				<div class="copyright">
					&copy; Untitled Design: <a href="https://templated.co/">TEMPLATED</a>. Images: <a href="https://unsplash.com/">Unsplash</a>.
				</div>
			</footer>
		</section>
	</div>

	<!-- Scripts -->

	<script src="assets/js/jquery.poptrox.min.js"></script>
	<script src="assets/js/jquery.scrolly.min.js"></script>
	<script src="assets/js/skel.min.js"></script>
	<script src="assets/js/util.js"></script>
	<script src="assets/js/main.js"></script>
	<script src="js/jquery-2.2.3.min.js"></script>
	  <script type='text/javascript' src="assets/js/carrito/bootstrap.min.js"></script>
	  <script type='text/javascript' src="assets/js/carrito/jquery.mycart.js"></script>
	  <script type="text/javascript">
	  $(function () {

	    var goToCartIcon = function($addTocartBtn){
	      var $cartIcon = $(".my-cart-icon");
	      var $image = $('<img width="30px" height="30px" src="' + $addTocartBtn.data("image") + '"/>').css({"position": "fixed", "z-index": "999"});
	      $addTocartBtn.prepend($image);
	      var position = $cartIcon.position();
	      $image.animate({
	        top: position.top,
	        left: position.left
	      }, 500 , "linear", function() {
	        $image.remove();
	      });
	    }

	    $('.my-cart-btn').myCart({
	      currencySymbol: '$',
	      classCartIcon: 'my-cart-icon',
	      classCartBadge: 'my-cart-badge',
	      classProductQuantity: 'my-product-quantity',
	      classProductRemove: 'my-product-remove',
	      classCheckoutCart: 'my-cart-checkout',
	      affixCartIcon: false,
	      showCheckoutModal: true,
	      cartItems: [],
	      clickOnAddToCart: function($addTocart){
	        goToCartIcon($addTocart);
	      },
	      afterAddOnCart: function(products, totalPrice, totalQuantity) {
	        console.log("afterAddOnCart", products, totalPrice, totalQuantity);
	      },
	      clickOnCartIcon: function($cartIcon, products, totalPrice, totalQuantity) {
	        console.log("cart icon clicked", $cartIcon, products, totalPrice, totalQuantity);
	      },
	      checkoutCart: function(products, totalPrice, totalQuantity) {
	        var checkoutString = "Total Price: " + totalPrice + "\nTotal Quantity: " + totalQuantity;
	        checkoutString += "\n\n id \t name \t summary \t price \t quantity \t image path";
	        $.each(products, function(){
	          checkoutString += ("\n " + this.id + " \t " + this.name + " \t " + this.summary + " \t " + this.price + " \t " + this.quantity + " \t " + this.image);
	        });
	        alert(checkoutString)
	        console.log("checking out", products, totalPrice, totalQuantity);
	      },
	      getDiscountPrice: function(products, totalPrice, totalQuantity) {
	        console.log("calculating discount", products, totalPrice, totalQuantity);
	        return totalPrice * 0.5;
	      }
	    });

	  });
	  </script>

	  <!-- <script type="text/javascript" src="data-script.js"></script> -->

	  <script id="pictures-template" type="text/x-handlebars-template">
	  	{{#pictures}}
	  	<div class="media">
	  		<a href={{href}}>
	  			<img src={{thumb}} alt="" title="This right here is a caption." />
	  			<span class="etiqueta">{{text}}</span>
	  		</a>
	  	</div>
	  	{{/pictures}}
	  </script>
	    
	  <script type="text/javascript">
	      //wait for page to load
	      $(document).ready(function(){
	        // Extract the text from the template .html() is the jquery helper method for that
	        var raw_template = $('#pictures-template').html();
	        // Compile that into an handlebars template
	        var template = Handlebars.compile(raw_template);
	        // Retrieve the placeHolder where the Posts will be displayed 
	        var placeHolder = $("#gallery-wrapper");
	        // Fetch all Blog Posts data from server in JSON
	        $.get("pictures.json", function(data,status,xhr){
	          var html = template(JSON.parse(data));
	          // Render the posts into the page
	          placeHolder.append(html);
	        });
	      });
	    </script>

	  <!-- <script>
	  	function getTemplateAjax(path, callback) {
	  		var source, template;
	  		jqueryNoConflict.ajax({
	  			url: path,
	  			success: function (data) {
	  				source = data;
	  				template = Handlebars.compile(source);
	  				if (callback) callback(template);
	  			}
	  		});
	  	}
	  	
	  	function renderHandlebarsTemplate(withTemplate,inElement,withData){
	  		getTemplateAjax(withTemplate, function(template) {
	  			jqueryNoConflict(inElement).html(template(withData));
	  		})
	  	};

	  	var source = $("#picture-template").html();
	  	var template = Handlebars.compile(source);
	  	var data = { pictures: [ 
	  		{ "href":"gallery_170301.html", "thumb": "images/170301/thumbs/01.jpg", "text": "gallery 1" },
	  		{ "href":"gallery_170302.html", "thumb": "images/170302/thumbs/01.jpg", "text": "gallery 2" },
	  		{ "href":"gallery_170303.html", "thumb": "images/170303/thumbs/01.jpg", "text": "gallery 3" },
	  		{ "href":"gallery_170304.html", "thumb": "images/170304/thumbs/01.jpg", "text": "gallery 4" },
	  		{ "href":"gallery_170305.html", "thumb": "images/170305/thumbs/01.jpg", "text": "gallery 5" },
	  		{ "href":"gallery_170306.html", "thumb": "images/170306/thumbs/01.jpg", "text": "gallery 6" },
	  		{ "href":"gallery_170307.html", "thumb": "images/170307/thumbs/01.jpg", "text": "gallery 7" },
	  		{ "href":"gallery_170308.html", "thumb": "images/170308/thumbs/01.jpg", "text": "gallery 8" },
	  		{ "href":"gallery_170309.html", "thumb": "images/170309/thumbs/01.jpg", "text": "gallery 9" },
	  		{ "href":"gallery_170310.html", "thumb": "images/170310/thumbs/01.jpg", "text": "gallery 10" },
	  		{ "href":"gallery_170311.html", "thumb": "images/170311/thumbs/01.jpg", "text": "gallery 11" },
	  		{ "href":"gallery_170312.html", "thumb": "images/170312/thumbs/01.jpg", "text": "gallery 12" },
	  		]};
	  		$("#gallery-wrapper").html(template(data));
	  		console.log('compile');
	  	</script> -->
</body>
</html>