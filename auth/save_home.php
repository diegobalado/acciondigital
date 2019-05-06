<?php
function search($array, $key, $value) /* para buscar en arreglos multidimensionales*/
{
    $results = array();

    if (is_array($array)) {
        if (isset($array[$key]) && $array[$key] == $value) {
            $results[] = $array;
        }

        foreach ($array as $subarray) {
            $results = array_merge($results, search($subarray, $key, $value));
        }
    }

    return $results;
}

if (isset($_POST["IdEvento"])) {
    $idEventos = $_REQUEST['IdEvento'];

    $file = $_SERVER["DOCUMENT_ROOT"].'/assets/datasources/inicio.json';
    $saveFile = [];
    $eventos = [];
    foreach ($idEventos as $idEvento) {
        $data = file_get_contents($_SERVER["DOCUMENT_ROOT"].'/assets/datasources/'.$idEvento.'.json');
        $product = json_decode($data, true) ;
        $evento = array(
            'ID' => $idEvento,
            'text' => $product['title'],
            'ph' => $product['ph']
            );
        array_push($eventos, $evento);
    }
    rsort($eventos);
    
    /* carga los datos de las publicidades */
    /* $adsOrdered trae los nombres de las publicidades como las ordena en el select*/
    $adsF = $_REQUEST["ads"];
    $adsOrdered = json_decode($_REQUEST["adsOrdered"], true);

    $data = json_decode(file_get_contents($_SERVER["DOCUMENT_ROOT"].'/assets/datasources/ads.json'), true);
    $adsData = array();
    
    $adsComplete = array();

    foreach ($adsOrdered as $ad) {
        if (count(search($data, "name", $ad)))
            $adTemp = search($data, "name", $ad)[0];
        else
            $adTemp = array (
                "name" => $ad,
                "href" => "#"
            );
        array_push($adsComplete, $adTemp);
    }

    foreach ($data as $ad) {
        $adData = array(
            "etiqueta" => $ad["name"],
            "ref" => $ad["href"]
        );
        array_push($adsData, $ad);
    }

    $saveFile = array(
        'eventos' => $eventos,
        'ads' => $adsComplete
        );
    if (file_put_contents($file, json_encode($saveFile)) != false) $message = "La p\u00e1gina de inicio se cre\u00f3 correctamente";
    else $message = "Hubo un error al crear la p\u00e1gina de inicio";

    echo "<script type='text/javascript'>alert('$message'); window.location.href = '/inicio/';</script>";
}
?>