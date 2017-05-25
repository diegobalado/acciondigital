
<?php

require_once "../assets/lib/mercadopago.php";

// if (isset($_GET["n"]) && isset($_GET["p"]) && isset($_GET["q"])) {

// 	$name_prod = $_GET["n"];
// 	$price_prod = intval($_GET["p"]);
// 	$quantity_prod = intval($_GET["q"]);

// }
if (isset($_POST["products"])) {
	$mp = new MP ("4078721764705895", "9fJGvVEd8I0lCvyi7lmnMkVPrfbYFu61");
	echo('<script>console.log("*$_POST[products] " + '.$_POST['products'].');</script>');
	$prod_array = $_POST['products']; // los datos de los productos que llegan del checkout
	echo('<script>console.log("*Prodarray "+'.count($prod_array).');</script>');
	$pre_data = [];
	foreach ($prod_array as $producto) { //los mapeo en $pre_data para tener los datos que van a mercadopago
		$item = array(
			'title' => $producto['name'],
			'quantity' => intval($producto['quantity']),
			"currency_id" => "ARS",
			'unit_price' => intval($producto['price'])
			);
		echo('<script>console.log("*$item " + '.json_encode($item).');</script>');
		array_push($pre_data, $item);
	}

	// echo "pre_data: ";
	echo('<script>console.log("*$pre_data " + '.json_encode($pre_data).');</script>');
	// var_dump($pre_data);
	echo "\r\n";

	$preference_data = array("items" => $pre_data);

	// echo "preference data: ";
	// var_dump($preference_data);
	echo('<script>console.log("*$preference_data " + JSON.stringify('.json_encode($preference_data).'));</script>');
	echo "\r\n";

				// $preference_data = array("items" => array(array('title' => $name_prod, 'quantity' => $quantity_prod, "currency_id" => "ARS", 'unit_price' => $price_prod ) ) );
}
?>

<form action="/checkout/index3.php" method="post">
	<div class="field half first">
		<label for="name">Nombre y Apellido</label>
		<input name="name" id="name" type="text" placeholder="Name">
	</div>
	<div class="field half">
		<label for="email">Email</label>
		<input name="email" id="email" type="email" placeholder="Email">
	</div>
	<div class="field">
		<label for="message">Observaciones</label>
		<textarea name="message" id="message" rows="6" placeholder="Message"></textarea>
	</div>
	<ul class="actions">
		<li><input value="Enviar" class="button" type="submit"></li>
	</ul>
	<input type="hidden" id="products" name="products" value="<?php products ?>">
</form>

<?php

if (isset($_POST["email"])) {
	echo('<script>alert("*adentro1");</script>');
	$to      = 'jdiegomdq@gmail.com';
	$subject = 'Pedido de compra de '.$_REQUEST['name'].' desde www.acciondigitalfoto.com';
	$message = json_encode($pre_data)."\r\n";
	
	echo('<script>console.log("*$message " + '.$message.');</script>');
	// echo "message: ";
	// 	var_dump($message);
	echo "\r\n";
	$headers = 'From: ' . $_REQUEST['email'] . "\r\n" .
	'Reply-To: ' . $_REQUEST['email'] . "\r\n" .
	'X-Mailer: PHP/' . phpversion();
	if (mail($to, $subject, $message, $headers)) echo "<script type='text/javascript'>alert('El aviso de compra fue enviado con éxito');</script>";
	else echo "<script type='text/javascript'>alert('Hubo un error al enviar el pedido.');</script>";
}

$preference = $mp->create_preference ($preference_data);
			// if (false) {
/*	echo('<script>window.location.href = "<?php echo $preference['response']['sandbox_init_point']; ?>";</script>');*/
			// }		
?>