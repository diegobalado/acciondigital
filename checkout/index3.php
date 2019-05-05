<!-- <script>
	$('body').append('''/assets/css/pieces/checkout.css');
</script> -->
<link rel="stylesheet" href="/assets/css/sections/sectionCheckout.css" />
<link rel="stylesheet" href="/assets/css/pieces/forms.css" />
<script type="text/javascript">
	$('.ttip').on('mouseover', ()=>{
		$('.ttip-body').show()
	})
	$('.ttip').on('mouseout', ()=>{
		$('.ttip-body').hide()
	})
</script>
<section id="checkout">
	<h2>Por favor confirmá los datos de tu compra:</h2>
<?php
// require_once "../assets/lib/mercadopago.php";

// if (isset($_GET["n"]) && isset($_GET["p"]) && isset($_GET["q"])) {

// 	$name_prod = $_GET["n"];
// 	$price_prod = intval($_GET["p"]);
// 	$quantity_prod = intval($_GET["q"]);

// }

if (isset($_POST["products"])) {

	$prod_array = (array) $_POST['products']; // los datos de los productos que llegan del checkout
	$precioTotal = $_POST['totalPrice'];
	$pictures = '';
	$title = '';
	$events = [];
	$products = (array) $_POST['products'];
	sort($products);
	$title = $products[0]["name"];
	$ph = $products[0]["ph"];
	$pictures = '<h4>'.$title.':</h4><p>';
	foreach($products as $picture) {
		if ($picture["name"] == $title) {
			$pictures = $pictures.'<span></span>'.$picture["summary"].'<br />';
		} else {
			$title = $picture["name"];
			$pictures = $pictures.'</p><br /><h4>'.$title.':</h4><p><span></span>'.$picture["summary"].'<br />';
		}
	}
	$pictures = $pictures.'</p>';
	$picturesLength = count((array) $_POST['products']);
?>
<div class="social column">
	<h3>Fotos:</h3>
	<p>
		<?php 
			if ($ph === "JPF") {
				echo 'Fotógrafo';
			} else {
				echo 'Fotógrafa';
			}
		?>: <strong><?php echo $ph?></strong>
	</p>	
	<?php 
		echo $pictures;
	?>
	<hr>
	<p>Total:
		$<strong>
			<?php 
				echo $precioTotal;
			?>			
		</strong>
	</p>

	<div class="modales hidden">
		<h4><span class="icon fa-exclamation-triangle"></span> Importante</h4>		
		<div class="mod mod-mp hidden">
			<p>Eligiendo Mercado Pago como forma de pago, al hacer click en Confirmar la página se redirige automáticamente al sitio de Mercado Pago para completar los datos correspondientes para realizar el pago.</p>
		</div>

		<div class="mod mod-cbu hidden">
			<p>Eligiendo Transferencia Bancaria como forma de pago, al hacer click en Confirmar vas a recibir un email en la dirección indicada con los datos necesarios para realizar la transferencia.</p>
		</div>
	</div>
</div>
<div class="column form-page">
	<h3>Datos de Contacto</h3>
	<form action="/checkout/checkout.php" method="post">
		<?php
			$customValidityMsg = "Por favor, seleccioná un medio de pago.";
			$payType = '<div class="field half first" style="position:relative;"> 
				<label for="payment">Forma de pago<span style="color:red">*</span></label>
				<div class="select-custom">
					<select name="payment" id="payment" value="" onChange="handleOnChange()" required="true" oninvalid="this.setCustomValidity('.$customValidityMsg.')" oninput="setCustomValidity()">  
						<option value=""></option>
						<option value="mp">Mercado Pago</option>
						<option value="cbu">Transferencia Bancaria</option>
					</select>
					<span class="icon fa-chevron-down"></span>
				</div>

				<span class="ttip hidden icon fa-question-circle"></span>
				<div class="ttip-body"></div>
			</div>';

			if ($ph === 'JPF') {
				echo $payType;
			} else {
				echo'<input type="hidden" id="payment" name="payment" value="cbu">';
			}
		?>
		<div class="field">
			<label for="name">Nombre y Apellido<span style="color:red">*</span></label>
			<input name="name" id="name" type="text" placeholder="Nombre y Apellido" required="true" oninvalid="this.setCustomValidity('Por favor, completá tu nombre y apellido.')" oninput="setCustomValidity('')">
		</div>
		<div class="field half first">
			<label for="email">Email<span style="color:red">*</span></label>
			<input name="email" id="email" type="email" placeholder="Email" required="true" oninvalid="this.setCustomValidity('Por favor, ingresá tu casilla de e-mail.')" oninput="setCustomValidity('')">
		</div>
		<div class="field half">
			<label for="email">Confirmar Email<span style="color:red">*</span></label>
			<input name="emailConfirm" id="emailConfirm" type="email" placeholder="Confirmar Email" required="true" oninvalid="this.setCustomValidity('Las casillas de e-mail no coinciden.')" oninput="check(this)">
		</div>
		<div class="field half">
			<label for="phone">Teléfono <span style="font-weight: normal; color: #8e8e8e;">(Opcional)</span></label>
			<input name="phone" id="phone" type="text" placeholder="Teléfono">
		</div>
		<div class="field">
			<label for="message">Observaciones <span style="font-weight: normal; color: #8e8e8e;">(Opcional)</span></label>
			<textarea name="message" id="message" rows="6" placeholder="Mensaje"></textarea>
		</div>
		<ul class="actions">
			<li><input value="Cancelar" id="cancel" class="button" type="cancel"></li>
			<li><input value="Confirmar" id="confirmar" class="button" type="submit"></li>
		</ul>
		<script>
			$('.actions #cancel').on('click', function(event) {
				event.preventDefault();
				gtag('event', 'CancelCheckout', {'event_category': 'Checkout', 'event_label': 'Compra Cancelada' });
				window.location.href = '/inicio';
			});
			function check(input) {				
				if (input.value !== document.getElementById('email').value) {
					input.setCustomValidity('Las casillas de e-mail no coinciden.');
				} else {
					input.setCustomValidity('');
				}
			}
		</script>
		<script type="text/javascript">
			handleOnChange = () => {
				let value = $('#payment').val();
				$('.modales').removeClass('hidden')
				$('.mod').addClass('hidden')
				$('.mod-'+value).removeClass('hidden')
				var ttipBody = ''
				if (value === 'cbu')
					ttipBody = '<p>Vas a recibir en tu casilla de email los datos necesarios para realizar la transferencia.</p>'
				else if (value === 'mp')
					ttipBody = '<p>Al hacer click en Confirmar, la página se redirige automáticamente hacia el sitio de Mercado Pago para completar el pago.</p>'
				else 
					$('.modales').addClass('hidden')
				$('.ttip-body').html(ttipBody)
			}
		</script>
		<?php 
		echo'<input type="hidden" id="post_products" name="post_products" value="'.$pictures.'" >';
		echo'<input type="hidden" id="post_totalQuantity" name="post_totalQuantity" value="'. $picturesLength .'">';
		echo'<input type="hidden" id="post_totalPrice" name="post_totalPrice" value="'. $precioTotal .'">';
		echo'<input type="hidden" id="ph" name="ph" value="'. $ph .'">';
		?>
	</form>
</div>
<?php
	}
?>
</section>
