<?php
session_start();

require("Base.php");

class class_Parametros extends class_Base
{
	
	
  public function method_alta_modifica_prestador($params, $error) {
  	$p = $params[0];
  	
  	$fecha = date("Y-m-d");
  	
  	$organismo_area_id = $p->model->organismo_area_id;
  	$p->model->razon_social = $p->model->denominacion;
  	

	$sql = "SELECT organismo_area_id FROM _organismos_areas WHERE organismo_area_estado='3' AND organismo_area LIKE '" . $p->model->denominacion . "' AND organismo_area_id <> '" . $p->model->organismo_area_id . "'";
	$rs = $this->mysqli->query($sql);
	if ($rs->num_rows > 0) {
		$row = $rs->fetch_object();
		
		$error->SetError((int) $row->organismo_area_id, "descrip_duplicado");
		return $error;
	}

		
	$this->mysqli->query("START TRANSACTION");
		
	if ($p->model->organismo_area_id == "-1") {
		
		do {
			$organismo_area_id = $this->generateRandomString(5);
			
			$sql = "SELECT organismo_area_id FROM _organismos_areas WHERE organismo_area_id='" . $organismo_area_id . "'";
			$rs = $this->mysqli->query($sql);
			
		} while ($rs->num_rows > 0);
		
		$p->model->organismo_area_id = $organismo_area_id;
		
		
		 




		
		$sig_semanal = "NULL";
		/*
		if ($p->model->cronograma_semanal) {
			$sql = "SELECT * FROM cronograma_semanal";
			$rs = $this->mysqli->query($sql);
			while ($row = $rs->fetch_object()) {
				if ($fecha >= $row->fecha_desde && $fecha <= $row->fecha_hasta) {
					$sig_semanal = "'" . $row->id_prestador . "'";
					break;
				}
			}
			
			if ($sig_semanal != "NULL") {
				$sql = "SELECT * FROM prestador_datos WHERE sig_semanal=" . $sig_semanal;
				$rs = $this->mysqli->query($sql);
				if ($rs->num_rows > 0) {
					$row = $rs->fetch_object();
				
					$sql = "UPDATE prestador_datos SET sig_semanal='" . $organismo_area_id . "' WHERE organismo_area_id='" . $row->organismo_area_id . "'";
					$this->mysqli->query($sql);
				}
			}
		}
		*/
		
		
		
		
		
		if ($p->model->cronograma_semanal) {
			do {
				$sql = "SELECT * FROM cronograma_semanal";
				$rs = $this->mysqli->query($sql);
				for ($i = 1; $i <= $rs->num_rows; $i++) {
					$row = $rs->fetch_object();
					if ($fecha >= $row->fecha_desde && $fecha <= $row->fecha_hasta) {
						$sig_semanal = "'" . $row->id_prestador . "'";
						break;
					}
					
				}
	
				if (($sig_semanal == "NULL")) {
					$datetime = new DateTime($row->fecha_hasta);
					
					$datetime = $datetime->add(new DateInterval("P1D"));
					$fecha_desde = $datetime->format("Y-m-d");
					
					$datetime = new DateTime($row->fecha_hasta);
					
					$datetime = $datetime->add(new DateInterval("P1W"));
					$fecha_hasta = $datetime->format("Y-m-d");
					
					$sql = "SELECT * FROM prestador_datos WHERE organismo_area_id='" . $row->id_prestador . "'";
					$rsPD = $this->mysqli->query($sql);
					$rowPD = $rsPD->fetch_object();
					
					$sql = "INSERT cronograma_semanal SET id_prestador='" . $rowPD->sig_semanal . "', fecha_desde='" . $fecha_desde . "', fecha_hasta='" . $fecha_hasta . "'";
					$this->mysqli->query($sql);
				}
				
			} while ($sig_semanal == "NULL");
			
			
			$sql = "SELECT * FROM prestador_datos WHERE sig_semanal=" . $sig_semanal;
			$rs = $this->mysqli->query($sql);
			if ($rs->num_rows > 0) {
				$row = $rs->fetch_object();
			
				$sql = "UPDATE prestador_datos SET sig_semanal='" . $organismo_area_id . "' WHERE organismo_area_id='" . $row->organismo_area_id . "'";
				$this->mysqli->query($sql);
			}
		}
		
		
		
		
		
		
		
		
		
		
		
		
		
		$sig_mensual = "NULL";
		/*
		if ($p->model->cronograma_mensual) {
			$sql = "SELECT * FROM cronograma_mensual";
			$rs = $this->mysqli->query($sql);
			while ($row = $rs->fetch_object()) {
				if ((int) substr($fecha, 5 , 2) == (int) $row->mes) {
					$sig_mensual = "'" . $row->id_prestador . "'";
					break;
				}
			}
			
			if ($sig_mensual != "NULL") {
				$sql = "SELECT * FROM prestador_datos WHERE sig_mensual=" . $sig_mensual;
				$rs = $this->mysqli->query($sql);
				if ($rs->num_rows > 0) {
					$row = $rs->fetch_object();
				
					$sql = "UPDATE prestador_datos SET sig_mensual='" . $organismo_area_id . "' WHERE organismo_area_id='" . $row->organismo_area_id . "'";
					$this->mysqli->query($sql);
				}
			}
		}
		*/
		
		
		
		if ($p->model->cronograma_mensual) {
			do {
				$sql = "SELECT * FROM cronograma_mensual";
				$rs = $this->mysqli->query($sql);
				for ($i = 1; $i <= $rs->num_rows; $i++) {
					$row = $rs->fetch_object();
					
					if (substr($fecha, 0, 4) == substr($row->fecha, 0, 4) && substr($fecha, 5, 2) == substr($row->fecha, 5, 2)) {
						$sig_mensual = "'" . $row->id_prestador . "'";
						break;
					}
				}
	
				if (($sig_mensual == "NULL")) {
					$datetime = new DateTime(substr($row->fecha, 0, 4) . "-" . substr($row->fecha, 5, 2) . "-" . "01");
					$datetime->add(new DateInterval("P1M"));
					$fecha_desde = $datetime->format("Y") . "-" . $datetime->format("m") . "-" . "01";
					
					$sql = "SELECT * FROM prestador_datos WHERE organismo_area_id='" . $row->id_prestador . "'";
					$rsPD = $this->mysqli->query($sql);
					$rowPD = $rsPD->fetch_object();
					
					$sql = "INSERT cronograma_mensual SET id_prestador='" . $rowPD->sig_mensual . "', fecha='" . $fecha_desde . "'";
					$this->mysqli->query($sql);
				}
				
			} while ($sig_mensual == "NULL");
			
			
			$sql = "SELECT * FROM prestador_datos WHERE sig_mensual=" . $sig_mensual;
			$rs = $this->mysqli->query($sql);
			if ($rs->num_rows > 0) {
				$row = $rs->fetch_object();
			
				$sql = "UPDATE prestador_datos SET sig_mensual='" . $organismo_area_id . "' WHERE organismo_area_id='" . $row->organismo_area_id . "'";
				$this->mysqli->query($sql);
			}
		}
		
		
		
	
		
		
		$sql = "INSERT _organismos_areas SET organismo_area='" . $p->model->denominacion . "', organismo_area_id='" . $organismo_area_id . "', organismo_area_estado='3', organismo_area_tipo_id='E', organismo_id='PP', publico='N'";
		$this->mysqli->query($sql);
		
		
		$set = $this->prepararCampos($p->model, "prestador_datos");
		
		$sql = "INSERT prestador_datos SET " . $set . ", sig_semanal=" . $sig_semanal . ", sig_mensual=" . $sig_mensual;
		$this->mysqli->query($sql);

	} else {
		
		$sql = "UPDATE _organismos_areas SET organismo_area='" . $p->model->denominacion . "' WHERE organismo_area_id='" . $organismo_area_id . "'";
		$this->mysqli->query($sql);
		
		
		$set = $this->prepararCampos($p->model, "prestador_datos");
		
		$sql = "INSERT prestador_datos SET " . $set . " ON DUPLICATE KEY UPDATE " . $set;
		$this->mysqli->query($sql);
	}
	
	$this->mysqli->query("COMMIT");
	
	return $organismo_area_id;
  }
	
	
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

  
  
  public function method_leer_prestador_prestacion($params, $error) {
  	$p = $params[0];
  	
  	$opciones = new stdClass;
  	$opciones->valor = "float";
  	
  	$sql = "SELECT";
  	$sql.= "  prestaciones.*";
  	$sql.= ", prestadores_prestaciones.id_prestador_prestacion";
  	$sql.= ", prestadores_prestaciones.estado";
  	$sql.= " FROM prestadores_prestaciones INNER JOIN prestaciones USING(id_prestacion)";
  	$sql.= " WHERE id_prestador='" . $p->id_prestador . "'";
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
		$sql = "SELECT persona_id AS model, CONCAT(persona_dni, ' - ', persona_nombre) AS label FROM _personas WHERE persona_dni LIKE '". $p->texto . "%' ORDER BY label";
	} else {
		$sql = "SELECT persona_id AS model, CONCAT(TRIM(persona_nombre), ' (', persona_dni, ')') AS label FROM _personas WHERE persona_nombre LIKE '%". $p->texto . "%' ORDER BY label";
	}

	return $this->toJson($sql);
  }
  
  
  public function method_autocompletarPrestador($params, $error) {
  	$p = $params[0];
  	
  	$resultado = array();

  	
  	$sql = "SELECT organismo_area_id AS model, organismo_area AS label, organismo_area AS denominacion, prestador_datos.* FROM _organismos_areas LEFT JOIN prestador_datos USING(organismo_area_id) WHERE organismo_area_estado='3' AND organismo_area LIKE '%". $p->texto . "%' ORDER BY organismo_area";
	$rs = $this->mysqli->query($sql);
	while ($row = $rs->fetch_object()) {
		$row->semanal_descrip = "";
		$row->mensual_descrip = "";
		
		if (is_null($row->organismo_area_id)) {
			$row->organismo_area_id = $row->model;
			$row->cuit = "";
			$row->domicilio = "";
			$row->telefonos = "";
			$row->contacto = "";
			$row->observaciones = "";
			$row->cronograma_semanal = 0;
			$row->cronograma_mensual = 0;
		}
		
		$row->cronograma_semanal = (bool) $row->cronograma_semanal;
		$row->cronograma_mensual = (bool) $row->cronograma_mensual;
		
		if (! empty($row->sig_semanal)) {
			$sql = "SELECT organismo_area FROM _organismos_areas WHERE organismo_area_id='" . $row->sig_semanal . "'";
			$rsAux = $this->mysqli->query($sql);
			$rowAux = $rsAux->fetch_object();
			
			$row->semanal_descrip = $rowAux->organismo_area;
		}
		
		if (! empty($row->sig_mensual)) {
			$sql = "SELECT organismo_area FROM _organismos_areas WHERE organismo_area_id='" . $row->sig_mensual . "'";
			$rsAux = $this->mysqli->query($sql);
			$rowAux = $rsAux->fetch_object();
			
			$row->mensual_descrip = $rowAux->organismo_area;
		}
		
		$resultado[] = $row;
	}
	
	return $resultado;
  }
  
  
  public function method_autocompletarPrestacion($params, $error) {
  	$p = $params[0];
  	
  	$opciones = new stdClass;
  	$opciones->valor = "float";
  	
  	if (is_numeric($p->texto)) {
  		$sql = "SELECT prestaciones.*, id_prestacion AS model, CONCAT(prestaciones.codigo, ', ', prestaciones.denominacion, ' (', prestaciones_tipo.denominacion, ')') AS label FROM prestaciones INNER JOIN prestaciones_tipo USING(id_prestacion_tipo) WHERE prestaciones.codigo LIKE'%". $p->texto . "%'";
  	} else {
  		$sql = "SELECT prestaciones.*, id_prestacion AS model, CONCAT(prestaciones.denominacion, ', ', prestaciones.codigo, ' (', prestaciones_tipo.denominacion, ')') AS label FROM prestaciones INNER JOIN prestaciones_tipo USING(id_prestacion_tipo) WHERE prestaciones.denominacion LIKE'%". $p->texto . "%'";
  		if (! is_null($p->phpParametros)) $sql.= " AND id_prestacion_tipo=" . $p->phpParametros->id_prestacion_tipo;  		
  	}
  	
  	$sql.= " ORDER BY label";


	return $this->toJson($sql, $opciones);
  }
  
  
  public function method_autocompletarPersonal($params, $error) {
	$p = $params[0];

	$sql = "SELECT id_personal AS model, TRIM(apenom) AS label FROM _personal WHERE apenom LIKE '%". $p->texto . "%' ORDER BY label";

	return $this->toJson($sql);
  }
  
  
  public function method_escribir_contrasena($params, $error) {
  	$p = $params[0];
  	
	$sql = "SELECT * FROM _usuarios WHERE SYSusuario='" . $p->model->usuario . "' AND SYSpassword=MD5('" . $p->model->password . "')";
	$rs = $this->mysqli->query($sql);
	if ($rs->num_rows > 0) {
  		$sql = "UPDATE _usuarios SET SYSpassword=MD5('" . $p->model->passnueva . "') WHERE SYSusuario='" . $p->model->usuario . "'";
  		$this->mysqli->query($sql);
	} else {
		$error->SetError(0, "password");
		return $error;
	}
  }
  
  
  public function generateRandomString($length = 10) {
	return substr(str_shuffle("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, $length);
  }
}

?>