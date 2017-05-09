<?php

class class_Base_general
{
  
  
  public function sql_query($query, &$lnk = null) {
  	$resultado = null;
  	$errno = 0;
  	if (is_null($lnk)) {
  		$resultado = mysql_query($query);
  		$errno = mysql_errno();
  		if ($errno) throw new Exception(mysql_error(), $errno);
  	} else {
  		$resultado = mysql_query($query, $lnk);
  		$errno = mysql_errno($lnk);
  		if ($errno) throw new Exception(mysql_error($lnk), $errno);
  	}
  	return $resultado;
  }
  
	
  public function toJson($paramet, &$opciones = null) {
	if (is_string($paramet)) {
		$cadena = strtoupper(substr(trim($paramet), 0, 6));
		if ($cadena=="INSERT" || $cadena=="SELECT") {
			$paramet = @mysql_query($paramet);
			if (mysql_errno() > 0) {
				return mysql_errno() . " " . mysql_error() . "\n";
			} else if ($cadena=="INSERT"){ 
				//$nodo=$xml->addChild("insert_id", mysql_insert_id());
			} else {
				return $this->toJson($paramet, $opciones);
			}
		}
	} else if (is_resource($paramet)) {
		$rows = array();
		if (is_null($opciones)) {
			while ($row = mysql_fetch_object($paramet)) {
				$rows[] = $row;
			}
		} else {
			while ($row = mysql_fetch_object($paramet)) {
				foreach($opciones as $key => $value) {
					if ($value=="int") {
						$row->$key = (int) $row->$key;
					} else if ($value=="float") {
						$row->$key = (float) $row->$key;
					} else if ($value=="bool") {
						$row->$key = (bool) $row->$key;
					} else {
						$value($row, $key);
					}
				}

				$rows[] = $row;
			}
		}
		return $rows;
	}
  }
  

  public function prepararCampos(&$model, $tabla = null) {
  	static $campos = array();
	$set = array();
	$chequear = false;
	if (!is_null($tabla)) {
		$chequear = true;
		if (is_null($campos[$tabla])) {
			$campos[$tabla] = array();
			$rs = mysql_query("SHOW COLUMNS FROM " . $tabla);
			while ($row = mysql_fetch_assoc($rs)) {
				$campos[$tabla][$row['Field']] = true;
			}
		}
	}
	foreach($model as $key => $value) {
		if ($chequear) {
			if (!is_null($campos[$tabla][$key])) {
				$set[] = $key . "='" . $value . "'";
			}			
		} else {
			$set[] = $key . "='" . $value . "'";
		}
	}
	return implode(", ", $set);
  }
}

?>