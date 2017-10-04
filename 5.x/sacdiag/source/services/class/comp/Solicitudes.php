<?php

session_start();

require("Base.php");

class class_Solicitudes extends class_Base
{


  public function method_leer_solicitud($params, $error) {
	$p = $params[0];
	
	$resultado = array();
	
	//$sql = "SELECT solicitudes.*, _personas.persona_nombre, _personas.persona_dni, efectores_publicos.denominacion AS efector_publico, prestadores.denominacion AS prestador FROM solicitudes INNER JOIN _personas USING(persona_id) INNER JOIN efectores_publicos USING(id_efector_publico) INNER JOIN prestadores USING(id_prestador) WHERE TRUE";
	$sql = "SELECT solicitudes.*, _personas.persona_nombre, _personas.persona_dni FROM solicitudes INNER JOIN _personas USING(persona_id) WHERE TRUE";
	
	if (! is_null($p->desde) && ! is_null($p->hasta)) {
		$sql.= " AND (fecha_emite BETWEEN '" . substr($p->desde, 0, 10) . "' AND '" . substr($p->hasta, 0, 10) . "')";
	} else if (! is_null($p->desde)) {
		$sql.= " AND fecha_emite >= '" . substr($p->desde, 0, 10) . "'";
	} else if (! is_null($p->hasta)) {
		$sql.= " AND fecha_emite <= '" . substr($p->hasta, 0, 10) . "'";
	}
	
	if (! is_null($p->id_prestador)) $sql.= " AND id_prestador='" . $p->id_prestador . "'";
	if (! is_null($p->persona_id)) $sql.= " AND persona_id='" . $p->persona_id . "'";
	if (! empty($p->estado)) $sql.= " AND estado='" . $p->estado . "'";
	
	$sql.= " ORDER BY fecha_emite DESC";
	
	$rs = $this->mysqli->query($sql);
	while ($row = $rs->fetch_object()) {
		$sql = "SELECT organismo_area_descripcion FROM _organismos_areas WHERE organismo_area_id='" . $row->id_efector_publico . "'";
		$rsAux = $this->mysqli->query($sql);
		$rowAux = $rsAux->fetch_object();
		$row->efector_publico = $rowAux->organismo_area_descripcion;
		
		$sql = "SELECT organismo_area_descripcion FROM _organismos_areas WHERE organismo_area_id='" . $row->id_prestador . "'";
		$rsAux = $this->mysqli->query($sql);
		$rowAux = $rsAux->fetch_object();
		$row->prestador = $rowAux->organismo_area_descripcion;
		
		$resultado[] = $row;
	}
	
	return $resultado;
  }
  
  
  public function method_leer_solicitudes_prestaciones($params, $error) {
	$p = $params[0];
	
  	$opciones = new stdClass;
  	$opciones->valor = "float";
	
	$sql = "SELECT";
	$sql.= "  solicitudes_prestaciones.*";
	$sql.= ", prestaciones.*";
	$sql.= ", prestaciones_tipo.denominacion AS prestacion_tipo";
	$sql.= " FROM solicitudes_prestaciones INNER JOIN prestaciones USING(id_prestacion) INNER JOIN prestaciones_tipo USING(id_prestacion_tipo)";
	$sql.= " WHERE solicitudes_prestaciones.id_solicitud=" . $p->id_solicitud;
	
	return $this->toJson($sql, $opciones);
  }
  
  
  public function method_escribir_solicitud($params, $error) {
	$p = $params[0];
	
	$set = $this->prepararCampos($p, "solicitudes");
	  		
	$sql = "UPDATE solicitudes SET " . $set . " WHERE id_solicitud=" . $p->id_solicitud;
	$this->mysqli->query($sql);
  }
}































?>