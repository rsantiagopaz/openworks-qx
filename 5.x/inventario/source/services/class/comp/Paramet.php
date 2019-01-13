<?php

require("Base.php");

class class_Paramet extends class_Base
{

  
  public function method_leer_tipo_alta($params, $error) {
  	$p = $params[0];

	$sql = "SELECT * FROM tipo_alta ORDER BY descrip";
	return $this->toJson($sql);
  }
  
  
  public function method_escribir_tipo_alta($params, $error) {
  	$p = $params[0];
  	
  	$cambios = $p->cambios;
  	
	$this->mysqli->query("START TRANSACTION");
	
	foreach ($cambios->altas as $item) {
		$sql="INSERT INTO tipo_alta SET descrip='" . $item->descrip . "'";
		$this->mysqli->query($sql);
		if ($this->mysqli->errno) break;
	}
	if (! $this->mysqli->errno) {
		foreach ($cambios->modificados as $item) {
			$sql="UPDATE tipo_alta SET descrip='" . $item->descrip . "' WHERE id_tipo_alta='" . $item->id_tipo_alta . "'";
			$this->mysqli->query($sql);
			if ($this->mysqli->errno) break;
		}	
	}
	if ($this->mysqli->errno) {
		$this->mysqli->query("ROLLBACK");
		return $this->mysqli->error;
	} else {
		$this->mysqli->query("COMMIT");
	}
  }
  
  
  public function method_leer_tipo_baja($params, $error) {
  	$p = $params[0];

	$sql = "SELECT * FROM tipo_baja ORDER BY descrip";
	return $this->toJson($sql);
  }
  
  
  public function method_escribir_tipo_baja($params, $error) {
  	$p = $params[0];
  	
  	$cambios = $p->cambios;
  	
	$this->mysqli->query("START TRANSACTION");
	
	foreach ($cambios->altas as $item) {
		$sql="INSERT INTO tipo_baja SET descrip='" . $item->descrip . "'";
		$this->mysqli->query($sql);
		if ($this->mysqli->errno) break;
	}
	if (! $this->mysqli->errno) {
		foreach ($cambios->modificados as $item) {
			$sql="UPDATE tipo_baja SET descrip='" . $item->descrip . "' WHERE id_tipo_baja='" . $item->id_tipo_baja . "'";
			$this->mysqli->query($sql);
			if ($this->mysqli->errno) break;
		}	
	}
	if ($this->mysqli->errno) {
		$this->mysqli->query("ROLLBACK");
		return $this->mysqli->error;
	} else {
		$this->mysqli->query("COMMIT");
	}
  }
  
  
  public function method_leer_tipo_bien($params, $error) {
  	$p = $params[0];

	$sql = "SELECT * FROM tipo_bien ORDER BY descrip";
	return $this->toJson($sql);
  }
  
  
  public function method_escribir_tipo_bien($params, $error) {
  	$p = $params[0];
  	
  	$cambios = $p->cambios;
  	
	$this->mysqli->query("START TRANSACTION");
	
	foreach ($cambios->altas as $item) {
		$sql="INSERT INTO tipo_bien SET descrip='" . $item->descrip . "'";
		$this->mysqli->query($sql);
		if ($this->mysqli->errno) break;
	}
	if (! $this->mysqli->errno) {
		foreach ($cambios->modificados as $item) {
			$sql="UPDATE tipo_bien SET descrip='" . $item->descrip . "' WHERE id_tipo_bien='" . $item->id_tipo_bien . "'";
			$this->mysqli->query($sql);
			if ($this->mysqli->errno) break;
		}	
	}
	if ($this->mysqli->errno) {
		$this->mysqli->query("ROLLBACK");
		return $this->mysqli->error;
	} else {
		$this->mysqli->query("COMMIT");
	}
  }

}

?>
