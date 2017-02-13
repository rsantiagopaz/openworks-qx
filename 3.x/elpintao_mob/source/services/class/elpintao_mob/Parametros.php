<?php

require("Base.php");

class class_Parametros extends class_Base
{
  function __construct() {
    parent::__construct();
  }


  public function method_leer_fabrica($params, $error) {

  	return $this->toJson("SELECT * FROM fabrica ORDER BY descrip");
  }
  
  
  public function method_leer_transporte($params, $error) {

  	return $this->toJson("SELECT * FROM transporte ORDER BY descrip");
  }
}

?>