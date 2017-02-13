<?php

require("Base.php");

class class_Parametros extends class_Base
{
  function __construct() {
    parent::__construct();
  }
  
  
  public function method_leer_paramet($params, $error) {
	$paramet = $this->toJson("SELECT * FROM paramet");
	
	return json_decode($paramet[0]->json);
  }
  
  public function method_grabar_paramet($params, $error) {
	$p = $params[0];
	
	$p = json_encode($p);
	
	$sql = "UPDATE paramet SET json='" . $p . "' WHERE id_paramet = 1";
	$rs = mysql_query($sql);
  }
}

?>