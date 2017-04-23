<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Accion Digital</title>
	<script type="text/javascript" src="/assets/js/jquery-2.2.3.min.js"></script>
</head>
<body>
<p>Nombre: </p>
<span id="name"></span><br>
<p>Cantidad: </p>
<span id="quantity"></span><br>
<p>Precio total: </p>
<span id="price"></span><br>
	<?php
	    echo('llego esto che: '.json_encode($_POST));
	?>
	<script>
		function getGET()
		{
		  let loc = document.location.href;
		  if(loc.indexOf('?')>0)

		  {
		    let getString = loc.split('?')[1];
		    let GET = getString.split('&');
		    let get = {};
		    for(let i = 0, l = GET.length; i < l; i++){
		      let tmp = GET[i].split('=');
		      get[tmp[0]] = unescape(decodeURI(tmp[1]).replace('#', ''));
		    }
		    // console.log('Parametros ' + get.g);
		    return get;
		  }
		}
		$(document).ready(function() {
			if (getGET().n && getGET().p && getGET().q) {
				$("#name").html(getGET().n);
				$("#price").html(getGET().p);
				$("#quantity").html(getGET().q);
			}
		});
	</script>
	<?php
	require_once "../assets/lib/mercadopago.php";

	if (isset($_GET["n"]) && isset($_GET["p"]) && isset($_GET["q"])) {
		
		$name_prod = $_GET["n"];
		$price_prod = intval($_GET["p"]);
		$quantity_prod = intval($_GET["q"]);

		$mp = new MP ("4078721764705895", "9fJGvVEd8I0lCvyi7lmnMkVPrfbYFu61");
		$preference_data = array(
			"items" => array(
				array(
					'title' => $name_prod,
					'quantity' => $quantity_prod,
					"currency_id" => "ARS",
					'unit_price' => $price_prod
				)
			)
		);
		$preference = $mp->create_preference ($preference_data);
	}
	?>
	<button id="checkout">CHECKOUT</button>
	<!-- <script>console.log('json ' + JSON.stringify(<?php echo json_encode($saveFile) ?>));</script> -->
	<script>
		$(document).ready(function() {
			window.location.href = '"'<?php echo $preference['response']['sandbox_init_point']; ?>'"';
			$('#checkout').on('click', function(event) {
			});
		});
	</script>
</body>
</html>