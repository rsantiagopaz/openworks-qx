<?php

require("Base.php");

class class_Prueba extends class_Base
{
  function __construct() {
    parent::__construct();
  }
  
  
  public function method_leer_prueba($params, $error) {
	$p = $params[0];
	
	$resultado = new stdClass;
	$resultado->id_sucursal = $p->id_sucursal;

	$link = mysql_connect($p->url, $p->username, $p->password);
	mysql_select_db($p->base, $link);
	mysql_query("SET NAMES 'utf8'", $link);
	
	return "Respuesta: " . $p->url;
  }
}

?>