<?php
session_start();

require("Base.php");

class class_Vehiculo extends class_Base
{
  function __construct() {
    parent::__construct();
  }
  
  
  public function calcular_estados($id_movimiento = null, $id_entsal = null) {
  	if (is_null($id_entsal)) {
	  	$sql = "SELECT id_entsal FROM movimiento WHERE id_movimiento=" . $id_movimiento . " LIMIT 1";
	  	$rs = mysql_query($sql);
	  	$row = mysql_fetch_object($rs);
	  	
	  	$id_entsal = $row->id_entsal;
	}
  	
  	$sql = "SELECT id_vehiculo, estado FROM entsal WHERE id_entsal=" . $id_entsal;
  	$rs = mysql_query($sql);
  	$row = mysql_fetch_object($rs);
  	$id_vehiculo = $row->id_vehiculo;
  	$estado = $row->estado;
  	
	if ($estado != "S" && $estado != "A") {
  		$sql = "SELECT id_movimiento FROM movimiento WHERE id_entsal=" . $id_entsal . " AND estado='E'";
  		$rs = mysql_query($sql);
		$estado = ((mysql_num_rows($rs) > 0) ? "T" : "E");
  	}
  	
  	$sql = "SELECT id_movimiento FROM movimiento WHERE id_entsal=" . $id_entsal . " AND estado<>'A' AND ISNULL(documentacion_id)";
  	$rs = mysql_query($sql);
  	$asunto = ((mysql_num_rows($rs) > 0) ? "TRUE" : "FALSE");
  	
  	$sql = "SELECT id_movimiento FROM movimiento WHERE id_entsal=" . $id_entsal . " AND estado='D'";
  	$rs = mysql_query($sql);
  	$diferido = ((mysql_num_rows($rs) > 0) ? "TRUE" : "FALSE");
  	
  	$sql = "UPDATE entsal SET estado='" . $estado . "', asunto=" . $asunto . ", diferido=" . $diferido . " WHERE id_entsal=" . $id_entsal;
  	mysql_query($sql);
  	

  	if ($estado == "A") $estado = "S";
  	$sql = "UPDATE vehiculo SET estado='" . $estado . "' WHERE id_vehiculo=" . $id_vehiculo;
  	mysql_query($sql);
  }
  
  
  public function calcular_totales($id_movimiento = null, $id_entsal = null) {
  	
  	if (is_null($id_entsal)) {
	  	$sql = "SELECT id_entsal FROM movimiento WHERE id_movimiento=" . $id_movimiento . " LIMIT 1";
	  	$rs = mysql_query($sql);
	  	$row = mysql_fetch_object($rs);
	  	
	  	$id_entsal = $row->id_entsal;
	}
  	
  	if (! is_null($id_movimiento)) {
	  	$sql = "SELECT id_movimiento, SUM(total) AS total FROM reparacion WHERE id_movimiento=" . $id_movimiento . " GROUP BY id_movimiento";
	  	$rs = mysql_query($sql);
	  	$row = mysql_fetch_object($rs);
	  	
	  	$sql = "UPDATE movimiento SET total=" . $row->total . " WHERE id_movimiento=" . $id_movimiento;
	  	mysql_query($sql);
  	}

  	
  	$sql = "SELECT id_entsal, SUM(total) AS total FROM movimiento WHERE id_entsal=" . $id_entsal . " GROUP BY id_entsal";
  	$rs = mysql_query($sql);
  	$row = mysql_fetch_object($rs);
  	
  	$sql = "UPDATE entsal SET total=" . $row->total . " WHERE id_entsal=" . $id_entsal;
  	mysql_query($sql);
  	
  	

  	
  	
  	$sql = "SELECT id_vehiculo FROM entsal WHERE id_entsal=" . $id_entsal . " LIMIT 1";
  	$rs = mysql_query($sql);
  	$row = mysql_fetch_object($rs);
  	
  	$id_vehiculo = $row->id_vehiculo;
  	
  	$sql = "SELECT id_vehiculo, SUM(total) AS total FROM entsal WHERE id_vehiculo=" . $id_vehiculo . " GROUP BY id_vehiculo";
  	$rs = mysql_query($sql);
  	$row = mysql_fetch_object($rs);
  	
  	$sql = "UPDATE vehiculo SET total=" . $row->total . " WHERE id_vehiculo=" . $id_vehiculo;
  	mysql_query($sql);
  }
  
  
  public function method_leer_reparacion($params, $error) {
  	$p = $params[0];

  	$opciones = new stdClass;
  	$opciones->costo = "float";
  	$opciones->cantidad = "int";
  	$opciones->total = "float";
  	
	$sql = "SELECT reparacion.*, tipo_reparacion.descrip AS reparacion FROM reparacion INNER JOIN tipo_reparacion USING(id_tipo_reparacion) WHERE id_movimiento=" . $p->id_movimiento;
	
	return $this->toJson($sql, $opciones);
  }
  
  
  public function method_salida_taller($params, $error) {
  	$p = $params[0];
  	
  	$sql = "SELECT estado FROM movimiento WHERE id_movimiento=" . $p->id_movimiento;
  	$rs = mysql_query($sql);
  	$rowMovimiento = mysql_fetch_object($rs);
  	
  	if ($rowMovimiento->estado == $p->movimiento_estado) {
  		mysql_query("START TRANSACTION");
  		
	  	$sql = "UPDATE movimiento SET f_sal=NOW(), id_usuario_sal='" . $_SESSION['usuario'] . "', kilo=" . $p->kilo . ", estado='S' WHERE id_movimiento=" . $p->id_movimiento;
	  	mysql_query($sql);
	  	
  		$sql = "DELETE FROM reparacion WHERE id_movimiento=" . $p->id_movimiento;
  		mysql_query($sql);
	  	
	  	foreach ($p->model as $item) {
	  		$set = $this->prepararCampos($item, "reparacion");
	  		
	  		$sql = "INSERT reparacion SET " . $set;
	  		mysql_query($sql);  		
	  	}
	  	
	  	$this->calcular_totales($p->id_movimiento);
	  	$this->calcular_estados($p->id_movimiento);
	  	
	  	mysql_query("COMMIT");
  	} else {
		$error->SetError(0, "estado");
		return $error;
  	}
  }
  
  
  public function method_diferir_salida_taller($params, $error) {
  	$p = $params[0];
  	
  	$sql = "SELECT estado FROM movimiento WHERE id_movimiento=" . $p->id_movimiento;
  	$rs = mysql_query($sql);
  	$rowMovimiento = mysql_fetch_object($rs);
  	
  	if ($rowMovimiento->estado == $p->movimiento_estado) {
	  	mysql_query("START TRANSACTION");
	  	
	  	$sql = "UPDATE movimiento SET f_sal=NOW(), id_usuario_sal='" . $_SESSION['usuario'] . "', estado='D' WHERE id_movimiento=" . $p->id_movimiento;
	  	mysql_query($sql);
	  	
	  	$this->calcular_estados($p->id_movimiento);
	  	
	  	mysql_query("COMMIT");
  	} else {
		$error->SetError(0, "estado");
		return $error;
  	}
  }

  
  public function method_entrada_taller($params, $error) {
	$p = $params[0];
	
  	$sql = "SELECT estado FROM entsal WHERE id_entsal=" . $p->id_entsal;
  	$rs = mysql_query($sql);
  	$rowEntsal = mysql_fetch_object($rs);
  	
  	if ($rowEntsal->estado == $p->entsal_estado) {
		mysql_query("START TRANSACTION");
	
		$sql = "INSERT movimiento SET id_entsal=" . $p->id_entsal . ", cod_razon_social=" . $p->cod_razon_social . ", observa='" . $p->observa . "', f_ent=NOW(), id_usuario_ent='" . $_SESSION['usuario'] . "', estado='E'";
		mysql_query($sql);
		$insert_id = mysql_insert_id();
	
		$this->calcular_estados($insert_id);
	
		mysql_query("COMMIT");
	
		return $insert_id;
  	} else {
		$error->SetError(0, "estado");
		return $error;
  	}
  }
  
  
  public function method_anular_entrada_taller($params, $error) {
  	$p = $params[0];
  	
  	$sql = "SELECT estado FROM movimiento WHERE id_movimiento=" . $p->id_movimiento;
  	$rs = mysql_query($sql);
  	$rowMovimiento = mysql_fetch_object($rs);
  	
  	if ($rowMovimiento->estado == $p->movimiento_estado) {
	  	mysql_query("START TRANSACTION");
	  	
	  	$sql = "UPDATE movimiento SET f_sal=NOW(), id_usuario_sal='" . $_SESSION['usuario'] . "', total=0, estado='A' WHERE id_movimiento=" . $p->id_movimiento;
	  	mysql_query($sql);
	  	
	  	$this->calcular_totales($p->id_movimiento);
	  	$this->calcular_estados($p->id_movimiento);
	  	
	  	mysql_query("COMMIT");
  	} else {
		$error->SetError(0, "estado");
		return $error;
  	}
  }
  
  
  public function method_leer_movimiento($params, $error) {
  	$p = $params[0];
  	
	function functionAux1(&$row, $key) {
		$row->kilo = (float) $row->kilo;
		$row->total = (float) $row->total;
		
		if ($row->estado == "D") $row->total = "Diferido";
		if ($row->estado == "A") $row->total = "Anulado";
		
		$row->bandera_estado = ($row->estado == "A") ? -1 : 0;
	};
  	
  	$opciones = new stdClass;
  	$opciones->functionAux = functionAux1;
	
	
	$sql = "SELECT * FROM (";
	$sql.= "(SELECT movimiento.*, razones_sociales.razon_social AS taller FROM movimiento INNER JOIN `019`.razones_sociales USING(cod_razon_social))";
	$sql.= " UNION ALL";
	$sql.= "(SELECT movimiento.*, temporal_1.razon_social AS taller FROM movimiento INNER JOIN ";
		$sql.= "(";
		$sql.= "SELECT";
		$sql.= "  0 AS cod_razon_social";
		$sql.= ", 'Parque Automotor' AS razon_social";
		$sql.= ") AS temporal_1";
	$sql.= " USING(cod_razon_social))";
	$sql.= ") AS temporal_2";
	$sql.= " WHERE id_entsal=" . $p->id_entsal;
	$sql.= " ORDER BY f_ent DESC";
	
	return $this->toJson($sql, $opciones);
  }
  
  
  public function method_entrada_vehiculo($params, $error) {
  	$p = $params[0];
  	
  	$sql = "SELECT estado FROM vehiculo WHERE id_vehiculo=" . $p->id_vehiculo;
  	$rs = mysql_query($sql);
  	$rowVehiculo = mysql_fetch_object($rs);
  	
  	if ($rowVehiculo->estado == $p->vehiculo_estado) {
	  	mysql_query("START TRANSACTION");
	  	
	  	$sql = "UPDATE vehiculo SET estado='E' WHERE id_vehiculo=" . $p->id_vehiculo;
	  	mysql_query($sql);
	  	
	  	$sql = "INSERT entsal SET id_vehiculo=" . $p->id_vehiculo . ", observa='" . $p->observa . "', f_ent=NOW(), id_usuario_ent='" . $_SESSION['usuario'] . "', resp_ent='" . $p->resp_ent . "', kilo=" . $p->kilo . ", cod_up=" . $p->cod_up . ", asunto=FALSE, diferido=FALSE, estado='E'";
	  	mysql_query($sql);
	  	$insert_id = mysql_insert_id();
	  	
	  	mysql_query("COMMIT");
	  	
	  	return $insert_id;
  	} else {
		$error->SetError(0, "estado");
		return $error;
  	}
  }
  
  
  public function method_anular_entrada_vehiculo($params, $error) {
  	$p = $params[0];
  	
  	$sql = "SELECT estado FROM entsal WHERE id_entsal=" . $p->id_entsal;
  	$rs = mysql_query($sql);
  	$rowEntsal = mysql_fetch_object($rs);
  	
	if ($rowEntsal->estado == $p->entsal_estado) {
		$fecha = date("Y-m-d H:i:s");

		mysql_query("START TRANSACTION");

		$sql = "UPDATE entsal SET f_sal='" . $fecha . "', id_usuario_sal='" . $_SESSION['usuario'] . "', total=0, estado='A' WHERE id_entsal=" . $p->id_entsal;
		mysql_query($sql);

		$sql = "UPDATE movimiento SET f_sal='" . $fecha . "', id_usuario_sal='" . $_SESSION['usuario'] . "', total=0, estado='A' WHERE id_entsal=" . $p->id_entsal . " AND estado<>'A'";
		mysql_query($sql);

		$this->calcular_totales(null, $p->id_entsal);
		$this->calcular_estados(null, $p->id_entsal);

		mysql_query("COMMIT");
	} else {
		$error->SetError(0, "estado");
		return $error;
	}
  }
  
  
  public function method_salida_vehiculo($params, $error) {
  	$p = $params[0];
  	
  	$sql = "SELECT estado FROM entsal WHERE id_entsal=" . $p->id_entsal;
  	$rs = mysql_query($sql);
  	$rowEntsal = mysql_fetch_object($rs);
  	
  	if ($rowEntsal->estado == $p->entsal_estado) {
	  	mysql_query("START TRANSACTION");
	  	
	  	$sql = "UPDATE vehiculo SET estado='S' WHERE id_vehiculo=" . $p->id_vehiculo;
	  	mysql_query($sql);
	
	  	$sql = "UPDATE entsal SET cod_up='" . $p->cod_up . "', f_sal=NOW(), id_usuario_sal='" . $_SESSION['usuario'] . "', resp_sal='" . $p->resp_sal . "', estado='S' WHERE id_entsal=" . $p->id_entsal;
	  	mysql_query($sql);
	  	
	  	mysql_query("COMMIT");
  	} else {
		$error->SetError(0, "estado");
		return $error;
  	}
  }
  
  
  public function method_leer_vehiculo($params, $error) {
  	$p = $params[0];
  	
  	$resultado = new stdClass;
  	
	function functionAux1(&$row, $key) {
		$row->total = (float) $row->total;
		
		$sql = "SELECT";
		$sql.= "  CONCAT(_organismos_areas.organismo_area, ' (', CASE WHEN _organismos_areas.organismo_area_tipo_id='E' THEN _departamentos.departamento ELSE _organismos.organismo END, ')') AS label";
		$sql.= " FROM (salud1._organismos_areas INNER JOIN salud1._organismos USING(organismo_id)) LEFT JOIN salud1._departamentos ON _organismos_areas.organismo_areas_id_departamento=_departamentos.codigo_indec";
		$sql.= " WHERE _organismos_areas.organismo_area_id='" . $row->organismo_area_id . "'";
		
		$rsDependencia = mysql_query($sql);
		if (mysql_num_rows($rsDependencia) > 0) {
			$rowDependencia = mysql_fetch_object($rsDependencia);
			$row->dependencia = $rowDependencia->label;
		} else {
			$row->dependencia = "";
		}
	};
  	
  	$opciones = new stdClass;
  	$opciones->functionAux = functionAux1;
  	
  	$sql = "SELECT vehiculo.*, tipo_vehiculo.descrip AS tipo FROM vehiculo INNER JOIN tipo_vehiculo USING(id_tipo_vehiculo) WHERE id_vehiculo=" . $p->id_vehiculo;
  	$resultado = $this->toJson($sql, $opciones);
  	$resultado = $resultado[0];

	return $resultado;
  }
  
  
  public function method_leer_entsal($params, $error) {
  	$p = $params[0];
  	
	function functionAux1(&$row, $key) {
		$row->kilo = (float) $row->kilo;
		$row->total = (float) $row->total;
		
		if ($row->estado == "A") $row->total = "Anulado";
		
		$row->bandera_estado = ($row->estado == "A") ? -1 : 0;
	};
  	
  	$opciones = new stdClass;
  	$opciones->functionAux = functionAux1;
  	
	$sql = "SELECT entsal.*, CONCAT(unipresu.nombre, ' - ', REPLACE(unipresu.codigo, '-', '')) AS unipresu FROM entsal LEFT JOIN unipresu USING(cod_up) WHERE id_vehiculo=" . $p->id_vehiculo . " ORDER BY f_ent DESC";
	
	return $this->toJson($sql, $opciones);
  }
  
  
  public function method_alta_modifica_vehiculo($params, $error) {
  	$p = $params[0];
  	
  	$sql = "SELECT id_vehiculo FROM vehiculo WHERE nro_patente='" . $p->model->nro_patente . "' AND id_vehiculo <> " . $p->model->id_vehiculo;
  	$rs = mysql_query($sql);
  	if (mysql_num_rows($rs) > 0) {
  		$error->SetError(0, "duplicado");
  		return $error;
  	} else {
		$set = $this->prepararCampos($p->model, "vehiculo");
	  		
		if ($p->model->id_vehiculo == "0") {
	  		$sql = "INSERT vehiculo SET " . $set . ", id_parque=" . $_SESSION['parque']->id_parque . ", total=0, estado='S'";
	  		mysql_query($sql);		
		} else {
	  		$sql = "UPDATE vehiculo SET " . $set . " WHERE id_vehiculo=" . $p->model->id_vehiculo;
	  		mysql_query($sql);
		}
  	}
  }
  
  
  public function method_leer_gral($params, $error) {
  	$p = $params[0];
  	
  	$resultado = new stdClass;
  	$resultado->gral = array();
  	
  	$ent = 0;
  	$tal = 0;
  	$asu = 0;
  	$dif = 0;
 	
	$sql = "SELECT id_entsal, organismo_area_id, nro_patente, CONCAT(nro_patente, '  ', marca) AS vehiculo, f_ent, f_sal, asunto, entsal.estado, entsal.diferido FROM entsal INNER JOIN vehiculo USING(id_vehiculo) WHERE vehiculo.id_parque=" . $_SESSION['parque']->id_parque . " AND (entsal.estado='E' OR entsal.estado='T' OR entsal.asunto OR entsal.diferido) ORDER BY f_ent DESC";
	$rs = mysql_query($sql);
	while ($row = mysql_fetch_object($rs)) {
		$row->asunto = (bool) $row->asunto;
		$row->diferido = (bool) $row->diferido;
		
		$sql = "SELECT";
		$sql.= "  CONCAT(_organismos_areas.organismo_area, ' (', CASE WHEN _organismos_areas.organismo_area_tipo_id='E' THEN _departamentos.departamento ELSE _organismos.organismo END, ')') AS label";
		$sql.= " FROM (salud1._organismos_areas INNER JOIN salud1._organismos USING(organismo_id)) LEFT JOIN salud1._departamentos ON _organismos_areas.organismo_areas_id_departamento=_departamentos.codigo_indec";
		$sql.= " WHERE _organismos_areas.organismo_area_id='" . $row->organismo_area_id . "'";
		
		$rsDependencia = mysql_query($sql);
		if (mysql_num_rows($rsDependencia) > 0) {
			$rowDependencia = mysql_fetch_object($rsDependencia);
			$row->dependencia = $rowDependencia->label;
		} else {
			$row->dependencia = "";
		}
		
		if ($row->estado == 'E') $ent+= 1;
		if ($row->estado == 'T') $tal+= 1;
		if ($row->asunto) $asu+= 1;
		if ($row->diferido) $dif+= 1;
		

		if ($p->ver == "Todos") {
			$resultado->gral[] = $row;
		} else if ($p->ver == "Entrada" && $row->estado == 'E') {
			$resultado->gral[] = $row;
		} else if ($p->ver == "Taller" && $row->estado == 'T') {
			$resultado->gral[] = $row;
		} else if ($p->ver == "Asunto" && $row->asunto) {
			$resultado->gral[] = $row;
		} else if ($p->ver == "Diferido" && $row->diferido) {
			$resultado->gral[] = $row;
		} else if (is_numeric($p->ver)) {
			$sql = "SELECT id_movimiento FROM movimiento WHERE id_entsal=" . $row->id_entsal . " AND estado <> 'A' AND cod_razon_social=" . $p->ver;
			$rsMovimiento = mysql_query($sql);
			if (mysql_num_rows($rsMovimiento) > 0) $resultado->gral[] = $row;
		}
	}
	
	$resultado->statusBarText = "Entrada: " . $ent . ", Taller: " . $tal . ", Asunto: " . $asu . ", Diferido: " . $dif;
	
	return $resultado;
  }
  
  
  public function method_leer_asunto($params, $error) {
  	$p = $params[0];

	$sql = "SELECT 001_documentaciones.*, 001_documentaciones_tipos.documentacion_tipo FROM salud1.001_documentaciones INNER JOIN salud1.001_documentaciones_tipos USING(documentacion_tipo_id) WHERE documentacion_id='" . $p->documentacion_id . "'";
	$rs = mysql_query($sql);
	if (mysql_num_rows($rs) == 0) {
  		$error->SetError(0, "documentacion_id");
  		return $error;
	} else {
		$row = mysql_fetch_object($rs);
		$documento = (($row->documentacion_tipo_id=="1") ? $row->expediente_numero . "-" . $row->expediente_codigo . "-" . $row->expediente_ano : $row->documentacion_numero . "/" . $row->documentacion_numero_ano);
		$documento = $row->documentacion_tipo . " Nro. " . $documento;
		$row->documento = $documento;
		
		return $row;
	}
  }
  
  
  public function method_asignar_asunto($params, $error) {
  	$p = $params[0];
  	
	$sql = "SELECT documentacion_id FROM movimiento WHERE id_movimiento=" . $p->id_movimiento;
  	$rs = mysql_query($sql);
  	$row = mysql_fetch_object($rs);
  	
  	if (is_null($row->documentacion_id)) {
		$sql = "SELECT documentacion_id FROM salud1.001_documentaciones WHERE documentacion_id='" . $p->documentacion_id . "'";
		$rs = mysql_query($sql);
		if (mysql_num_rows($rs) == 0) {
	  		$error->SetError(0, "documentacion_id");
	  		return $error;
		} else {
			mysql_query("START TRANSACTION");
			
			$sql = "UPDATE movimiento SET documentacion_id='" . $p->documentacion_id . "' WHERE id_movimiento=" . $p->id_movimiento;
			mysql_query($sql);
			
			$this->calcular_estados($p->id_movimiento);
			
			mysql_query("COMMIT");
		}
  	} else {
		$error->SetError(0, "estado");
		return $error;
  	}
  }
  
  
  public function method_leer_parque($params, $error) {
  	$p = $params[0];
  	
	function functionAux1(&$row, $key) {
		$sql = "SELECT";
		$sql.= "  CONCAT(_organismos_areas.organismo_area, ' (', CASE WHEN _organismos_areas.organismo_area_tipo_id='E' THEN _departamentos.departamento ELSE _organismos.organismo END, ')') AS label";
		$sql.= " FROM (salud1._organismos_areas INNER JOIN salud1._organismos USING(organismo_id)) LEFT JOIN salud1._departamentos ON _organismos_areas.organismo_areas_id_departamento=_departamentos.codigo_indec";
		$sql.= " WHERE _organismos_areas.organismo_area_id='" . $row->organismo_area_id . "'";
		
		$rsDependencia = mysql_query($sql);
		if (mysql_num_rows($rsDependencia) > 0) {
			$rowDependencia = mysql_fetch_object($rsDependencia);
			$row->dependencia = $rowDependencia->label;
		} else {
			$row->dependencia = "";
		}
	};
  	
  	$opciones = new stdClass;
  	$opciones->functionAux = functionAux1;
  	
	$sql = "SELECT * FROM parque WHERE organismo_area_id='" . $p->organismo_area_id . "'";
	$resultado = $this->toJson($sql, $opciones);
	$resultado = $resultado[0];
	
	$_SESSION['parque'] = $resultado;
	
	return $resultado;
  }
  
  
  public function method_autocompletarVehiculo($params, $error) {
  	$p = $params[0];
  	
	$sql = "SELECT CONCAT(nro_patente, '  ', marca) AS label, id_vehiculo AS model FROM vehiculo WHERE id_parque=" . $_SESSION['parque']->id_parque . " AND nro_patente LIKE '%" . $p->texto . "%' ORDER BY label";
	return $this->toJson($sql);
  }
  
  
  public function method_autocompletarVehiculoCompleto($params, $error) {
  	$p = $params[0];
  	
	function functionAux(&$row, $key) {
		unset($row->total);
		unset($row->estado);
		
		$resultado = new stdClass;
		
		$resultado->model = $row->id_vehiculo;
		$resultado->label = $row->nro_patente . "  " . $row->marca;
		
		$resultado->vehiculo = $row;

		
		$sql = "SELECT";
		$sql.= "  CONCAT(_organismos_areas.organismo_area, ' (', CASE WHEN _organismos_areas.organismo_area_tipo_id='E' THEN _departamentos.departamento ELSE _organismos.organismo END, ')') AS label";
		$sql.= "  , _organismos_areas.organismo_area_id AS model";
		$sql.= " FROM (salud1._organismos_areas INNER JOIN salud1._organismos USING(organismo_id)) LEFT JOIN salud1._departamentos ON _organismos_areas.organismo_areas_id_departamento=_departamentos.codigo_indec";
		$sql.= " WHERE _organismos_areas.organismo_area_id='" . $row->organismo_area_id . "'";
		
		$rsDependencia = mysql_query($sql);
		if (mysql_num_rows($rsDependencia) > 0) $resultado->cboDependencia = mysql_fetch_object($rsDependencia);

		return $resultado;
	};
  	
  	$opciones = new stdClass;
  	$opciones->functionAux = functionAux;
  	
	$sql = "SELECT * FROM vehiculo WHERE id_parque=" . $_SESSION['parque']->id_parque . " AND nro_patente LIKE '%" . $p->texto . "%' ORDER BY nro_patente, marca";
	return $this->toJson($sql, $opciones);
  }
  
  
  public function method_autocompletarTipo_vehiculo($params, $error) {
  	$p = $params[0];
  	
	$sql = "SELECT descrip AS label, id_tipo_vehiculo AS model FROM tipo_vehiculo WHERE descrip LIKE '%" . $p->texto . "%' ORDER BY label";
	return $this->toJson($sql);
  }
  
  
  public function method_autocompletarDependencia($params, $error) {
  	$p = $params[0];
  	
	$sql = " (SELECT _organismos_areas.organismo_area_id AS model, CONCAT(_organismos_areas.organismo_area, ' (', _departamentos.departamento, ')') AS label FROM salud1._organismos_areas INNER JOIN salud1._departamentos ON _organismos_areas.organismo_areas_id_departamento=_departamentos.codigo_indec WHERE _organismos_areas.organismo_area_tipo_id='E' AND _departamentos.provincia_id=21 AND _organismos_areas.organismo_area LIKE '%" . $p->texto . "%')";
	$sql.= " UNION DISTINCT";
	$sql.= " (SELECT _organismos_areas.organismo_area_id AS model, CONCAT(_organismos_areas.organismo_area, ' (', _organismos.organismo, ')') AS label FROM salud1._organismos_areas INNER JOIN salud1._organismos USING(organismo_id) WHERE _organismos_areas.organismo_area_tipo_id<>'E' AND (_organismos_areas.organismo_id='33' OR _organismos_areas.organismo_id='54') AND _organismos_areas.organismo_area LIKE '%" . $p->texto . "%')";
	$sql.= " ORDER BY label";
	return $this->toJson(mysql_query($sql));
  }
  
  
  public function method_autocompletarUnipresu($params, $error) {
  	$p = $params[0];
  	
  	if (is_int($p->texto)) {
  		$sql = "SELECT cod_up AS model, CONCAT(nombre, ' - ', REPLACE(codigo, '-', '')) AS label FROM unipresu WHERE cod_up=" . $p->texto;
  	} else if (is_numeric($p->texto)) {
  		$sql = "SELECT cod_up AS model, CONCAT(REPLACE(codigo, '-', ''), ' - ', nombre) AS label FROM unipresu WHERE version=0 AND estado='A' AND REPLACE(codigo, '-', '') LIKE '%" . $p->texto . "%'";
  	} else {
  		$sql = "SELECT cod_up AS model, CONCAT(nombre, ' - ', REPLACE(codigo, '-', '')) AS label FROM unipresu WHERE version=0 AND estado='A' AND nombre LIKE '%" . $p->texto . "%'";
  	}
	
	return $this->toJson($sql);
  }
}

?>