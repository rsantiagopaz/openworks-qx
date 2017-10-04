<?php

session_start();

require("Base.php");

class class_Prefacturacion extends class_Base
{


  public function method_leer_prefacturacion($params, $error) {
	$p = $params[0];
	
	$resultado = array();
	
	$sql = "SELECT * FROM prefacturaciones ORDER BY fecha_creacion DESC";
	
	$rs = $this->mysqli->query($sql);
	while ($row = $rs->fetch_object()) {
		$sql = "SELECT _organismos_areas.organismo_area_descripcion AS prestador FROM prefacturaciones_items INNER JOIN solicitudes USING(id_solicitud) INNER JOIN _organismos_areas ON solicitudes.id_prestador = _organismos_areas.organismo_area_id WHERE prefacturaciones_items.id_prefacturacion='" . $row->id_prefacturacion . "'";
		$rsAux = $this->mysqli->query($sql);
		$rowAux = $rsAux->fetch_object();
		
		$row->cantidad = $rsAux->num_rows;
		$row->prestador = $rowAux->prestador;
		
		$row->valor = (float) $row->valor;
		
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