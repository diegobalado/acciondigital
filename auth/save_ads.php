<?php
	if (isset($_POST["adData"])) {
		$adsFile = $_SERVER["DOCUMENT_ROOT"].'/assets/datasources/ads.json';
		$adData = json_decode($_POST['adData'], true);

		if (file_put_contents($adsFile, json_encode($adData)) != false)
			echo 200;
		else
			echo 400;
	}
?>