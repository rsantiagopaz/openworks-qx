<?php

session_start();

require("Base.php");

class class_Solicitudes extends class_Base
{


  public function method_leer_solicitud($params, $error) {
	$p = $params[0];
	
	$sql = "SELECT solicitudes.*, personas.persona_nombre, personas.persona_dni, efectores_publicos.denominacion AS efector_publico, prestadores.denominacion AS prestador FROM solicitudes INNER JOIN personas USING(persona_id) INNER JOIN efectores_publicos USING(id_efector_publico) INNER JOIN prestadores USING(id_prestador) WHERE TRUE";
	
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
	
	return $this->toJson($sql);
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
  
  
  public function method_escribir_solicitudes($params, $error) {
	$p = $params[0];
	
	$sql = "SELECT";
	
	return $this->toJson($sql);
  }
}































?>