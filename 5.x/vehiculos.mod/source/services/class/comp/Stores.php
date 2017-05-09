<?php

set_time_limit(120);

require('Conexion.php');

$link1 = mysql_connect($servidor, $usuario, $password);
mysql_select_db($base, $link1);
mysql_query("SET NAMES 'utf8'", $link1);


switch ($_REQUEST['rutina']) {
case 'leer_mensaje': {

$resultado = array();

$sql = "SELECT * FROM alerta WHERE NOW() >= f_desde ORDER BY fecha";
$rs = mysql_query($sql);

while ($row = mysql_fetch_object($rs)) {
	if ($row->tipo == "P") {
		
	}

	$resultado[] = $row;
}

header('Content-Type: application/json');
echo json_encode($resultado);

break;
}


}


?>