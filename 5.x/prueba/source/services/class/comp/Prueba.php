<?php

class class_Prueba
{
	
	
  public function method_leer_datos($params, $error) {
	
	//throw new JsonRpcError("sesion_terminada", 1000);
	
	$error->setError(999, "sesion_terminada");
	return $error;

  }
}

?>