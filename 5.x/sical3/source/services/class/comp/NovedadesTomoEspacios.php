<?php

require("Base.php");

class class_NovedadesTomoEspacios extends class_Base
{


  public function method_autocompletarUsuario($params, $error) {
  	$p = $params[0];
  	
 	$sql = "SELECT SYSusuario AS model, SYSusuarionombre AS label";
	$sql.= " FROM _usuarios INNER JOIN _organismos_areas_usuarios USING(SYSusuario)";
	$sql.= " WHERE _organismos_areas_usuarios.organismo_area_id='6' AND SYSusuario LIKE '%" . $p->texto . "%'";
	$sql.= " ORDER BY label";
	
	return $this->toJson($sql);
  }
  
  
  public function method_autocompletarNivel($params, $error) {
  	$p = $params[0];
  	
 	$sql = "SELECT id_nivel AS model, nivel AS label";
	$sql.= " FROM niveles";
	$sql.= " WHERE nivel LIKE '%" . $p->texto . "%'";
	$sql.= " ORDER BY label";
	
	return $this->toJson($sql);
  }
}

?>