<?php
session_start();

require("Base.php");

class class_Parametros extends class_Base
{
	
	
  public function method_alta_modifica_tipo_prestacion($params, $error) {
  	$p = $params[0];
  	
  	$id_tipo_prestacion = $p->model->id_tipo_prestacion;
  	
	$sql = "SELECT id_tipo_prestacion FROM tipo_prestaciones WHERE denominacion LIKE '" . $p->model->denominacion . "' AND id_tipo_prestacion<>" . $p->model->id_tipo_prestacion;
	$rs = $this->mysqli->query($sql);
	if ($rs->num_rows > 0) {
		$row = $rs->fetch_object();
		
		$error->SetError((int) $row->id_tipo_prestacion, "duplicado");
		return $error;
	} else {
		$set = $this->prepararCampos($p->model, "tipo_prestaciones");
			
		if ($p->model->id_tipo_prestacion == "0") {
			$sql = "INSERT tipo_prestaciones SET " . $set;
			$this->mysqli->query($sql);
			
			$id_tipo_prestacion = $this->mysqli->insert_id;		
		} else {
			$sql = "UPDATE tipo_prestaciones SET " . $set . " WHERE id_tipo_prestacion=" . $p->model->id_tipo_prestacion;
			$this->mysqli->query($sql);
		}
		
		return $id_tipo_prestacion;
	}
  }
  
  
  public function method_leer_tipo_prestacion($params, $error) {
  	$p = $params[0];
  	
  	$sql = "SELECT * FROM tipo_prestaciones";

	return $this->toJson($sql);
  }
  
  
  public function method_escribir_tipo_prestacion($params, $error) {
	$p = $params[0];
	
	$sql = "SELECT id_tipo_prestacion FROM tipo_prestaciones WHERE denominacion LIKE '" . $p->denominacion . "'";
	$rs = $this->mysqli->query($sql);
	if ($rs->num_rows > 0) {
		$row = $rs->fetch_object();
		
		$error->SetError((int) $row->id_tipo_prestacion, "duplicado");
		return $error;
	} else {
		$sql = "INSERT tipo_prestaciones SET";
		$sql.= "  denominacion='" . $p->denominacion . "'";
	
		$this->mysqli->query($sql);
		
		$insert_id = $this->mysqli->insert_id;
		
		return $insert_id;		
	}
  }
  

  public function method_leer_prestacion($params, $error) {
  	$p = $params[0];
  	
  	$sql = "SELECT * FROM prestaciones";
  	if (! is_null($p->id_tipo_prestacion)) $sql.= " WHERE id_tipo_prestacion=" . $p->id_tipo_prestacion;

	return $this->toJson($sql);
  }
  
  
  public function method_escribir_prestacion($params, $error) {
	$p = $params[0];

	$sql = "INSERT prestaciones SET";
	$sql.= "  id_tipo_prestacion='" . $p->id_tipo_prestacion . "'";
	$sql.= ", codigo='" . $p->codigo . "'";
	$sql.= ", descripcion='" . $p->descripcion . "'";
	$sql.= ", valor='" . $p->valor . "'";

	$this->mysqli->query($sql);
	
	$insert_id = $this->mysqli->insert_id;
	
	return $insert_id;
  }
}

?>