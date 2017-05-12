<?php
	// var_dump(json_encode($_POST));


require_once "../assets/lib/mercadopago.php";

if (isset($_GET["n"]) && isset($_GET["p"]) && isset($_GET["q"])) {

	$name_prod = $_GET["n"];
	$price_prod = intval($_GET["p"]);
	$quantity_prod = intval($_GET["q"]);

}
$mp = new MP ("4078721764705895", "9fJGvVEd8I0lCvyi7lmnMkVPrfbYFu61");

$prod_array = json_decode($_POST['products']);

$pre_data = [];

foreach ($prod_array as $producto) {

	$item = array(
		'title' => $producto->name,
		'quantity' => intval($producto->quantity),
		"currency_id" => "ARS",
		'unit_price' => intval($producto->price)
		);
	array_push($pre_data, $item);
}
var_dump($pre_data);
$preference_data = array("items" => $pre_data);
var_dump($preference_data);
// $preference_data = array("items" => array(array('title' => $name_prod, 'quantity' => $quantity_prod, "currency_id" => "ARS", 'unit_price' => $price_prod ) ) );
$preference = $mp->create_preference ($preference_data);
?>
<script>window.location.href = "<?php echo $preference['response']['sandbox_init_point']; ?>";</script>