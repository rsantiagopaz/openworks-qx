<?php

require("Base.php");

class class_Empleados extends class_Base
{
  function __construct() {
    parent::__construct();
  }
  
  
  public function method_eliminar_reloj($params, $error) {
	$p = $params[0];
	
	foreach ($p->id_empleado_reloj as $id_empleado_reloj) {
		$sql = "DELETE FROM empleado_reloj WHERE id_empleado_reloj=" . $id_empleado_reloj;
		$this->sql_query($sql);
	}

	//$sql = "DELETE FROM empleado_permiso WHERE id_empleado_permiso=" . $p->id_empleado_permiso;
	//$this->sql_query($sql);
  }
  
  
  public function method_asignar_reloj($params, $error) {
	$p = $params[0];

	foreach ($p->id_empleado as $id_empleado) {
		foreach ($p->id_reloj as $id_reloj) {
			$sql = "INSERT empleado_reloj SET id_empleado=" . $id_empleado . ", id_reloj=" . $id_reloj;
			$this->sql_query($sql);
		}
	}
  }
  
  
  public function method_eliminar_permiso($params, $error) {
	$p = $params[0];
	
	foreach ($p->id_empleado_permiso as $id_empleado_permiso) {
		$sql = "DELETE FROM empleado_permiso WHERE id_empleado_permiso=" . $id_empleado_permiso;
		$this->sql_query($sql);
	}

	//$sql = "DELETE FROM empleado_permiso WHERE id_empleado_permiso=" . $p->id_empleado_permiso;
	//$this->sql_query($sql);
  }
  
  
  public function method_asignar_permiso($params, $error) {
	$p = $params[0];
	
	foreach ($p->id_empleado_turno as $id_empleado_turno) {
		$sql = "INSERT empleado_permiso SET id_empleado_turno=" . $id_empleado_turno . ", id_permiso=" . $p->id_permiso . ", fecha='" . $p->fecha . "'";
		$this->sql_query($sql);		
	}
	

	//$set = $this->prepararCampos($p);
	//$sql = "INSERT empleado_permiso SET " . $set . "";
	//$this->sql_query($sql);
	//return mysql_insert_id();
  }
  
  
  public function method_eliminar_turno($params, $error) {
	$p = $params[0];

	foreach ($p->id_empleado_turno as $id_empleado_turno) {
		$sql = "DELETE FROM empleado_turno WHERE id_empleado_turno=" . $id_empleado_turno;
		$this->sql_query($sql);
	}
  }
  
  
  public function method_asignar_turno($params, $error) {
	$p = $params[0];

	foreach ($p->id_empleado as $id_empleado) {
		$sql = "INSERT empleado_turno SET id_empleado=" . $id_empleado . ", id_turno=" . $p->id_turno . ", desde='" . $p->desde . "', hasta=" . ((is_null($p->hasta)) ? "NULL" : "'" . $p->hasta . "'") . "";
		$this->sql_query($sql);		
	}
  }
  
  
  public function method_leer_asignaciones($params, $error) {
	$p = $params[0];
	
	$resultado = array();
	
	$where = ((count($p->lugar_trabajo) > 0) ? " WHERE id_lugar_trabajo IN (" . implode(", ", $p->lugar_trabajo) . ")" : " WHERE FALSE"); 
	$sql = "SELECT id_empleado, CONCAT(apellido, ', ', nombre) AS apenom, name, enroll_number FROM empleado" . $where . " ORDER BY apenom, name";

	$rs = $this->sql_query($sql);
	while ($row = mysql_fetch_object($rs)) {
		$sql = "SELECT empleado_turno.*, turno.descrip AS turno FROM empleado_turno INNER JOIN turno USING(id_turno) WHERE id_empleado=" . $row->id_empleado;
		$row->turnos = $this->toJson($sql);
		
		$sql = "SELECT empleado_permiso.*, permiso.descrip AS permiso, turno.descrip AS turno FROM ((empleado_permiso INNER JOIN permiso USING(id_permiso)) INNER JOIN empleado_turno USING(id_empleado_turno)) INNER JOIN turno USING(id_turno) WHERE id_empleado=" . $row->id_empleado;
		$row->permisos = $this->toJson($sql);
		
		$sql = "SELECT empleado_reloj.*, reloj.descrip AS reloj FROM empleado_reloj INNER JOIN reloj USING(id_reloj) WHERE id_empleado=" . $row->id_empleado;
		$row->relojes = $this->toJson($sql);
				
		$resultado[] = $row;
	}
	
	//return $this->toJson("SELECT id_empleado_turno, empleado_turno.desde, empleado_turno.hasta, turno.descrip AS turno FROM empleado_turno INNER JOIN turno USING(id_turno) WHERE empleado_turno.id_empleado=" . $p->id_empleado);
	return $resultado;
  }
  
  
  public function method_leer_empleados($params, $error) {
  	$p = $params[0];
  	
  	function functionAux(&$row, $col) {
  		$row->apenom = (empty($row->apellido) && empty($row->nombre)) ? "" : $row->apellido . ", " . $row->nombre;
  	};
  	
  	$opciones = new stdClass;
  	$opciones->enabled = "bool";
  	$opciones->privilege = "float";
  	$opciones->salida = functionAux;
  	
  	$where = ((count($p->lugar_trabajo) > 0) ? " WHERE id_lugar_trabajo IN (" . implode(", ", $p->lugar_trabajo) . ")" : " WHERE FALSE");
  	
	return $this->toJson("SELECT * FROM empleado" . $where . " ORDER BY apellido, nombre, name", $opciones);
  }
  
  
  public function method_leer_empleado($params, $error) {
  	$p = $params[0];
  	
  	$resultado = array();

  	
	return $resultado;
  }
  
  
  public function method_alta_modifica_empleado($params, $error) {
  	$p = $params[0];
  	
  	$resultado = false;
  	
	$set = $this->prepararCampos($p, "empleado");
  	
  	if ($p->id_empleado=="0") {
  		$sql = "INSERT empleado SET " . $set . "";
  		$this->sql_query($sql);
  		$resultado = mysql_insert_id();
  	} else {
  		$sql = "UPDATE empleado SET " . $set . " WHERE id_empleado=" . $p->id_empleado . "";
  		$this->sql_query($sql);
  		$resultado = $p->id_empleado;
  	}
  	
	return $resultado;
  }
}

?>