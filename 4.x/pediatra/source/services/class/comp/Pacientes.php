<?php

require("Base.php");

class class_Pacientes extends class_Base
{
  function __construct() {
    parent::__construct();
  }
  
  
  public function method_buscar_paciente($params, $error) {
  	$p = $params[0];
  	
	if ($p->texto != "") {
		function functionAux(&$row, $key, &$parametro) {
			if (is_numeric($parametro->texto)) {
				return ((stripos($row->nro_doc, $parametro->texto) === false && stripos($row->domicilio, $parametro->texto) === false) ? false : true);
			} else {
				return ((stripos($row->apenom, $parametro->texto) === false && stripos($row->domicilio, $parametro->texto) === false) ? false : true);
			}
		};
		
	  	$aux = new stdClass;
	  	$aux->funcion = functionAux;
	  	$aux->parametro = $p;
	  	
	  	$opciones = new stdClass;
	  	$opciones->salida = $aux;
	}
  	
	$sql = "SELECT id_paciente, CONCAT(apellido, ', ', nombre) AS apenom, nro_doc, domicilio FROM paciente ORDER BY apenom";
	return $this->toJson($sql, $opciones);
  }
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  public function method_autocompletarMedico($params, $error) {
  	$p = $params[0];
  	
	$sql = "SELECT id_personal AS model, apenom AS label FROM salud1._personal WHERE id_profesion = '1' AND apenom LIKE '" . $p->texto . "%' ORDER BY label";
	return $this->toJson($sql);
  }
  
  
  public function method_autocompletarProducto($params, $error) {
  	$p = $params[0];
  	
	$sql = "SELECT id_producto AS model, CONCAT(descripcion, ' | ', tipo_producto) AS label FROM productos INNER JOIN tipos_productos USING (id_tipo_producto) WHERE descripcion LIKE '%" . $p->texto . "%' ORDER BY label";
	return $this->toJson($sql);
  }
  
  
  public function method_autocompletarFinanciador($params, $error) {
  	$p = $params[0];
  	
  	
	function functionAux(&$row, $key) {
		if (! is_null($row->siglas)) $row->siglas = trim($row->siglas);
		$aux = ((empty($row->siglas)) ? $row->nombre . "" : $row->siglas . ", " . $row->nombre);

		unset($row->siglas);
		unset($row->nombre);
		
		$row->label = $aux;
	};
  	
  	$opciones = new stdClass;
  	$opciones->salida = functionAux;
  	
	$sql = "SELECT id_financiador AS model, nombre, siglas FROM suram.financiadores WHERE siglas LIKE '" . $p->texto . "%' OR nombre LIKE '" . $p->texto . "%' ORDER BY siglas, nombre";
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
  
  
  public function method_leer_usuario($params, $error) {
	$p = $params[0];
	
	$sql = "SELECT * FROM usuario WHERE usuario LIKE '" . $p->nick . "'";
	$rs = mysql_query($sql);
	if (mysql_num_rows($rs) > 0) {
		$row = mysql_fetch_object($rs);
		if ($row->password == md5($p->password)) {
			$row->lugar_trabajo = $this->toJson("SELECT lugar_trabajo.id_lugar_trabajo, lugar_trabajo.descrip FROM usuario_lugar_trabajo INNER JOIN lugar_trabajo USING(id_lugar_trabajo) WHERE id_usuario=" . $row->id_usuario . " ORDER BY descrip");
			return $row;
		} else {
			$error->SetError(0, "password");
			return $error;
		}
	} else {
		$error->SetError(0, "nick");
		return $error;
	}
  }
  
  
  public function method_leer_ubicaciones($params, $error) {
  	$p = $params[0];
  	
  	$sql = "SELECT * FROM ubicacion WHERE id_ubicacion=" . $p->id_ubicacion;
  	$rs = mysql_query($sql);
	$nodo = mysql_fetch_object($rs);
	
	$nodo->padre = "";
	$nodo->labelLargo = "";
	$nodo->hijos = array();
	
  	$sql = "SELECT id_ubicacion FROM ubicacion WHERE id_padre=" . $p->id_ubicacion . " ORDER BY descrip";
  	$rs = mysql_query($sql);
  	while ($row = mysql_fetch_object($rs)) {
  		$p->id_ubicacion = $row->id_ubicacion;
  		$nodo->hijos[] = $this->method_leer_ubicaciones($params, $error);
  	}
	
	return $nodo;
  }
  
  
  public function method_leer_tolerancias($params, $error) {
  	$p = $params[0];
  	
  	$opciones = new stdClass;
  	$opciones->entrada_extras = "bool";
  	$opciones->e_fichada = "int";
  	$opciones->e_tolerable = "int";
  	$opciones->e_tardanza = "int";
  	$opciones->salida_extras = "bool";
  	$opciones->s_fichada = "int";
  	$opciones->s_tolerable = "int";
  	$opciones->s_abandono = "int";
  	
  	return $this->toJson("SELECT * FROM tolerancia", $opciones);
  }
  
  
  public function method_escribir_tolerancia($params, $error) {
  	$p = $params[0];
  	
	$set = $this->prepararCampos($p->model);
  	
  	if (is_null($p->model->id_tolerancia)) {
  		$sql = "INSERT tolerancia SET " . $set . "";
  		mysql_query($sql);
  	} else{
  		$sql = "UPDATE tolerancia SET " . $set . " WHERE id_tolerancia=" . $p->model->id_tolerancia . "";
  		mysql_query($sql);
  	}
  }
  
  
  public function method_leer_permisos($params, $error) {
  	$p = $params[0];
  	
  	$opciones = new stdClass;
  	$opciones->entrada = "bool";
  	$opciones->salida = "bool";
  	$opciones->pagas = "bool";
  	$opciones->activo = "bool";
  	if ($p->todos) {
  		$resultado = $this->toJson("SELECT * FROM permiso", $opciones);
  	} else {
  		$resultado = $this->toJson("SELECT * FROM permiso WHERE activo", $opciones);
  	}
  	
  	return $resultado;
  }
  
  
  public function method_escribir_permisos($params, $error) {
  	$p = $params[0];
  	
  	$cambios = $p->cambios;
  	
  	try {
		mysql_query("START TRANSACTION");
		
		foreach ($cambios->altas as $item) {
			$set = $this->prepararCampos($item, "permiso");
			$sql="INSERT INTO permiso SET " . $set;
			mysql_query($sql);
		}
	
		foreach ($cambios->modificados as $item) {
			$set = $this->prepararCampos($item, "permiso");
			$sql = "UPDATE permiso SET " . $set . " WHERE id_permiso=" . $item->id_permiso . "";
			mysql_query($sql);
		}	
	
		mysql_query("COMMIT");
	
	} catch (Exception $e) {
		mysql_query("ROLLBACK");
	}
  }
  
  
  public function method_escribir_turno($params, $error) {
  	$p = $params[0];
  	
	$set = $this->prepararCampos($p->model);
  	
  	if (is_null($p->model->id_turno)) {
  		$sql = "INSERT turno SET " . $set . "";
  		mysql_query($sql);
  	} else{
  		$sql = "UPDATE turno SET " . $set . " WHERE id_turno=" . $p->model->id_turno . "";
  		mysql_query($sql);
  	}
  }
  
  
  public function method_leer_turnos($params, $error) {
  	$p = $params[0];
  	
 	
  	function functionAux(&$row, $col) {
  		$row->$col = substr($row->$col, 0, 5);
  	};
  	
  	$tipos = array("cant_horas"=>"int", "activo"=>"bool", "lu"=>"bool", "ma"=>"bool", "mi"=>"bool", "ju"=>"bool", "vi"=>"bool", "sa"=>"bool", "do"=>"bool", "entrada"=>functionAux, "salida"=>functionAux);
	if ($p->todos) {
		$respuesta = $this->toJson("SELECT * FROM turno", $tipos);
	} else {
		$respuesta = $this->toJson("SELECT * FROM turno WHERE activo", $tipos);
	}
	
	return $respuesta;
  }
  
  
  public function method_leer_usuarios($params, $error) {
  	$p = $params[0];
  	
  	$resultado = $this->toJson("SELECT * FROM usuario ORDER BY usuario");
  	foreach ($resultado as $item) {
  		$item->lugar_trabajo = $this->toJson("SELECT lugar_trabajo.id_lugar_trabajo, lugar_trabajo.descrip FROM usuario_lugar_trabajo INNER JOIN lugar_trabajo USING(id_lugar_trabajo) WHERE id_usuario=" . $item->id_usuario . " ORDER BY descrip");
  	}
  	
  	return $resultado;
  }
  
  
  public function method_escribir_usuarios($params, $error) {
  	$p = $params[0];
  	
  	
  	try {
		mysql_query("START TRANSACTION");
		
	  	if (is_null($p->model->id_usuario)) {
	  		$sql = "INSERT usuario SET usuario='" . $p->model->usuario . "', password=MD5('" . $p->model->password . "'), tipo='" . $p->model->tipo . "'";
	  		mysql_query($sql);
	  		
	  		$p->model->id_usuario = mysql_insert_id();
	  	} else{
	  		$sql = "DELETE FROM usuario_lugar_trabajo WHERE id_usuario=" . $p->model->id_usuario;
	  		mysql_query($sql);
	  		
	  		$sql = "UPDATE usuario SET usuario='" . $p->model->usuario . "', tipo='" . $p->model->tipo . "' WHERE id_usuario=" . $p->model->id_usuario;
	  		mysql_query($sql);
	  	}
	  	
	  	foreach ($p->lugar_trabajo as $item) {
			$sql = "INSERT usuario_lugar_trabajo SET id_usuario=" . $p->model->id_usuario . ", id_lugar_trabajo=" . $item;
			mysql_query($sql);
	  	}
	
		mysql_query("COMMIT");
	
	} catch (Exception $e) {
		mysql_query("ROLLBACK");
	}
  }
  
  
  public function method_leer_lugar_trabajo($params, $error) {
  	$p = $params[0];
  	
  	return $this->toJson("SELECT * FROM lugar_trabajo ORDER BY descrip");
  }
  
  
  public function method_escribir_lugar_trabajo($params, $error) {
  	$p = $params[0];
  	
  	$cambios = $p->cambios;
  	
  	try {
		mysql_query("START TRANSACTION");
		
		foreach ($cambios->altas as $item) {
			$sql="INSERT INTO lugar_trabajo SET descrip='" . $item->descrip . "'";
			mysql_query($sql);
		}
	
		foreach ($cambios->modificados as $item) {
			$sql="UPDATE lugar_trabajo SET descrip='" . $item->descrip . "' WHERE id_lugar_trabajo='" . $item->id_lugar_trabajo . "'";
			mysql_query($sql);
		}	
	
		mysql_query("COMMIT");
	
	} catch (Exception $e) {
		mysql_query("ROLLBACK");
	}
  }
  
  
  public function method_leer_relojes($params, $error) {
  	$p = $params[0];
  	
  	return $this->toJson("SELECT * FROM reloj");
  }
  
  
  public function method_escribir_relojes($params, $error) {
  	$p = $params[0];
  	
  	$cambios = $p->cambios;
  	
  	try {
		mysql_query("START TRANSACTION");
		
		foreach ($cambios->altas as $item) {
			$sql="INSERT INTO reloj SET descrip='" . $item->descrip . "', host='" . $item->host . "'";
			mysql_query($sql);
		}
	
		foreach ($cambios->modificados as $item) {
			$sql="UPDATE reloj SET descrip='" . $item->descrip . "', host='" . $item->host . "' WHERE id_reloj='" . $item->id_reloj . "'";
			mysql_query($sql);
		}	
	
		mysql_query("COMMIT");
	
	} catch (Exception $e) {
		mysql_query("ROLLBACK");
	}
  }
}

?>