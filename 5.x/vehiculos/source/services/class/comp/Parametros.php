<?php
session_start();

require("Base.php");

class class_Parametros extends class_Base
{
  function __construct() {
    parent::__construct();
  }
  
  
  public function method_editar_parametro($params, $error) {
  	$p = $params[0];
  	
  	$sql = "SELECT id_" . $p->tabla . " FROM " . $p->tabla . " WHERE UPPER(descrip)='" . strtoupper($p->model->descrip) . "' AND id_" . $p->tabla . " <> " . $p->model->{"id_" . $p->tabla};
  	$rs = mysql_query($sql);
  	if (mysql_num_rows($rs) > 0) {
  		$error->SetError(0, "duplicado");
  		return $error;
  	} else {
  		$insert_id = $p->model->{"id_" . $p->tabla};
  		
  		if ($insert_id == "0") {
  			$sql = "INSERT " . $p->tabla . " SET descrip='" . $p->model->descrip . "'";
  			mysql_query($sql);
  			$insert_id = mysql_insert_id();
  		} else {
			$sql = "UPDATE " . $p->tabla . " SET descrip='" . $p->model->descrip . "' WHERE id_" . $p->tabla . "=" . $p->model->{"id_" . $p->tabla};
			mysql_query($sql);
  		}
  		
  		return $insert_id;
  	}
  }
  
  
  public function method_agregar_parametro($params, $error) {
  	$p = $params[0];
  	
  	mysql_query("START TRANSACTION");
  	
	$sql = "INSERT " . $p->tabla . " SET descrip=''";
	mysql_query($sql);
	$insert_id = mysql_insert_id();
	
	$sql = "UPDATE " . $p->tabla . " SET descrip='Nuevo (" . $insert_id . ")' WHERE id_" . $p->tabla . "=" . $insert_id;
	mysql_query($sql);
	
	mysql_query("COMMIT");
	
	return $insert_id;
  }
  
  
  public function method_leer_parametro($params, $error) {
  	$p = $params[0];

	$sql = "SELECT * FROM " . $p->tabla . " ORDER BY descrip";
	return $this->toJson(mysql_query($sql));
  }
  
  
  public function method_autocompletarTipoReparacion($params, $error) {
  	$p = $params[0];
  	
	$sql = "SELECT descrip AS label, id_tipo_reparacion AS model FROM tipo_reparacion WHERE descrip LIKE '%" . $p->texto . "%' ORDER BY label";
	return $this->toJson(mysql_query($sql));
  }
  
  
  public function method_autocompletarTaller($params, $error) {
  	$p = $params[0];
  	
	if (is_numeric($p->texto)) {
		$sql = "SELECT";
		$sql.= "  razones_sociales.cod_razon_social AS model";
		$sql.= ", CONCAT(proveedores.cuit, ' (', razones_sociales.razon_social, ')') AS label";
		$sql.= ", proveedores.cuit";
		$sql.= ", razones_sociales.razon_social";
		$sql.= " FROM (`019`.proveedores INNER JOIN `019`.razones_sociales USING(cod_proveedor)) INNER JOIN taller USING(cod_razon_social)";
		$sql.= " WHERE proveedores.cuit LIKE '" . $p->texto . "%'";
		$sql.= " ORDER BY label";
	} else {
		$sql = "SELECT * FROM (";
			$sql.= "(";
				$sql.= "SELECT";
				$sql.= "  razones_sociales.cod_razon_social AS model";
				$sql.= ", CONCAT(razones_sociales.razon_social, ' (', proveedores.cuit, ')') AS label";
				$sql.= ", proveedores.cuit";
				$sql.= ", razones_sociales.razon_social";
				$sql.= " FROM (`019`.proveedores INNER JOIN `019`.razones_sociales USING(cod_proveedor)) INNER JOIN taller USING(cod_razon_social)";
			$sql.= ") UNION (";
				$sql.= "SELECT";
				$sql.= "  0 AS model";
				$sql.= ", 'Parque Automotor' AS label";
				$sql.= ", '' AS cuit";
				$sql.= ", 'Parque Automotor' AS razon_social";
			$sql.= ")";
		$sql.= ") AS temporal";
		$sql.= " WHERE razon_social LIKE '%" . $p->texto . "%'";
		$sql.= " ORDER BY label";
	}
	
	return $this->toJson(mysql_query($sql));
  }
  
  
  public function method_autocompletarRazonSocial($params, $error) {
  	$p = $params[0];
  	
	if (is_numeric($p->texto)) {
		$sql = "SELECT";
		$sql.= "  razones_sociales.cod_razon_social AS model";
		$sql.= ", CONCAT(proveedores.cuit, ' (', razones_sociales.razon_social, ')') AS label";
		$sql.= ", proveedores.cuit";
		$sql.= ", razones_sociales.razon_social";
		$sql.= " FROM `019`.proveedores INNER JOIN `019`.razones_sociales USING(cod_proveedor)";
		$sql.= " WHERE proveedores.cuit LIKE '" . $p->texto . "%'";
		$sql.= " ORDER BY label";
	} else {
		$sql = "SELECT";
		$sql.= "  razones_sociales.cod_razon_social AS model";
		$sql.= ", CONCAT(razones_sociales.razon_social, ' (', proveedores.cuit, ')') AS label";
		$sql.= ", proveedores.cuit";
		$sql.= ", razones_sociales.razon_social";
		$sql.= " FROM `019`.proveedores INNER JOIN `019`.razones_sociales USING(cod_proveedor)";
		$sql.= " WHERE razones_sociales.razon_social LIKE '%" . $p->texto . "%'";
		$sql.= " ORDER BY label";
	}
	
	return $this->toJson($sql);
  }
  
  
  public function method_leer_taller($params, $error) {
	$sql = "SELECT";
	$sql.= "  cod_razon_social";
	$sql.= ", CONCAT(razones_sociales.razon_social, ' (', proveedores.cuit, ')') AS descrip";
	$sql.= " FROM (taller INNER JOIN `019`.razones_sociales USING(cod_razon_social)) INNER JOIN `019`.proveedores USING(cod_proveedor)";
	$sql.= " ORDER BY descrip";
	
	return $this->toJson($sql);
  }
  
  
  public function method_agregar_taller($params, $error) {
  	$p = $params[0];
  	
	$sql = "INSERT taller SET cod_razon_social=" . $p->cod_razon_social;
	mysql_query($sql);
  }
  
  
  public function method_agregar_parque($params, $error) {
  	$p = $params[0];
  	
	$sql = "INSERT parque SET descrip='" . $p->descrip . "', organismo_area_id='" . $p->organismo_area_id . "'";
	mysql_query($sql);
	$insert_id = mysql_insert_id();
	
	return $insert_id;
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
  	
	$sql = "SELECT * FROM parque ORDER BY descrip";
	
	return $this->toJson($sql, $opciones);
  }
}

?>