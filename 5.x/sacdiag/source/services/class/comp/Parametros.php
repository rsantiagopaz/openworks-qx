<?php
session_start();

require("Base.php");

class class_Parametros extends class_Base
{
	
	
  public function method_alta_modifica_prestacion($params, $error) {
  	$p = $params[0];
  	
  	$id_prestacion = $p->model->id_prestacion;
  	
	$sql = "SELECT id_prestacion FROM prestaciones WHERE codigo LIKE '" . $p->model->codigo . "' AND id_prestacion<>" . $p->model->id_prestacion;
	$rs = $this->mysqli->query($sql);
	if ($rs->num_rows > 0) {
		$row = $rs->fetch_object();
		
		$error->SetError((int) $row->id_prestacion, "codigo_duplicado");
		return $error;
	}
	
	$sql = "SELECT id_prestacion FROM prestaciones WHERE denominacion LIKE '" . $p->model->denominacion . "' AND id_prestacion<>" . $p->model->id_prestacion;
	$rs = $this->mysqli->query($sql);
	if ($rs->num_rows > 0) {
		$row = $rs->fetch_object();
		
		$error->SetError((int) $row->id_prestacion, "descrip_duplicado");
		return $error;
	}

		
	$set = $this->prepararCampos($p->model, "prestaciones");
		
	if ($p->model->id_prestacion == "0") {
		$sql = "INSERT prestaciones SET " . $set;
		$this->mysqli->query($sql);
		
		$id_prestacion = $this->mysqli->insert_id;		
	} else {
		$sql = "UPDATE prestaciones SET " . $set . " WHERE id_prestacion=" . $p->model->id_prestacion;
		$this->mysqli->query($sql);
	}
	
	return $id_prestacion;
  }
	
	
  public function method_alta_modifica_prestacion_tipo($params, $error) {
  	$p = $params[0];
  	
  	$id_prestacion_tipo = $p->model->id_prestacion_tipo;
  	
	$sql = "SELECT id_prestacion_tipo FROM prestaciones_tipo WHERE denominacion LIKE '" . $p->model->denominacion . "' AND id_prestacion_tipo<>" . $p->model->id_prestacion_tipo;
	$rs = $this->mysqli->query($sql);
	if ($rs->num_rows > 0) {
		$row = $rs->fetch_object();
		
		$error->SetError((int) $row->id_prestacion_tipo, "duplicado");
		return $error;
	} else {
		$set = $this->prepararCampos($p->model, "prestaciones_tipo");
			
		if ($p->model->id_prestacion_tipo == "0") {
			$sql = "INSERT prestaciones_tipo SET " . $set;
			$this->mysqli->query($sql);
			
			$id_prestacion_tipo = $this->mysqli->insert_id;		
		} else {
			$sql = "UPDATE prestaciones_tipo SET " . $set . " WHERE id_prestacion_tipo=" . $p->model->id_prestacion_tipo;
			$this->mysqli->query($sql);
		}
		
		return $id_prestacion_tipo;
	}
  }
  
  
  public function method_alta_modifica_prestador($params, $error) {
  	$p = $params[0];
  	
  	$id_prestador = $p->model->id_prestador;
  	

	$sql = "SELECT id_prestador FROM prestadores WHERE denominacion LIKE '" . $p->model->denominacion . "' AND id_prestador<>" . $p->model->id_prestador;
	$rs = $this->mysqli->query($sql);
	if ($rs->num_rows > 0) {
		$row = $rs->fetch_object();
		
		$error->SetError((int) $row->id_prestador, "descrip_duplicado");
		return $error;
	}

		
	$set = $this->prepararCampos($p->model, "prestadores");
		
	if ($p->model->id_prestador == "0") {
		$sql = "INSERT prestadores SET " . $set;
		$this->mysqli->query($sql);
		
		$id_prestador = $this->mysqli->insert_id;
	} else {
		$sql = "UPDATE prestadores SET " . $set . " WHERE id_prestador=" . $p->model->id_prestador;
		$this->mysqli->query($sql);
	}
	
	return $id_prestador;
  }
  
  
  public function method_leer_prestador_prestacion($params, $error) {
  	$p = $params[0];
  	
  	$opciones = new stdClass;
  	$opciones->valor = "float";
  	
  	$sql = "SELECT";
  	$sql.= "  prestaciones.*";
  	$sql.= ", prestadores_prestaciones.id_prestador_prestacion";
  	$sql.= ", prestadores_prestaciones.estado";
  	$sql.= " FROM prestadores_prestaciones INNER JOIN prestadores USING(id_prestador) INNER JOIN prestaciones USING(id_prestacion)";
  	$sql.= " WHERE id_prestador=" . $p->id_prestador;
  	$sql.= " ORDER BY denominacion";
  	
  	return $this->toJson($sql, $opciones);
  }
  
  
  public function method_agregar_prestador_prestacion($params, $error) {
  	$p = $params[0];
  	
  	$sql = "INSERT prestadores_prestaciones SET";
  	$sql.= "  id_prestador='" . $p->id_prestador . "'";
  	$sql.= ", id_prestacion='" . $p->id_prestacion . "'";
  	$sql.= ", estado='H'";
  	
  	$this->mysqli->query($sql);
  	
  	$insert_id = $this->mysqli->insert_id;
  	
  	return $insert_id;
  }
  
  
  public function method_leer_prestacion_tipo($params, $error) {
  	$p = $params[0];
  	
  	$sql = "SELECT * FROM prestaciones_tipo";

	return $this->toJson($sql);
  }
  
  
  public function method_escribir_estado($params, $error) {
  	$p = $params[0];
  	
  	$sql = "UPDATE prestadores_prestaciones SET estado='" . $p->estado . "' WHERE id_prestador_prestacion=" . $p->id_prestador_prestacion;
	
	$this->mysqli->query($sql);
  }
  
  
  public function method_autocompletarPersona($params, $error) {
	$p = $params[0];

	if (is_numeric($p->texto)) {
		$sql = "SELECT persona_id AS model, CONCAT(persona_dni, ' - ', persona_nombre) AS label FROM personas WHERE persona_dni LIKE '". $p->texto . "%' ORDER BY label";
	} else {
		$sql = "SELECT persona_id AS model, CONCAT(TRIM(persona_nombre), ' (', persona_dni, ')') AS label FROM personas WHERE persona_nombre LIKE '%". $p->texto . "%' ORDER BY label";
	}

	return $this->toJson($sql);
  }
  
  
  public function method_autocompletarPrestador($params, $error) {
  	$p = $params[0];
  	
  	$sql = "SELECT prestadores.*, id_prestador AS model, denominacion AS label FROM prestadores WHERE denominacion LIKE '%". $p->texto . "%' ORDER BY denominacion";

	return $this->toJson($sql);
  }
  
  
  public function method_autocompletarPrestacion($params, $error) {
  	$p = $params[0];
  	
  	$opciones = new stdClass;
  	$opciones->valor = "float";
  	
  	$sql = "SELECT prestaciones.*, id_prestacion AS model, CONCAT(prestaciones.denominacion, ' (', prestaciones_tipo.denominacion, ')') AS label FROM prestaciones INNER JOIN prestaciones_tipo USING(id_prestacion_tipo) WHERE prestaciones.denominacion LIKE'%". $p->texto . "%'";
  	if (! is_null($p->phpParametros)) $sql.= " AND id_prestacion_tipo=" . $p->phpParametros->id_prestacion_tipo;

	return $this->toJson($sql, $opciones);
  }
  
  
  public function method_escribir_contrasena($params, $error) {
  	$p = $params[0];
  	
	$set = $this->prepararCampos($p->model);
	
	$sql = "SELECT * FROM usuario WHERE id_usuario=" . $p->model->id_usuario . " AND password=MD5('" . $p->model->password . "')";
	$rs = mysql_query($sql);
	if (mysql_num_rows($rs) > 0) {
  		$sql = "UPDATE usuario SET password=MD5('" . $p->model->passnueva . "') WHERE id_usuario=" . $p->model->id_usuario;
  		mysql_query($sql);
	} else {
		$error->SetError(0, "password");
		return $error;
	}
  }
}

?>