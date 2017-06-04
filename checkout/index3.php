<!-- <script>
	$('body').append('''/assets/css/pieces/checkout.css');
</script> -->
<link rel="stylesheet" href="/assets/css/sections/sectionCheckout.css" />
<section id="checkout">
<?php
require_once "../assets/lib/mercadopago.php";

// if (isset($_GET["n"]) && isset($_GET["p"]) && isset($_GET["q"])) {

// 	$name_prod = $_GET["n"];
// 	$price_prod = intval($_GET["p"]);
// 	$quantity_prod = intval($_GET["q"]);

// }

$mp = new MP ("4083212776112832", "E76Ta738sO6HsDeWRTnJzuq5CAAEM0jh");

if (isset($_POST["products"])) {

	$prod_array = (array) $_POST['products']; // los datos de los productos que llegan del checkout
	// echo('<script>console.log("*Prodarray "+'.count($prod_array).');</script>');
	$pre_data = [];
	$precioTotal = $_POST['totalPrice'];
	$pictures = '';
	foreach((array) $_POST['products'] as $picture) {
		$pictures = $pictures.'+'.$picture["name"];		
	}
	$picturesLength = count((array) $_POST['products']);

	$confirmData = str_replace("+", "<br />", $pictures);
?>
<div class="social column">
	<h2>Por favor confirme los datos de su compra:</h2>
	<h3>Fotos:</h3>
	
	<p>
	<?php 
		echo $confirmData;
	?>
	</p>
</div>

<div class="column">
	<h2>Datos de Contacto</h2>
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
			<li><input value="Cancelar" id="cancel" class="button" type="cancel"></li>
			<li><input value="Enviar" class="button" type="submit"></li>
		</ul>
		<script>
			$('.actions #cancel').on('click', function(event) {
				event.preventDefault();
				window.location.href = '/inicio';
			});
		</script>
		<?php 
		echo'<input type="hidden" id="post_products" name="post_products" value="'.$pictures.'" >';
		echo'<input type="hidden" id="post_totalQuantity" name="post_totalQuantity" value="'. $picturesLength .'">';
		echo'<input type="hidden" id="post_totalPrice" name="post_totalPrice" value="'. $precioTotal .'">';
		?>
	</form>
</div>
<?php
	}
?>


<?php
if (isset($_POST["email"])) {
	$to      = 'acciondigitalfoto@gmail.com, jdiegomdq@gmail.com';
	$subject = 'Pedido de compra de '.$_REQUEST['name'].' desde www.acciondigitalfoto.com';
	
	// $message = json_encode(json_encode($pre_data))."\r\n";
	$message = "Nombre: ".$_REQUEST['name']."\r\n"."Email: ".$_REQUEST['email']."\r\n\r\n"."Fotos: ".str_replace("+", "\r\n", $_POST['post_products'])."\r\n\r\n"."Observaciones: ".$_REQUEST["message"];

	if($_POST['post_totalQuantity'] > 1) $title = 'Pack de '.$_POST['post_totalQuantity'].' fotos - Acción Digital';
	else $title = 'Foto - Acción Digital';

	// echo('<script>console.log("***message " + '.$message.');</script>');

	$pre_data = array(
		'title' => $title,
		'quantity' => 1,
		'currency_id' => "ARS",
		'unit_price' => intval($_POST['post_totalPrice'])
		);

	// echo('<script>console.log("*$pre_data " + '.json_encode(json_encode($pre_data)).');</script>');
	echo "\r\n";

	$preference_data = array(
		'items' => array(
			$pre_data
			)
		);
	$headers = 'From: ' . $_REQUEST['email'] . "\r\n" .
	'Reply-To: ' . $_REQUEST['email'] . "\r\n" .
	'X-Mailer: PHP/' . phpversion();

	if (mail($to, $subject, $message, $headers)) {
		$aviso = iconv("UTF-8", "ISO-8859-1", 'El aviso de compra fue enviado con éxito');
		echo "<script type='text/javascript'>alert('".$aviso."');</script>";
	}	else echo "<script type='text/javascript'>alert('Hubo un error al enviar el pedido.');</script>";
	
	$preference = $mp->create_preference ($preference_data);
	?>
	<script>
		$href = "<?php echo $preference['response']['init_point']; ?>";	
		// window.open($href, 'MercadoPago', 'width=400,height=200,scrollbars=yes');		
		window.location.href = $href;	
	</script>
	<?php
}
?>
</section>