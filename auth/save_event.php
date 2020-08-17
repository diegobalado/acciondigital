<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);

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
    
    /* carga todas las imagenes de la carpeta elegida */
    $folder = $_POST["IdEvento"];
    $directorio = opendir($_SERVER["DOCUMENT_ROOT"]."/assets/images/eventos/".$folder."/");
    $pics = array();
    $archivo = "";
    
    while ($archivo = readdir($directorio)) //obtenemos un archivo y luego otro sucesivamente
    {
        if (!is_dir($archivo))
        {			
            $parts = explode('.', $archivo);
            $name = $parts[0];
            $extension = end($parts);
            if ($extension == "jpg"  || $extension == "png") {
                array_push($pics, $name);
            }
        }
    }
    sort($pics);
    /* imagenes cargadas y ordenadas en $pics */
    
    /* carga los datos de las publicidades */
    /* $adsOrdered trae los nombres de las publicidades como las ordena en el select*/
    // $adsF = $_REQUEST["ads"];
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

    /* guarda los datos en un JSON en datasources con el ID del evento como nombre */
    $saveFile = [];
    $saveFile = array(
        'IdEvento' => $_REQUEST["IdEvento"],
        'title' => $_REQUEST["title"],
        'pictures' => $pics,
        'ads' => $adsComplete,
        'price' => $_REQUEST["price"],
        'promo' => $_REQUEST["promo"],
        'search' => $_REQUEST["search"],
        'ph' => $_REQUEST["ph"]
    );

    $file = $_SERVER["DOCUMENT_ROOT"].'/assets/datasources/'.$folder.'.json';
    if (file_put_contents($file, json_encode($saveFile)) != false) $message = "El evento se creó correctamente";
    else $message = "Hubo un error al crear el evento";
    
    echo "<script type='text/javascript'>alert('$message'); window.location.href = '/auth/';</script>";
    /* devuelve un mensaje de error o redirecciona para la pagina de formularios */
}
?>