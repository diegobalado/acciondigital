<section id="checkout">
<?php
if (isset($_POST["products"])) {
	$prod_array = (array) $_POST['products'];
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
	<h2>Por favor confirmá los datos de tu compra:</h2>
	<h3>Fotos:</h3>
	
	<p>
	<?php 
		echo $confirmData;
	?>
	</p>
</div>

<div class="column">
	<h2>Datos de Contacto</h2>
	<form action="/checkout/checkout.php" method="post">
		<div class="field half first">
			<label for="name">Nombre y Apellido</label>
			<input name="name" id="name" type="text" placeholder="Nombre">
		</div>
		<div class="field half">
			<label for="email">Email</label>
			<input name="email" id="email" type="email" placeholder="Email">
		</div>
		<div class="field">
			<label for="message">Observaciones</label>
			<textarea name="message" id="message" rows="6" placeholder="Mensaje"></textarea>
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