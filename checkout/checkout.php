<section id="checkout">
	<?php
	require_once "../assets/lib/mercadopago.php";
	$mp = new MP ("4083212776112832", "E76Ta738sO6HsDeWRTnJzuq5CAAEM0jh");
	
	if (isset($_POST["email"])) {
		$to      = 'acciondigitalfoto@gmail.com, jdiegomdq@gmail.com';
		$subject = 'Pedido de compra de '.$_REQUEST['name'].' desde www.acciondigitalfoto.com';

		$message = "Nombre: ".$_REQUEST['name']."\r\n"."Email: ".$_REQUEST['email']."\r\n\r\n"."Fotos: ".str_replace("+", "\r\n", $_POST['post_products'])."\r\n\r\n"."Observaciones: ".$_REQUEST["message"];

		if($_POST['post_totalQuantity'] > 1) $title = 'Pack de '.$_POST['post_totalQuantity'].' fotos - Acción Digital';
		else $title = 'Foto - Acción Digital';

		$pre_data = array(
			'title' => $title,
			'quantity' => 1,
			'currency_id' => "ARS",
			'unit_price' => intval($_POST['post_totalPrice'])
			);

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
		window.location.href = $href;	
	</script>
	<?php
}
?>
