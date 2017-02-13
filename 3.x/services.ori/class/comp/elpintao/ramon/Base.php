<?php

session_start();

class class_Base
{
	protected $link1;
	protected $rowParamet;
	protected $arraySucursal;
	
	function __construct() {
		$this->link1 = mysql_connect($_SESSION['servidor'], $_SESSION['usuario'], $_SESSION['password']);
		mysql_select_db($_SESSION['base'], $this->link1);
		mysql_query("SET NAMES 'utf8'", $this->link1);
		
		$this->method_leer_paramet(null, null);
		$this->method_leer_sucursales(null, null);
	}
	
	
  public function method_leer_paramet($params, $error) {
	$sql="SELECT * FROM paramet";
	$rsParamet = mysql_query($sql, $this->link1);
	$this->rowParamet = mysql_fetch_object($rsParamet);
	$this->rowParamet->nro_sucursal = (int) $this->rowParamet->nro_sucursal;
	$this->rowParamet->nro_remito = (int) $this->rowParamet->nro_remito;

	return $this->rowParamet;
  }
  
  
  public function method_leer_sucursales($params, $error) {
  	$this->arraySucursal = array();
	$sql = "SELECT * FROM sucursal ORDER BY descrip";
	$rs = mysql_query($sql, $this->link1);
	while ($row = mysql_fetch_object($rs)) {
		$this->arraySucursal[$row->id_sucursal] = $row;
	}

	return $this->arraySucursal;
  }
  
  
  public function functionCalcularImportes(&$obj) {
	$obj->plmasiva = $obj->precio_lista + ($obj->precio_lista * $obj->iva / 100);
	
	$obj->costo = $obj->plmasiva;
	$obj->costo = $obj->costo - ($obj->costo * $obj->desc_fabrica / 100);
	$obj->costo = $obj->costo - ($obj->costo * $obj->desc_producto / 100);
	
	$obj->pcf = $obj->costo + ($obj->costo * $obj->remarc_final / 100);
	$obj->pcf = $obj->pcf - (($obj->pcf * $obj->desc_final) / 100);
	
	$obj->pcfcd = $obj->pcf - (($obj->pcf * $obj->bonif_final) / 100);
	
	$obj->utilcf = $obj->pcfcd - $obj->costo;
	
	$obj->pmay = $obj->costo + ($obj->costo * $obj->remarc_mayorista / 100);
	$obj->pmay = $obj->pmay - (($obj->pmay * $obj->desc_mayorista) / 100);
	
	$obj->pmaycd = $obj->pmay - (($obj->pmay * $obj->bonif_mayorista) / 100);
	
	$obj->utilmay = $obj->pmaycd - $obj->costo;
	
	$obj->comision = $obj->pcfcd * $obj->comision_vendedor / 100;
  }
  
  
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
  
  
  public function transmitir($sql_texto, $id_sucursal = null, $descrip = "") {
  	if (is_null($id_sucursal)) {
  		foreach ($this->arraySucursal as $sucursal) {
  			if ($sucursal->id_sucursal != $this->rowParamet->id_sucursal) {
  				$sql = "INSERT transmision SET id_sucursal='" . $sucursal->id_sucursal . "', descrip='" . $descrip . "', sql_texto='" . mysql_real_escape_string($sql_texto, $this->link1) . "'";
  				$this->sql_query($sql, $this->link1);
  			}
  		}
  	} else {
		$sql = "INSERT transmision SET id_sucursal='" . $id_sucursal . "', descrip='" . $descrip . "', sql_texto='" . mysql_real_escape_string($sql_texto, $this->link1) . "'";
  		$this->sql_query($sql, $this->link1);
  	}
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