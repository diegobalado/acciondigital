<section id="checkout">
	<?php
	// error_reporting(E_ALL);
	if (isset($_POST["email"])) {
		$payment = $_REQUEST['payment'];

		if ($payment == 'mp') {
			require_once "../assets/lib/mercadopago.php";
			$mp = new MP ("4083212776112832", "E76Ta738sO6HsDeWRTnJzuq5CAAEM0jh");
			$to      = 'acciondigitalfoto@gmail.com, diego.balado@electric.ai';
			$subject = 'Pedido de compra de '.$_REQUEST['name'].' - Mercado Pago';
			$pictures = str_replace(['<span></span>', '</h4>', '</p>'], '', $_POST['post_products']);
			$pictures = str_replace(['<br /><h4>', '<br />', '<p>', '<h4>'], "\r\n", $pictures);

			$message = "Nombre: ".$_REQUEST['name']."\r\n"."Email: ".$_REQUEST['email']."\r\n"."Teléfono: ".$_REQUEST['phone']."\r\n\r\n"."Fotos: ".$pictures."\r\n"."Total: $".$_POST['post_totalPrice']."\r\n\r\n"."Forma de Pago: Mercado Pago"."\r\n\r\n"."Observaciones: ".$_REQUEST["message"];

			if($_POST['post_totalQuantity'] > 1) $title = 'Pack de '.$_POST['post_totalQuantity'].' fotos - Accion Digital';
			else $title = 'Foto - Accion Digital';

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
				$aviso = iconv("UTF-8", "ISO-8859-1", 'El aviso de compra fue enviado correctamente.\nEn el siguiente paso vas a acceder al sitio de Mercado Pago para completar la compra.\nMuchas gracias.');
				echo "<script type='text/javascript'>alert('".$aviso."');</script>";
			}	else echo "<script type='text/javascript'>alert('Hubo un error al enviar el pedido.\nPor favor, intent\U00E1 nuevamente.');</script>";

			$preference = $mp->create_preference ($preference_data);
			?>
			<script>
				$href = "<?php echo $preference['response']['init_point']; ?>";
				window.location.href = $href;
			</script>
	<?php
		} else if ($payment == 'ctadni') {
		$ph = $_REQUEST['ph'];
		$to = 'acciondigitalfoto@gmail.com, diego.balado@electric.ai';
		if ($ph === 'MC') {
			$to = $to.', manucolavita@gmail.com';
		}
		$pictures = str_replace(['<span></span>', '</h4>', '</p>'], '', $_POST['post_products']);
		$pictures = str_replace(['<br /><h4>', '<br />', '<p>', '<h4>'], "\r\n", $pictures);
		$subject = 'Pedido de compra de '.$_REQUEST['name'].' - Cuenta DNI';
		$message = "Fotógrafo/a: ".$_REQUEST['ph']."\r\n"."Nombre: ".$_REQUEST['name']."\r\n"."Email: ".$_REQUEST['email']."\r\n"."Teléfono: ".$_REQUEST['phone']."\r\n\r\n"."Fotos: ".$pictures."\r\n"."Total: $".$_POST['post_totalPrice']."\r\n\r\n"."Forma de Pago: Cuenta DNI"."\r\n\r\n"."Observaciones: ".$_REQUEST["message"];
		$headers = 'From: ' . $_REQUEST['email'] . "\r\n" .
		'Reply-To: ' . $_REQUEST['email'] . "\r\n" .
		'X-Mailer: PHP/' . phpversion();

		if (mail($to, $subject, $message, $headers)) {
			$aviso = iconv("UTF-8", "ISO-8859-1", 'El aviso de compra fue enviado correctamente.\nA la brevedad vas a recibir un e-mail o Whatsapp con los datos necesarios para completar el pago.\nMuchas gracias.');
			echo "<script type='text/javascript'>alert('".$aviso."');</script>";
		}	else echo "<script type='text/javascript'>alert('Hubo un error al enviar el pedido.\nPor favor, intent\U00E1 nuevamente.');</script>";
	?>
		<script>window.location.href = '/';</script>
	<?php
    	} else {
    		$ph = $_REQUEST['ph'];
    		$to = 'acciondigitalfoto@gmail.com, diego.balado@electric.ai';
    		if ($ph === 'MC') {
    			$to = $to.', manucolavita@gmail.com';
    		}
    		$pictures = str_replace(['<span></span>', '</h4>', '</p>'], '', $_POST['post_products']);
    		$pictures = str_replace(['<br /><h4>', '<br />', '<p>', '<h4>'], "\r\n", $pictures);
    		$subject = 'Pedido de compra de '.$_REQUEST['name'].' - Transferencia Bancaria';
    		$message = "Fotógrafo/a: ".$_REQUEST['ph']."\r\n"."Nombre: ".$_REQUEST['name']."\r\n"."Email: ".$_REQUEST['email']."\r\n"."Teléfono: ".$_REQUEST['phone']."\r\n\r\n"."Fotos: ".$pictures."\r\n"."Total: $".$_POST['post_totalPrice']."\r\n\r\n"."Forma de Pago: Transferencia Bancaria"."\r\n\r\n"."Observaciones: ".$_REQUEST["message"];
    		$headers = 'From: ' . $_REQUEST['email'] . "\r\n" .
    		'Reply-To: ' . $_REQUEST['email'] . "\r\n" .
    		'X-Mailer: PHP/' . phpversion();
    
    		if (mail($to, $subject, $message, $headers)) {
    			$aviso = iconv("UTF-8", "ISO-8859-1", 'El aviso de compra fue enviado correctamente.\nA la brevedad vas a recibir un e-mail o Whatsapp con los datos necesarios para realizar la transferencia.\nMuchas gracias.');
    			echo "<script type='text/javascript'>alert('".$aviso."');</script>";
    		}	else echo "<script type='text/javascript'>alert('Hubo un error al enviar el pedido.\nPor favor, intent\U00E1 nuevamente.');</script>";
	?>
		<script>window.location.href = '/';</script>
	<?php
	}
}
?>
