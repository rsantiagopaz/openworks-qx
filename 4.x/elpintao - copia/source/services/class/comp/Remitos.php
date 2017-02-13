<?php

session_start();

require($_SESSION['services_require'] . "Base.php");

class class_Remitos extends class_Base
{
  function __construct() {
    parent::__construct();
  }
  
  
  public function method_alta_modifica_remito_rec($params, $error) {
  	$p = $params[0];
  	
  	$resultado = $p->id_remito;
  	
	if ($p->id_remito == "0") {
		$sql="INSERT remito_rec SET nro_remito='" . $p->nro_remito . "', tipo=0, id_sucursal_de=" . $p->id_sucursal . ", destino='" . $p->destino . "', fecha=NOW(), id_usuario_transporta=0, estado='R'";
		mysql_query($sql);
		$resultado = mysql_insert_id();
	} else {
		$sql="UPDATE remito_rec SET nro_remito='" . $p->nro_remito . "', id_sucursal_de=" . $p->id_sucursal . ", destino='" . $p->destino . "' WHERE id_remito_rec=" . $resultado;
		mysql_query($sql);
		
		$sql="DELETE FROM remito_rec_detalle WHERE id_remito_rec=" . $resultado;
		mysql_query($sql);
	}
	foreach ($p->detalle as $item) {
		$sql="INSERT remito_rec_detalle SET id_remito_rec=" . $resultado . ", id_producto_item=" . $item->id_producto_item . ", cantidad=" . $item->cantidad;
		mysql_query($sql);
	}
	
	return $resultado;
  }
  
  
  
  public function method_alta_modifica_remito_emi($params, $error) {
  	$p = $params[0];
  	
  	$resultado = $p->id_remito;
  	
	if ($p->id_remito == "0") {
		$sql="INSERT remito_emi SET nro_remito='', tipo=2, id_sucursal_para=" . $p->id_sucursal . ", destino='" . $p->destino . "', fecha=NOW(), json='{}', estado='R'";
		mysql_query($sql);
		$resultado = mysql_insert_id();
	} else {
		$sql="UPDATE remito_emi SET id_sucursal_para=" . $p->id_sucursal . ", destino='" . $p->destino . "' WHERE id_remito_emi=" . $resultado;
		mysql_query($sql);
		
		$sql="DELETE FROM remito_emi_detalle WHERE id_remito_emi=" . $resultado;
		mysql_query($sql);
	}
	foreach ($p->detalle as $item) {
		$sql="INSERT remito_emi_detalle SET id_remito_emi=" . $resultado . ", id_producto_item=" . $item->id_producto_item . ", cantidad=" . $item->cantidad;
		mysql_query($sql);
	}
	
	return $resultado;
  }
  
  
  public function method_autorizar_remito_rec($params, $error) {
  	$p = $params[0];
  	
  	$resultado = new stdClass;
  	$resultado->error = array();
  	
  	
	$sql="SELECT estado FROM remito_rec WHERE id_remito_rec=" . $p->id_remito;
	$rs = mysql_query($sql);
  	$row = mysql_fetch_object($rs);
  	if ($row->estado == "R") {
		$sql="SELECT * FROM usuario WHERE nick='" . $p->model->autoriza . "' AND password=MD5('" . $p->model->autoriza_pass . "')";
		$rsAutoriza = mysql_query($sql);
		if (mysql_num_rows($rsAutoriza) != 1) {
			$item = new stdClass();
			$item->descrip = "autoriza";
			$item->message = " Usuario y/o contraseña incorrecta ";
			$resultado->error[] = $item;
		}
		
		if (is_null($p->model->transporta)) {
			$rowTransporta = new stdClass;
			$rowTransporta->id_usuario = "0";
		} else {
			if ($p->id_usuario_transporta=="0") {
				$sql="SELECT * FROM usuario WHERE nick='" . $p->model->transporta . "' AND password=MD5('" . $p->model->transporta_pass . "')";
			} else {
				$sql="SELECT usuario.* FROM usuario INNER JOIN remito_rec ON usuario.id_usuario=remito_rec.id_usuario_transporta WHERE remito_rec.id_remito_rec='" . $p->id_remito . "' AND usuario.nick='" . $p->model->transporta . "' AND usuario.password=MD5('" . $p->model->transporta_pass . "')";
			}
			$rsTransporta = mysql_query($sql);
			if (mysql_num_rows($rsTransporta) != 1) {
				$item = new stdClass();
				$item->descrip = "transporta";
				$item->message = " Usuario y/o contraseña incorrecta ";
				$resultado->error[] = $item;
			}  else $rowTransporta = mysql_fetch_object($rsTransporta);
		}
		
		if (empty($resultado->error)) {
			$rowAutoriza = mysql_fetch_object($rsAutoriza);
			
			mysql_query("START TRANSACTION");
			
			$sql="UPDATE remito_rec SET fecha=NOW(), id_usuario_autoriza_rec='" . $rowAutoriza->id_usuario . "', id_usuario_transporta='" . $rowTransporta->id_usuario . "', estado='A' WHERE id_remito_rec=" . $p->id_remito;
			mysql_query($sql);
			
			$sql = "INSERT stock_log SET descrip='Remitos.method_autorizar_remito_rec', sql_texto='" . mysql_real_escape_string($sql) . "', fecha=NOW()";
			mysql_query($sql);
			
			$detalle = $this->toJson("SELECT id_producto_item, cantidad FROM remito_rec_detalle WHERE id_remito_rec='" . $p->id_remito . "'");
			foreach ($detalle as $item) {
				$sql="UPDATE stock SET stock = stock + " . $item->cantidad . ", transmitir = TRUE WHERE id_sucursal=" . $this->rowParamet->id_sucursal . " AND id_producto_item=" . $item->id_producto_item . "";
				mysql_query($sql);
				
				$sql = "INSERT stock_log SET descrip='Remitos.method_autorizar_remito_rec', sql_texto='" . mysql_real_escape_string($sql) . "', fecha=NOW()";
				mysql_query($sql);
			}
			
			mysql_query("COMMIT");
		}
  	} else {
		$item = new stdClass();
		$item->descrip = "autorizado";
		$item->message = " El remito seleccionado ya fué autorizado. ";
		$resultado->error[] = $item;
  	}
	
	return $resultado;
  }
  
  
  public function method_autorizar_remito_emi($params, $error) {
  	$p = $params[0];
  	
  	$resultado = new stdClass;
  	$resultado->error = array();
  	
	$sql="SELECT estado FROM remito_emi WHERE id_remito_emi=" . $p->id_remito;
	$rs = mysql_query($sql);
  	$row = mysql_fetch_object($rs);
  	if ($row->estado == "R") {
		$sql="SELECT id_usuario FROM usuario WHERE nick='" . $p->model->autoriza . "' AND password=MD5('" . $p->model->autoriza_pass . "')";
		$rsAutoriza = mysql_query($sql);
		if (mysql_num_rows($rsAutoriza) != 1) {
			$item = new stdClass();
			$item->descrip = "autoriza";
			$item->message = " Usuario y/o contraseña incorrecta ";
			$resultado->error[] = $item;
		}
		
		if (is_null($p->model->transporta)) {
			$rowTransporta = new stdClass;
			$rowTransporta->id_usuario = "0";
		} else {
			$sql="SELECT id_usuario FROM usuario WHERE nick='" . $p->model->transporta . "' AND password=MD5('" . $p->model->transporta_pass . "')";
			$rsTransporta = mysql_query($sql);
			if (mysql_num_rows($rsTransporta) != 1) {
				$item = new stdClass();
				$item->descrip = "transporta";
				$item->message = " Usuario y/o contraseña incorrecta ";
				$resultado->error[] = $item;
			} else $rowTransporta = mysql_fetch_object($rsTransporta);
		}
		
		//if (mysql_num_rows($rsAutoriza) == 1 && (is_null($p->model->transporta) || mysql_num_rows($rsTransporta) == 1)) {
		if (empty($resultado->error)) {
			$rowAutoriza = mysql_fetch_object($rsAutoriza);
			
			$sql="SELECT * FROM remito_emi WHERE id_remito_emi=" . $p->id_remito;
			$rsRemito_emi = mysql_query($sql);
			$rowRemito_emi = mysql_fetch_object($rsRemito_emi);
			
			$nro_remito = str_pad((string) $this->rowParamet->nro_sucursal, 4, "0", STR_PAD_LEFT) . "-" . str_pad((string) $this->rowParamet->nro_remito + 1, 8, "0", STR_PAD_LEFT);
			$fecha = date("Y-m-d H:i:s");
			
			mysql_query("START TRANSACTION");
			
			$sql="UPDATE remito_emi SET nro_remito='" . $nro_remito . "', fecha='" . $fecha . "', id_usuario_autoriza_emi='" . $rowAutoriza->id_usuario . "', id_usuario_transporta='" . $rowTransporta->id_usuario . "', estado='A' WHERE id_remito_emi='" . $p->id_remito . "'";
			mysql_query($sql);
			
			$sql = "INSERT stock_log SET descrip='Remitos.method_autorizar_remito_emi', sql_texto='" . mysql_real_escape_string($sql) . "', fecha=NOW()";
			mysql_query($sql);
			
			if ($rowRemito_emi->id_sucursal_para != "0") {
				$sql = "INSERT remito_rec SET nro_remito='" . $nro_remito . "', tipo='" . $rowRemito_emi->tipo . "', id_sucursal_de='" . $this->rowParamet->id_sucursal . "', fecha='" . $fecha . "', id_usuario_autoriza_emi='" . $rowAutoriza->id_usuario . "', id_usuario_transporta='" . $rowTransporta->id_usuario . "', estado='R'";
				$this->transmitir($sql, $rowRemito_emi->id_sucursal_para);
				$sql = "SET @id_remito_rec = LAST_INSERT_ID()";
				$this->transmitir($sql, $rowRemito_emi->id_sucursal_para);
				
				$json = json_decode($rowRemito_emi->json);
				if (! is_null($json->id_pedido_int)) {
					foreach ($json->id_pedido_int as $id_pedido_int) {
						$sql = "UPDATE pedido_int_remito_rec SET id_remito_rec=@id_remito_rec WHERE id_pedido_int=" . $id_pedido_int . " AND id_sucursal=" . $this->rowParamet->id_sucursal . "";
						$this->transmitir($sql, $rowRemito_emi->id_sucursal_para);
					}
				}
			}
			
			
			$detalle = $this->toJson("SELECT id_producto_item, cantidad FROM remito_emi_detalle WHERE id_remito_emi='" . $p->id_remito . "'");
			foreach ($detalle as $item) {
				$sql="UPDATE stock SET stock = stock - " . $item->cantidad . ", transmitir = TRUE WHERE id_sucursal=" . $this->rowParamet->id_sucursal . " AND id_producto_item=" . $item->id_producto_item . "";
				mysql_query($sql);
				
				$sql = "INSERT stock_log SET descrip='Remitos.method_autorizar_remito_emi', sql_texto='" . mysql_real_escape_string($sql) . "', fecha=NOW()";
				mysql_query($sql);
				
				if ($rowRemito_emi->id_sucursal_para != "0") {
					$sql = "INSERT remito_rec_detalle SET id_remito_rec=@id_remito_rec, id_producto_item=" . $item->id_producto_item . ", cantidad=" . $item->cantidad . "";
					$this->transmitir($sql, $rowRemito_emi->id_sucursal_para);
				}
			}
			
			$sql="UPDATE paramet SET nro_remito=nro_remito + 1 WHERE id_paramet=1";
			mysql_query($sql);
			
			mysql_query("COMMIT");
		}
  	} else {
		$item = new stdClass();
		$item->descrip = "autorizado";
		$item->message = " El remito seleccionado ya fué autorizado. ";
		$resultado->error[] = $item;
  	}
	
	return $resultado;
  }
  
  
  public function method_leer_remitos_rec($params, $error) {
  	$p = $params[0];
  	
  	$resultado = array();
  	
	$sql = "SELECT remito_rec.*, CASE WHEN id_sucursal_de<>0 THEN sucursal.descrip ELSE remito_rec.destino END AS destino_descrip, CASE remito_rec.estado WHEN 'R' THEN 'Registrado' ELSE 'Autorizado' END AS estado_descrip FROM remito_rec LEFT JOIN sucursal ON remito_rec.id_sucursal_de=sucursal.id_sucursal";
	
	if ($p->ver == "Registrado") {
		$sql.= " WHERE estado='R'";
	} else if ($p->ver == "Autorizado") {
		$sql.= " WHERE estado='A'";
	}
	
	$sql.= " ORDER BY id_remito_rec DESC";
	
	$rsRemito = mysql_query($sql);
	while ($rowRemito = mysql_fetch_object($rsRemito)) {
		if (empty($rowRemito->id_usuario_autoriza_rec)) {
			$rowRemito->autoriza = "";
		} else {
			$sql= "SELECT nick FROM usuario WHERE id_usuario=" . $rowRemito->id_usuario_autoriza_rec;
			$rs = mysql_query($sql);
			$row = mysql_fetch_object($rs);
			$rowRemito->autoriza = $row->nick;
		}
		if (empty($rowRemito->id_usuario_transporta)) {
			$rowRemito->transporta = "";
		} else {
			$sql= "SELECT nick FROM usuario WHERE id_usuario=" . $rowRemito->id_usuario_transporta;
			$rs = mysql_query($sql);
			$row = mysql_fetch_object($rs);
			$rowRemito->transporta = $row->nick;
		}
		
		//$opciones = array("cantidad"=>"float", "capacidad"=>"float");
		//$sql="SELECT remito_rec_detalle.*, fabrica.descrip AS fabrica, producto.descrip AS producto, producto_item.capacidad, color.descrip AS color, unidad.descrip AS unidad FROM ((((remito_rec_detalle INNER JOIN producto_item USING(id_producto_item)) INNER JOIN producto USING(id_producto)) INNER JOIN fabrica USING(id_fabrica)) INNER JOIN color USING (id_color)) INNER JOIN unidad USING (id_unidad) WHERE id_remito_rec='" . $rowRemito->id_remito_rec . "'";
		//$rowRemito->detalle = $this->toJson(mysql_query($sql), $opciones);
		
		$resultado[] = $rowRemito;
	}
	
	return $resultado;
  }
  
  
  public function method_leer_remitos_rec_detalle($params, $error) {
  	$p = $params[0];
  	
	$opciones = array("cantidad"=>"float", "capacidad"=>"float");
	$sql="SELECT remito_rec_detalle.*, fabrica.descrip AS fabrica, producto.descrip AS producto, producto_item.capacidad, color.descrip AS color, unidad.descrip AS unidad FROM ((((remito_rec_detalle INNER JOIN producto_item USING(id_producto_item)) INNER JOIN producto USING(id_producto)) INNER JOIN fabrica USING(id_fabrica)) INNER JOIN color USING (id_color)) INNER JOIN unidad USING (id_unidad) WHERE id_remito_rec='" . $p->id_remito_rec . "'";
	return $this->toJson(mysql_query($sql), $opciones);
  }
  
  
  public function method_leer_remitos_emi($params, $error) {
  	$p = $params[0];
  	
  	$resultado = array();
  	
	$sql = "SELECT remito_emi.*, CASE WHEN id_sucursal_para<>0 THEN sucursal.descrip ELSE remito_emi.destino END AS destino_descrip, CASE remito_emi.estado WHEN 'R' THEN 'Registrado' ELSE 'Autorizado' END AS estado_descrip FROM remito_emi LEFT JOIN sucursal ON remito_emi.id_sucursal_para=sucursal.id_sucursal";

	if ($p->ver == "Registrado") {
		$sql.= " WHERE estado='R'";
	} else if ($p->ver == "Autorizado") {
		$sql.= " WHERE estado='A'";
	}
	
	$sql.= " ORDER BY id_remito_emi DESC";


	$rsRemito = mysql_query($sql);
	while ($rowRemito = mysql_fetch_object($rsRemito)) {
		if (empty($rowRemito->id_usuario_autoriza_emi)) {
			$rowRemito->autoriza = "";
		} else {
			$sql= "SELECT nick FROM usuario WHERE id_usuario=" . $rowRemito->id_usuario_autoriza_emi;
			$rs = mysql_query($sql);
			$row = mysql_fetch_object($rs);
			$rowRemito->autoriza = $row->nick;
		}
		if (empty($rowRemito->id_usuario_transporta)) {
			$rowRemito->transporta = "";
		} else {
			$sql= "SELECT nick FROM usuario WHERE id_usuario=" . $rowRemito->id_usuario_transporta;
			$rs = mysql_query($sql);
			$row = mysql_fetch_object($rs);
			$rowRemito->transporta = $row->nick;
		}
		
		//$opciones = array("cantidad"=>"float", "capacidad"=>"float");
		//$sql="SELECT remito_emi_detalle.*, fabrica.descrip AS fabrica, producto.descrip AS producto, producto_item.capacidad, color.descrip AS color, unidad.descrip AS unidad FROM ((((remito_emi_detalle INNER JOIN producto_item USING(id_producto_item)) INNER JOIN producto USING(id_producto)) INNER JOIN fabrica USING(id_fabrica)) INNER JOIN color USING (id_color)) INNER JOIN unidad USING (id_unidad) WHERE id_remito_emi='" . $rowRemito->id_remito_emi . "'";
		//$rowRemito->detalle = $this->toJson(mysql_query($sql), $opciones);
		
		$resultado[] = $rowRemito;
	}
	
	return $resultado;
  }
  
  
  public function method_leer_remitos_emi_detalle($params, $error) {
  	$p = $params[0];
  	
	$opciones = array("cantidad"=>"float", "capacidad"=>"float");
	$sql="SELECT remito_emi_detalle.*, fabrica.descrip AS fabrica, producto.descrip AS producto, producto_item.capacidad, color.descrip AS color, unidad.descrip AS unidad FROM ((((remito_emi_detalle INNER JOIN producto_item USING(id_producto_item)) INNER JOIN producto USING(id_producto)) INNER JOIN fabrica USING(id_fabrica)) INNER JOIN color USING (id_color)) INNER JOIN unidad USING (id_unidad) WHERE id_remito_emi='" . $p->id_remito_emi . "'";
	return $this->toJson(mysql_query($sql), $opciones);
  }
  
  
  public function method_autocompletarUsuario($params, $error) {
  	$p = $params[0];
  	set_time_limit(120);
  	
  	if (is_numeric($p->texto)) {
		$sql = "SELECT CONCAT(nro_vendedor, ' (', TRIM(nick), ')') AS label, nick AS model FROM usuario WHERE nro_vendedor LIKE '" . $p->texto . "%' ORDER BY label";
  	} else {
  		$sql = "SELECT CONCAT(TRIM(nick), ' (', nro_vendedor, ')') AS label, nick AS model FROM usuario WHERE nick LIKE '%" . $p->texto . "%' ORDER BY label";
  	}
	return $this->toJson($sql);
  }
}

?>