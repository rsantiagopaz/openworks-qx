<?php

require("Base.php");

class class_Parametros extends class_Base
{
  function __construct() {
    parent::__construct();
  }
  
  
  public function method_leer_datos($params, $error) {
	$p = $params[0];
	
	$limit = 15;
	
	$resultado = new stdClass;
	
	if (! is_null($p->variable)) {
		if ($p->basico->opcion == 1) {
			if ($p->variable->opcion == 2) {
				$sql = "SELECT entregas.id_financiador, financiadores.siglas, financiadores.nombre, COUNT(*) AS cantidad";
				$sql.= " FROM ((entregas LEFT JOIN suram.financiadores USING(id_financiador)) INNER JOIN items_entregas USING(id_entrega)) INNER JOIN productos_depositos USING(id_producto_deposito)";
				$sql.= " WHERE entregas.estado <> 'X'";
				if (! $p->basico->sinos) $sql.= " AND NOT ISNULL(entregas.id_financiador)";
				if (! is_null($p->fecha)) $sql.= " AND (entregas.fecha BETWEEN '" . $p->fecha->desde . "' AND '" . $p->fecha->hasta . "')";
				$sql.= " AND productos_depositos.id_producto = " . $p->variable->model;
				$sql.= " GROUP BY id_financiador ORDER BY cantidad DESC LIMIT " . $limit;
				
				function functionAux(&$row, $key) {
					if (is_null($row->id_financiador)) {
						$row->descrip = "sin OS";
					} else {
						if (! is_null($row->siglas)) $row->siglas = trim($row->siglas);
						$aux = ((empty($row->siglas)) ? $row->nombre . "" : $row->siglas . ", " . $row->nombre);
						
						$row->descrip = $aux;
					}
				};
			  	
			  	$opciones = new stdClass;
			  	$opciones->functionAux = functionAux;
			  	
				$rows = $this->toJson($sql, $opciones);
				
			} else if ($p->variable->opcion == 3) {
				$sql = "SELECT entregas.id_financiador, financiadores.siglas, financiadores.nombre, COUNT(*) AS cantidad";
				$sql.= " FROM (entregas LEFT JOIN suram.financiadores USING(id_financiador)) INNER JOIN pacientes USING(id_paciente)";
				$sql.= " WHERE entregas.estado <> 'X'";
				if (! $p->basico->sinos) $sql.= " AND NOT ISNULL(entregas.id_financiador)";
				if (! is_null($p->fecha)) $sql.= " AND (entregas.fecha BETWEEN '" . $p->fecha->desde . "' AND '" . $p->fecha->hasta . "')";
				$sql.= " AND pacientes.id_personal = " . $p->variable->model;
				$sql.= " GROUP BY id_financiador ORDER BY cantidad DESC LIMIT " . $limit;
				
				function functionAux(&$row, $key) {
					if (is_null($row->id_financiador)) {
						$row->descrip = "sin OS";
					} else {
						if (! is_null($row->siglas)) $row->siglas = trim($row->siglas);
						$aux = ((empty($row->siglas)) ? $row->nombre . "" : $row->siglas . ", " . $row->nombre);
						
						$row->descrip = $aux;
					}
				};
			  	
			  	$opciones = new stdClass;
			  	$opciones->functionAux = functionAux;
			  	
				$rows = $this->toJson($sql, $opciones);
				
			} else if ($p->variable->opcion == 4) {
				$sql = "SELECT entregas.id_financiador, financiadores.siglas, financiadores.nombre, COUNT(*) AS cantidad";
				$sql.= " FROM ((entregas LEFT JOIN suram.financiadores USING(id_financiador)) INNER JOIN pacientes USING(id_paciente)) INNER JOIN salud1._personas USING(persona_id)";
				$sql.= " WHERE entregas.estado <> 'X'";
				if (! $p->basico->sinos) $sql.= " AND NOT ISNULL(entregas.id_financiador)";
				if (! is_null($p->fecha)) $sql.= " AND (entregas.fecha BETWEEN '" . $p->fecha->desde . "' AND '" . $p->fecha->hasta . "')";
				$sql.= " AND (((YEAR(CURDATE()) - YEAR(_personas.persona_fecha_nacimiento)) - (RIGHT(CURDATE(), 5) < RIGHT(_personas.persona_fecha_nacimiento, 5))) BETWEEN " . $p->variable->model . ")";
				$sql.= " GROUP BY id_financiador ORDER BY cantidad DESC LIMIT " . $limit;
				
				function functionAux(&$row, $key) {
					if (is_null($row->id_financiador)) {
						$row->descrip = "sin OS";
					} else {
						if (! is_null($row->siglas)) $row->siglas = trim($row->siglas);
						$aux = ((empty($row->siglas)) ? $row->nombre . "" : $row->siglas . ", " . $row->nombre);
						
						$row->descrip = $aux;
					}
				};
			  	
			  	$opciones = new stdClass;
			  	$opciones->functionAux = functionAux;
			  	
				$rows = $this->toJson($sql, $opciones);
				
			} else if ($p->variable->opcion == 5) {
				$sql = "SELECT entregas.id_financiador, financiadores.siglas, financiadores.nombre, COUNT(*) AS cantidad";
				$sql.= " FROM ((entregas LEFT JOIN suram.financiadores USING(id_financiador)) INNER JOIN pacientes USING(id_paciente)) INNER JOIN salud1._personas USING(persona_id)";
				$sql.= " WHERE entregas.estado <> 'X'";
				if (! $p->basico->sinos) $sql.= " AND NOT ISNULL(entregas.id_financiador)";
				if (! is_null($p->fecha)) $sql.= " AND (entregas.fecha BETWEEN '" . $p->fecha->desde . "' AND '" . $p->fecha->hasta . "')";
				$sql.= " AND _personas.persona_sexo LIKE '" . $p->variable->model . "'";
				$sql.= " GROUP BY id_financiador ORDER BY cantidad DESC LIMIT " . $limit;
				
				function functionAux(&$row, $key) {
					if (is_null($row->id_financiador)) {
						$row->descrip = "sin OS";
					} else {
						if (! is_null($row->siglas)) $row->siglas = trim($row->siglas);
						$aux = ((empty($row->siglas)) ? $row->nombre . "" : $row->siglas . ", " . $row->nombre);
						
						$row->descrip = $aux;
					}
				};
			  	
			  	$opciones = new stdClass;
			  	$opciones->functionAux = functionAux;
			  	
				$rows = $this->toJson($sql, $opciones);
				
			}
			
		} else if ($p->basico->opcion == 2) {
			if ($p->variable->opcion == 1) {
				$sql = "SELECT productos.id_producto, CONCAT(productos.descripcion, ' | ', tipos_productos.tipo_producto) AS descrip, SUM(items_entregas.cantidad) AS cantidad";
				$sql.= " FROM (((entregas INNER JOIN items_entregas USING(id_entrega)) INNER JOIN productos_depositos USING(id_producto_deposito)) INNER JOIN productos USING(id_producto)) INNER JOIN tipos_productos USING(id_tipo_producto)";
				$sql.= " WHERE entregas.estado <> 'X'";
				if (! is_null($p->fecha)) $sql.= " AND (entregas.fecha BETWEEN '" . $p->fecha->desde . "' AND '" . $p->fecha->hasta . "')";
				$sql.= ((is_null($p->variable->model)) ? " AND ISNULL(entregas.id_financiador)" : " AND entregas.id_financiador=" . $p->variable->model);
				$sql.= " GROUP BY id_producto ORDER BY cantidad DESC LIMIT " . $limit;
				
				$rows = $this->toJson($sql);

			} else if ($p->variable->opcion == 3) {
				$sql = "SELECT productos.id_producto, CONCAT(productos.descripcion, ' | ', tipos_productos.tipo_producto) AS descrip, SUM(items_entregas.cantidad) AS cantidad";
				$sql.= " FROM ((((pacientes INNER JOIN entregas USING(id_paciente)) INNER JOIN items_entregas USING(id_entrega)) INNER JOIN productos_depositos USING(id_producto_deposito)) INNER JOIN productos USING(id_producto)) INNER JOIN tipos_productos USING(id_tipo_producto)";
				$sql.= " WHERE entregas.estado <> 'X'";
				if (! is_null($p->fecha)) $sql.= " AND (entregas.fecha BETWEEN '" . $p->fecha->desde . "' AND '" . $p->fecha->hasta . "')";
				$sql.= " AND pacientes.id_personal = " . $p->variable->model;
				$sql.= " GROUP BY id_producto ORDER BY cantidad DESC LIMIT " . $limit;
				
				$rows = $this->toJson($sql);

			} else if ($p->variable->opcion == 4) {
				$sql = "SELECT productos.id_producto, CONCAT(productos.descripcion, ' | ', tipos_productos.tipo_producto) AS descrip, SUM(items_entregas.cantidad) AS cantidad";
				$sql.= " FROM (((((pacientes INNER JOIN salud1._personas USING(persona_id)) INNER JOIN entregas USING(id_paciente)) INNER JOIN items_entregas USING(id_entrega)) INNER JOIN productos_depositos USING(id_producto_deposito)) INNER JOIN productos USING(id_producto)) INNER JOIN tipos_productos USING(id_tipo_producto)";
				$sql.= " WHERE entregas.estado <> 'X'";
				if (! is_null($p->fecha)) $sql.= " AND (entregas.fecha BETWEEN '" . $p->fecha->desde . "' AND '" . $p->fecha->hasta . "')";
				$sql.= " AND (((YEAR(CURDATE()) - YEAR(_personas.persona_fecha_nacimiento)) - (RIGHT(CURDATE(), 5) < RIGHT(_personas.persona_fecha_nacimiento, 5))) BETWEEN " . $p->variable->model . ")";
				$sql.= " GROUP BY id_producto ORDER BY cantidad DESC LIMIT " . $limit;
				
				$rows = $this->toJson($sql);
				
			} else if ($p->variable->opcion == 5) {
				$sql = "SELECT productos.id_producto, CONCAT(productos.descripcion, ' | ', tipos_productos.tipo_producto) AS descrip, SUM(items_entregas.cantidad) AS cantidad";
				$sql.= " FROM (((((pacientes INNER JOIN salud1._personas USING(persona_id)) INNER JOIN entregas USING(id_paciente)) INNER JOIN items_entregas USING(id_entrega)) INNER JOIN productos_depositos USING(id_producto_deposito)) INNER JOIN productos USING(id_producto)) INNER JOIN tipos_productos USING(id_tipo_producto)";
				$sql.= " WHERE entregas.estado <> 'X'";
				if (! is_null($p->fecha)) $sql.= " AND (entregas.fecha BETWEEN '" . $p->fecha->desde . "' AND '" . $p->fecha->hasta . "')";
				$sql.= " AND _personas.persona_sexo LIKE '" . $p->variable->model . "'";
				$sql.= " GROUP BY id_producto ORDER BY cantidad DESC LIMIT " . $limit;
				
				$rows = $this->toJson($sql);
			
			}
			
		} else if ($p->basico->opcion == 3) {
			if ($p->variable->opcion == 1) {
				$sql = "SELECT pacientes.id_personal, _personal.apenom AS descrip, COUNT(*) AS cantidad";
				$sql.= " FROM (pacientes INNER JOIN salud1._personal USING(id_personal)) INNER JOIN entregas USING(id_paciente)";
				$sql.= " WHERE entregas.estado <> 'X'";
				if (! is_null($p->fecha)) $sql.= " AND (entregas.fecha BETWEEN '" . $p->fecha->desde . "' AND '" . $p->fecha->hasta . "')";
				$sql.= ((is_null($p->variable->model)) ? " AND ISNULL(entregas.id_financiador)" : " AND entregas.id_financiador=" . $p->variable->model);
				$sql.= " GROUP BY id_personal ORDER BY cantidad DESC LIMIT " . $limit;
				
				$rows = $this->toJson($sql);
				
			} else if ($p->variable->opcion == 2) {
				$sql = "SELECT pacientes.id_personal, _personal.apenom AS descrip, COUNT(*) AS cantidad";
				$sql.= " FROM (((pacientes INNER JOIN salud1._personal USING(id_personal)) INNER JOIN entregas USING(id_paciente)) INNER JOIN items_entregas USING(id_entrega)) INNER JOIN productos_depositos USING(id_producto_deposito)";
				$sql.= " WHERE entregas.estado <> 'X'";
				if (! is_null($p->fecha)) $sql.= " AND (entregas.fecha BETWEEN '" . $p->fecha->desde . "' AND '" . $p->fecha->hasta . "')";
				$sql.= " AND productos_depositos.id_producto = " . $p->variable->model;
				
				$sql.= " GROUP BY id_personal ORDER BY cantidad DESC LIMIT " . $limit;
				
				$rows = $this->toJson($sql);
				
			} else if ($p->variable->opcion == 4) {
				$sql = "SELECT pacientes.id_personal, _personal.apenom AS descrip, COUNT(*) AS cantidad";
				$sql.= " FROM (pacientes INNER JOIN salud1._personal USING(id_personal)) INNER JOIN salud1._personas USING(persona_id)";
				$sql.= " WHERE TRUE";
				$sql.= " AND (((YEAR(CURDATE()) - YEAR(_personas.persona_fecha_nacimiento)) - (RIGHT(CURDATE(), 5) < RIGHT(_personas.persona_fecha_nacimiento, 5))) BETWEEN " . $p->variable->model . ")";
				$sql.= " GROUP BY id_personal ORDER BY cantidad DESC LIMIT " . $limit;
				
				$rows = $this->toJson($sql);
				
			} else if ($p->variable->opcion == 5) {
				$sql = "SELECT pacientes.id_personal, _personal.apenom AS descrip, COUNT(*) AS cantidad";
				$sql.= " FROM (pacientes INNER JOIN salud1._personal USING(id_personal)) INNER JOIN salud1._personas USING(persona_id)";
				$sql.= " WHERE TRUE";
				$sql.= " AND _personas.persona_sexo LIKE '" . $p->variable->model . "'";
				$sql.= " GROUP BY id_personal ORDER BY cantidad DESC LIMIT " . $limit;
				
				$rows = $this->toJson($sql);
			
			}
			
		} else if ($p->basico->opcion == 4) {
			if ($p->variable->opcion == 1) {
				$rows = array();
				$rows[] = array("0 - 15 años", "0 AND 15");
				$rows[] = array("16 - 25 años", "16 AND 25");
				$rows[] = array("26 - 30 años", "26 AND 30");
				$rows[] = array("31 - 45 años", "31 AND 45");
				$rows[] = array("46 - 60 años", "46 AND 60");
				$rows[] = array("61 - 75 años", "61 AND 75");
				$rows[] = array("76 - 90 años", "76 AND 90");
				$rows[] = array("91 - 105 años", "91 AND 105");
				
				foreach ($rows as $key => $value) {
					$sql = "(SELECT '" . $value[0] . "' AS descrip, COUNT(*) AS cantidad";
					$sql.= " FROM (pacientes INNER JOIN salud1._personas USING(persona_id)) INNER JOIN entregas USING(id_paciente)";
					$sql.= " WHERE entregas.estado <> 'X'";
					$sql.= " AND (((YEAR(CURDATE()) - YEAR(_personas.persona_fecha_nacimiento)) - (RIGHT(CURDATE(), 5) < RIGHT(_personas.persona_fecha_nacimiento, 5))) BETWEEN " . $value[1] . ")";
					if (! is_null($p->fecha)) $sql.= " AND (entregas.fecha BETWEEN '" . $p->fecha->desde . "' AND '" . $p->fecha->hasta . "')";
					$sql.= ((is_null($p->variable->model)) ? " AND ISNULL(entregas.id_financiador)" : " AND entregas.id_financiador=" . $p->variable->model);
					$sql.= " GROUP BY descrip)";
					$rows[$key] = $sql;
				}
				
				$sql = implode(" UNION ALL ", $rows);
				$sql.= " ORDER BY cantidad DESC LIMIT " . $limit;
				
				$rows = $this->toJson($sql);

			} else if ($p->variable->opcion == 2) {
				$rows = array();
				$rows[] = array("0 - 15 años", "0 AND 15");
				$rows[] = array("16 - 25 años", "16 AND 25");
				$rows[] = array("26 - 30 años", "26 AND 30");
				$rows[] = array("31 - 45 años", "31 AND 45");
				$rows[] = array("46 - 60 años", "46 AND 60");
				$rows[] = array("61 - 75 años", "61 AND 75");
				$rows[] = array("76 - 90 años", "76 AND 90");
				$rows[] = array("91 - 105 años", "91 AND 105");
				
				foreach ($rows as $key => $value) {
					$sql = "(SELECT '" . $value[0] . "' AS descrip, COUNT(*) AS cantidad";
					$sql.= " FROM (((pacientes INNER JOIN salud1._personas USING(persona_id)) INNER JOIN entregas USING(id_paciente)) INNER JOIN items_entregas USING(id_entrega)) INNER JOIN productos_depositos USING(id_producto_deposito)";
					$sql.= " WHERE entregas.estado <> 'X'";
					$sql.= " AND (((YEAR(CURDATE()) - YEAR(_personas.persona_fecha_nacimiento)) - (RIGHT(CURDATE(), 5) < RIGHT(_personas.persona_fecha_nacimiento, 5))) BETWEEN " . $value[1] . ")";
					if (! is_null($p->fecha)) $sql.= " AND (entregas.fecha BETWEEN '" . $p->fecha->desde . "' AND '" . $p->fecha->hasta . "')";
					$sql.= " AND productos_depositos.id_producto = " . $p->variable->model;
					$sql.= " GROUP BY descrip)";
					$rows[$key] = $sql;
				}
				
				$sql = implode(" UNION ALL ", $rows);
				$sql.= " ORDER BY cantidad DESC LIMIT " . $limit;
				
				$rows = $this->toJson($sql);
				
			} else if ($p->variable->opcion == 3) {
				$rows = array();
				$rows[] = array("0 - 15 años", "0 AND 15");
				$rows[] = array("16 - 25 años", "16 AND 25");
				$rows[] = array("26 - 30 años", "26 AND 30");
				$rows[] = array("31 - 45 años", "31 AND 45");
				$rows[] = array("46 - 60 años", "46 AND 60");
				$rows[] = array("61 - 75 años", "61 AND 75");
				$rows[] = array("76 - 90 años", "76 AND 90");
				$rows[] = array("91 - 105 años", "91 AND 105");
				
				foreach ($rows as $key => $value) {
					$sql = "(SELECT '" . $value[0] . "' AS descrip, COUNT(*) AS cantidad";
					$sql.= " FROM pacientes INNER JOIN salud1._personas USING(persona_id)";
					$sql.= " WHERE (((YEAR(CURDATE()) - YEAR(_personas.persona_fecha_nacimiento)) - (RIGHT(CURDATE(), 5) < RIGHT(_personas.persona_fecha_nacimiento, 5))) BETWEEN " . $value[1] . ")";
					$sql.= " AND pacientes.id_personal = " . $p->variable->model;
					$sql.= " GROUP BY descrip)";
					$rows[$key] = $sql;
				}
				
				$sql = implode(" UNION ALL ", $rows);
				$sql.= " ORDER BY cantidad DESC LIMIT " . $limit;
				
				$rows = $this->toJson($sql);
				
			} else if ($p->variable->opcion == 5) {
				$rows = array();
				$rows[] = array("0 - 15 años", "0 AND 15");
				$rows[] = array("16 - 25 años", "16 AND 25");
				$rows[] = array("26 - 30 años", "26 AND 30");
				$rows[] = array("31 - 45 años", "31 AND 45");
				$rows[] = array("46 - 60 años", "46 AND 60");
				$rows[] = array("61 - 75 años", "61 AND 75");
				$rows[] = array("76 - 90 años", "76 AND 90");
				$rows[] = array("91 - 105 años", "91 AND 105");
				
				foreach ($rows as $key => $value) {
					$sql = "(SELECT '" . $value[0] . "' AS descrip, COUNT(*) AS cantidad";
					$sql.= " FROM pacientes INNER JOIN salud1._personas USING(persona_id)";
					$sql.= " WHERE (((YEAR(CURDATE()) - YEAR(_personas.persona_fecha_nacimiento)) - (RIGHT(CURDATE(), 5) < RIGHT(_personas.persona_fecha_nacimiento, 5))) BETWEEN " . $value[1] . ")";
					$sql.= " AND _personas.persona_sexo LIKE '" . $p->variable->model . "'";
					$sql.= " GROUP BY descrip)";
					$rows[$key] = $sql;
				}
				
				$sql = implode(" UNION ALL ", $rows);
				$sql.= " ORDER BY cantidad DESC LIMIT " . $limit;
				
				$rows = $this->toJson($sql);
				
			}
			
		} else if ($p->basico->opcion == 5) {
			if ($p->variable->opcion == 1) {
				$sql = "SELECT _personas.persona_sexo, COUNT(*) AS cantidad";
				$sql.= " FROM (pacientes INNER JOIN salud1._personas USING(persona_id)) INNER JOIN entregas USING(id_paciente)";
				$sql.= " WHERE (_personas.persona_sexo LIKE 'F' OR _personas.persona_sexo LIKE 'M')";
				$sql.= " AND entregas.estado <> 'X'";
				if (! is_null($p->fecha)) $sql.= " AND (entregas.fecha BETWEEN '" . $p->fecha->desde . "' AND '" . $p->fecha->hasta . "')";
				$sql.= ((is_null($p->variable->model)) ? " AND ISNULL(entregas.id_financiador)" : " AND entregas.id_financiador=" . $p->variable->model);
				$sql.= " GROUP BY persona_sexo ORDER BY cantidad DESC LIMIT " . $limit;
				
				function functionAux(&$row, $key) {
					$row->descrip = (($row->persona_sexo == "F") ? "Femenino" : "Masculino");
				};
			  	
			  	$opciones = new stdClass;
			  	$opciones->functionAux = functionAux;
			  	
				$rows = $this->toJson($sql, $opciones);
				
			} else if ($p->variable->opcion == 2) {
				$sql = "SELECT _personas.persona_sexo, COUNT(*) AS cantidad";
				$sql.= " FROM (((pacientes INNER JOIN salud1._personas USING(persona_id)) INNER JOIN entregas USING(id_paciente)) INNER JOIN items_entregas USING(id_entrega)) INNER JOIN productos_depositos USING(id_producto_deposito)";
				$sql.= " WHERE (_personas.persona_sexo LIKE 'F' OR _personas.persona_sexo LIKE 'M')";
				$sql.= " AND entregas.estado <> 'X'";
				if (! is_null($p->fecha)) $sql.= " AND (entregas.fecha BETWEEN '" . $p->fecha->desde . "' AND '" . $p->fecha->hasta . "')";
				$sql.= " AND productos_depositos.id_producto = " . $p->variable->model;
				$sql.= " GROUP BY persona_sexo ORDER BY cantidad DESC LIMIT " . $limit;
				
				function functionAux(&$row, $key) {
					$row->descrip = (($row->persona_sexo == "F") ? "Femenino" : "Masculino");
				};
			  	
			  	$opciones = new stdClass;
			  	$opciones->functionAux = functionAux;
			  	
				$rows = $this->toJson($sql, $opciones);
				
			} else if ($p->variable->opcion == 3) {
				$sql = "SELECT _personas.persona_sexo, COUNT(*) AS cantidad";
				$sql.= " FROM pacientes INNER JOIN salud1._personas USING(persona_id)";
				$sql.= " WHERE (_personas.persona_sexo LIKE 'F' OR _personas.persona_sexo LIKE 'M')";
				$sql.= " AND pacientes.id_personal = " . $p->variable->model;
				$sql.= " GROUP BY persona_sexo ORDER BY cantidad DESC LIMIT " . $limit;
				
				function functionAux(&$row, $key) {
					$row->descrip = (($row->persona_sexo == "F") ? "Femenino" : "Masculino");
				};
			  	
			  	$opciones = new stdClass;
			  	$opciones->functionAux = functionAux;
			  	
				$rows = $this->toJson($sql, $opciones);
				
			} else if ($p->variable->opcion == 4) {
				$sql = "SELECT _personas.persona_sexo, COUNT(*) AS cantidad";
				$sql.= " FROM pacientes INNER JOIN salud1._personas USING(persona_id)";
				$sql.= " WHERE (_personas.persona_sexo LIKE 'F' OR _personas.persona_sexo LIKE 'M')";
				$sql.= " AND (((YEAR(CURDATE()) - YEAR(_personas.persona_fecha_nacimiento)) - (RIGHT(CURDATE(), 5) < RIGHT(_personas.persona_fecha_nacimiento, 5))) BETWEEN " . $p->variable->model . ")";
				$sql.= " GROUP BY persona_sexo ORDER BY cantidad DESC LIMIT " . $limit;
				
				function functionAux(&$row, $key) {
					$row->descrip = (($row->persona_sexo == "F") ? "Femenino" : "Masculino");
				};
			  	
			  	$opciones = new stdClass;
			  	$opciones->functionAux = functionAux;
			  	
				$rows = $this->toJson($sql, $opciones);
				
			}
			
		}
		
	} else {
		if ($p->basico->opcion == 1) {
			$sql = "SELECT entregas.id_financiador, financiadores.siglas, financiadores.nombre, COUNT(*) AS cantidad";
			$sql.= " FROM entregas LEFT JOIN suram.financiadores USING(id_financiador)";
			$sql.= " WHERE entregas.estado <> 'X'";
			if (! $p->basico->sinos) $sql.= " AND NOT ISNULL(entregas.id_financiador)";
			if (! is_null($p->fecha)) $sql.= " AND (entregas.fecha BETWEEN '" . $p->fecha->desde . "' AND '" . $p->fecha->hasta . "')";
			$sql.= " GROUP BY id_financiador ORDER BY cantidad DESC LIMIT " . $limit;
			
			function functionAux(&$row, $key) {
				if (is_null($row->id_financiador)) {
					$row->descrip = "sin OS";
				} else {
					if (! is_null($row->siglas)) $row->siglas = trim($row->siglas);
					$aux = ((empty($row->siglas)) ? $row->nombre . "" : $row->siglas . ", " . $row->nombre);
					
					$row->descrip = $aux;
				}
			};
		  	
		  	$opciones = new stdClass;
		  	$opciones->functionAux = functionAux;
		  	
			$rows = $this->toJson($sql, $opciones);
			
		} else if ($p->basico->opcion == 2) {
			$sql = "SELECT productos.id_producto, CONCAT(productos.descripcion, ' | ', tipos_productos.tipo_producto) AS descrip, SUM(items_entregas.cantidad) AS cantidad";
			$sql.= " FROM (((entregas INNER JOIN items_entregas USING(id_entrega)) INNER JOIN productos_depositos USING(id_producto_deposito)) INNER JOIN productos USING(id_producto)) INNER JOIN tipos_productos USING(id_tipo_producto)";
			$sql.= " WHERE entregas.estado <> 'X'";
			if (! is_null($p->fecha)) $sql.= " AND (entregas.fecha BETWEEN '" . $p->fecha->desde . "' AND '" . $p->fecha->hasta . "')";
			$sql.= " GROUP BY id_producto ORDER BY cantidad DESC LIMIT " . $limit;
			
			$rows = $this->toJson($sql);
			
		} else if ($p->basico->opcion == 3) {
			$sql = "SELECT pacientes.id_personal, _personal.apenom AS descrip, COUNT(*) AS cantidad";
			$sql.= " FROM pacientes INNER JOIN salud1._personal USING(id_personal)";
			$sql.= " GROUP BY id_personal ORDER BY cantidad DESC LIMIT " . $limit;
			
			$rows = $this->toJson($sql);
			
		} else if ($p->basico->opcion == 4) {
			$rows = array();
			$rows[] = array("0 - 15 años", "0 AND 15");
			$rows[] = array("16 - 25 años", "16 AND 25");
			$rows[] = array("26 - 30 años", "26 AND 30");
			$rows[] = array("31 - 45 años", "31 AND 45");
			$rows[] = array("46 - 60 años", "46 AND 60");
			$rows[] = array("61 - 75 años", "61 AND 75");
			$rows[] = array("76 - 90 años", "76 AND 90");
			$rows[] = array("91 - 105 años", "91 AND 105");
			
			foreach ($rows as $key => $value) {
				$sql = "(SELECT '" . $value[0] . "' AS descrip, COUNT(*) AS cantidad";
				$sql.= " FROM pacientes INNER JOIN salud1._personas USING(persona_id)";
				$sql.= " WHERE (((YEAR(CURDATE()) - YEAR(_personas.persona_fecha_nacimiento)) - (RIGHT(CURDATE(), 5) < RIGHT(_personas.persona_fecha_nacimiento, 5))) BETWEEN " . $value[1] . ")";
				$sql.= " GROUP BY descrip)";
				$rows[$key] = $sql;
			}
			
			$sql = implode(" UNION ALL ", $rows);
			$sql.= " ORDER BY cantidad DESC LIMIT " . $limit;
			
			$rows = $this->toJson($sql);
			
		} else if ($p->basico->opcion == 5) {
			$sql = "SELECT _personas.persona_sexo, COUNT(*) AS cantidad";
			$sql.= " FROM pacientes INNER JOIN salud1._personas USING(persona_id)";
			$sql.= " WHERE (_personas.persona_sexo LIKE 'F' OR _personas.persona_sexo LIKE 'M')";
			$sql.= " GROUP BY persona_sexo ORDER BY cantidad DESC LIMIT " . $limit;
			
			function functionAux(&$row, $key) {
				$row->descrip = (($row->persona_sexo == "F") ? "Femenino" : "Masculino");
			};
		  	
		  	$opciones = new stdClass;
		  	$opciones->functionAux = functionAux;
		  	
			$rows = $this->toJson($sql, $opciones);

		}
	}
	
	if ($p->grafico == "torta") {
		$dataSeries = array();
		foreach ($rows as $row) {
			$dataSeries[] = array($row->descrip, (int) $row->cantidad);
		}
		
		$resultado->dataSeries = array($dataSeries);

	} else {
		$dataSeries = array();
		$series = array();
		foreach ($rows as $row) {
			$dataSeries[] = array((int) $row->cantidad);
			
			$aux = new stdClass;
			$aux->label = $row->descrip;
			$series[] = $aux;
		}
		
		$resultado->dataSeries = $dataSeries;
		$resultado->series = $series;
	}
	
	return $resultado;
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