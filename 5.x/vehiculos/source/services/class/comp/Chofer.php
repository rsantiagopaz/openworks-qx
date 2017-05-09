<?php
session_start();

require("Base.php");

class class_Chofer extends class_Base
{
  

  public function method_alta_modifica_chofer($params, $error) {
  	$p = $params[0];
  	
  	$sql = "SELECT dni FROM _personal WHERE dni='" . $p->model->dni . "'";
  	$rs = mysql_query($sql);
  	if (mysql_num_rows($rs) == 0) {
  		$error->SetError(0, "personal");
  		return $error;
  	}
  	
  	$sql = "SELECT id_chofer FROM chofer WHERE dni='" . $p->model->dni . "' AND id_chofer <> " . $p->model->id_chofer;
  	$rs = mysql_query($sql);
  	if (mysql_num_rows($rs) > 0) {
  		$error->SetError(0, "dni");
  		return $error;
  	}

  	$sql = "SELECT id_chofer FROM chofer WHERE apenom='" . $p->model->apenom . "' AND id_chofer <> " . $p->model->id_chofer;
  	$rs = mysql_query($sql);
  	if (mysql_num_rows($rs) > 0) {
  		$error->SetError(0, "apenom");
  		return $error;
  	}
  	

	$set = $this->prepararCampos($p->model, "chofer");
		
	if ($p->model->id_chofer == "0") {
		$sql = "INSERT chofer SET " . $set . ", id_parque=" . $_SESSION['parque']->id_parque . ", f_inscripcion=NOW()";
		mysql_query($sql);		
	} else {
		$sql = "UPDATE chofer SET " . $set . " WHERE id_chofer=" . $p->model->id_chofer;
		mysql_query($sql);
	}
  }
  
  
  public function method_alta_modifica_incidente($params, $error) {
  	$p = $params[0];
  	
  	$p->model->id_usuario = $_SESSION['usuario'];
  	
	$set = $this->prepararCampos($p->model, "incidente");
		
	if ($p->model->id_incidente == "0") {
		$sql = "INSERT incidente SET " . $set;
		mysql_query($sql);		
	} else {
		$sql = "UPDATE incidente SET " . $set . " WHERE id_incidente=" . $p->model->id_incidente;
		mysql_query($sql);
	}
  }
  
  
  public function method_leer_incidentes($params, $error) {
  	$p = $params[0];
  	
	$sql = "SELECT incidente.*, tipo_incidente.descrip AS tipo_incidente_descrip FROM incidente INNER JOIN tipo_incidente USING(id_tipo_incidente) WHERE id_chofer=" . $p->id_chofer . " ORDER BY fecha DESC";
	return $this->toJson($sql);
  }
  
  
  public function method_leer_tipo_incidente($params, $error) {
	$sql = "SELECT * FROM tipo_incidente ORDER BY descrip";
	return $this->toJson($sql);
  }
  
  
  public function method_autocompletarChofer($params, $error) {
  	$p = $params[0];
  	
  	if (is_numeric($p->texto)) {
  		$sql = "SELECT id_chofer AS model, CONCAT(dni, ' - ', apenom) AS label FROM chofer WHERE id_parque=" . $_SESSION['parque']->id_parque . " AND dni LIKE '%" . $p->texto . "%' ORDER BY label";
  	} else {
  		$sql = "SELECT id_chofer AS model, CONCAT(apenom, ' - ', dni) AS label FROM chofer WHERE id_parque=" . $_SESSION['parque']->id_parque . " AND apenom LIKE '%" . $p->texto . "%' ORDER BY label";
  	}
  	
	return $this->toJson($sql);
  }
  
  
  public function method_autocompletarChoferCompleto($params, $error) {
  	$p = $params[0];
  	
  	if (is_numeric($p->texto)) {
  		$sql = "SELECT id_chofer AS model, CONCAT(dni, ' - ', apenom) AS label, chofer.* FROM chofer WHERE id_parque=" . $_SESSION['parque']->id_parque . " AND dni LIKE '%" . $p->texto . "%' ORDER BY label";
  	} else {
  		$sql = "SELECT id_chofer AS model, CONCAT(apenom, ' - ', dni) AS label, chofer.* FROM chofer WHERE id_parque=" . $_SESSION['parque']->id_parque . " AND apenom LIKE '%" . $p->texto . "%' ORDER BY label";
  	}
  	
	function functionAux(&$row, $key) {
		$resultado = new stdClass;
		
		$resultado->model = $row->model;
		$resultado->label = $row->label;
		
		unset($row->model);
		unset($row->label);
		
		$resultado->chofer = $row;

		
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
	
	return $this->toJson($sql, $opciones);
  }
}

?>