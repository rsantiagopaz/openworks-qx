<?php

require("Base.php");

class class_Proforma extends class_Base
{
  function __construct() {
    parent::__construct();
  }
  
  
  public function method_leer_pagos($params, $error) {
  	$p = $params[0];
  	
  	$resultado = new stdClass;
  	$resultado->operacion_producto_item = array();
  	$resultado->pago_cli = array();
  	$resultado->pago_pro = array();
  	
	$item = new stdClass;
	$resto = 0;
	
	$sql = "SELECT * FROM operacion_producto_item WHERE id_operacion=" . $p->id_operacion . " ORDER BY producto, id_operacion_producto_item";
	$rs = mysql_query($sql);
	while ($row = mysql_fetch_object($rs)) {
		$row->precio = (float) $row->precio;
		$row->cotiza = (float) $row->cotiza;
		$row->precio_neto = (float) $row->precio_neto;
		$row->json = json_decode($row->json);
		
		$row->saldo_cli = $row->precio;
		$row->saldo_pro = $row->precio_neto;
		
		$row->estado_cli = "Pendiente";
		$row->bandera_cli = 1;
		
		$row->estado_pro = "Pendiente";
		$row->bandera_pro = 1;
		
		$item->{$row->id_operacion_producto_item} = $row;
		
		$resultado->operacion_producto_item[] = $row;
	}
	
	$sql = "SELECT pago.*, usuario.descrip AS usuario FROM pago INNER JOIN usuario USING(id_usuario) WHERE id_operacion=" . $p->id_operacion . " ORDER BY fecha";
	$rsPago = mysql_query($sql);
	while ($rowPago = mysql_fetch_object($rsPago)) {
		$rowPago->importe = (float) $rowPago->importe;
		$rowPago->operacion_producto_item = array();
		
		$resto = $rowPago->importe;
		
		$sql = "SELECT id_operacion_producto_item FROM pago_item WHERE id_pago=" . $rowPago->id_pago;
		$rsPago_item = mysql_query($sql);
		//$num_rows = mysql_num_rows($rsPago_item);
		while ($rowPago_item = mysql_fetch_object($rsPago_item)) {
			$id_operacion_producto_item = $rowPago_item->id_operacion_producto_item;
			$rowPago->operacion_producto_item[] = $rowPago_item;
			
			if ($rowPago->tipo == "C") {
				
				if ($resto >= $item->{$id_operacion_producto_item}->saldo_cli) {
					$resto -= $item->{$id_operacion_producto_item}->saldo_cli;
					$item->{$id_operacion_producto_item}->saldo_cli = 0;
				} else {
					$item->{$id_operacion_producto_item}->saldo_cli -= $resto;
					$resto = 0;
				}
				
				if ($item->{$id_operacion_producto_item}->saldo_cli == $item->{$id_operacion_producto_item}->precio) {
					$item->{$id_operacion_producto_item}->estado_cli = "Pendiente";
					$item->{$id_operacion_producto_item}->bandera_cli = 1;
				} else if ($item->{$id_operacion_producto_item}->saldo_cli == 0) {
					$item->{$id_operacion_producto_item}->estado_cli = "Pagado";
					$item->{$id_operacion_producto_item}->saldo_cli = null;
					$item->{$id_operacion_producto_item}->bandera_cli = 0;
				} else if ($item->{$id_operacion_producto_item}->saldo_cli < $item->{$id_operacion_producto_item}->precio) {
					$item->{$id_operacion_producto_item}->estado_cli = "Parcial";
					$item->{$id_operacion_producto_item}->bandera_cli = -1;
				}
			} else {
				
				if ($resto >= $item->{$id_operacion_producto_item}->saldo_pro) {
					$resto -= $item->{$id_operacion_producto_item}->saldo_pro;
					$item->{$id_operacion_producto_item}->saldo_pro = 0;
				} else {
					$item->{$id_operacion_producto_item}->saldo_pro -= $resto;
					$resto = 0;
				}
				
				if ($item->{$id_operacion_producto_item}->saldo_pro == $item->{$id_operacion_producto_item}->precio_neto) {
					$item->{$id_operacion_producto_item}->estado_pro = "Pendiente";
					$item->{$id_operacion_producto_item}->bandera_pro = 1;
				} else if ($item->{$id_operacion_producto_item}->saldo_pro == 0) {
					$item->{$id_operacion_producto_item}->estado_pro = "Pagado";
					$item->{$id_operacion_producto_item}->saldo_pro = null;
					$item->{$id_operacion_producto_item}->bandera_pro = 0;
				} else if ($item->{$id_operacion_producto_item}->saldo_pro < $item->{$id_operacion_producto_item}->precio_neto) {
					$item->{$id_operacion_producto_item}->estado_pro = "Parcial";
					$item->{$id_operacion_producto_item}->bandera_pro = -1;
				}
			}
		}
		
		if ($rowPago->tipo == "C") $resultado->pago_cli[] = $rowPago; else $resultado->pago_pro[] = $rowPago;
	}
	
  	return $resultado;
  }
  
  
  public function method_alerta_pago($params, $error) {
  	$p = $params[0];
  	
  	foreach ($p->operacion_producto_item as $item) {
  		if ($item->bandera_cli <= 0) {
			$sql = "SELECT * FROM alerta WHERE (tipo = 'F' OR tipo = 'C') AND id=" . $item->id_operacion_producto_item;
			$rs = mysql_query($sql);
			$row = mysql_fetch_object($rs);
			if ($row->fecha != $p->pago->fecha) {
				mysql_query("START TRANSACTION");
				
				$sql = "UPDATE alerta SET activo = FALSE WHERE id_alerta=" . $row->id_alerta;
				mysql_query($sql);
				
				$sql = "INSERT alerta SET";
				$sql.= "  descrip=''";
				$sql.= ", fecha='" . $p->pago->fecha . "'";
				$sql.= ", tipo='" . (($item->bandera_cli == 0) ? "C" : "F") . "'";
				$sql.= ", f_desde='" . $p->pago->fecha . "'";
				$sql.= ", id=" . $item->id_operacion_producto_item;
				$sql.= ", activo = TRUE";
				mysql_query($sql);
				
				mysql_query("COMMIT");
			}
  		}
  	}
  }
  
  
  public function method_agregar_referencia_operacion($params, $error) {
  	$p = $params[0];
  	
  	$p->model->json = json_encode($p->otros);
  	$set = $this->prepararCampos($p->model, "operacion_producto_item");
  	
  	$id_operacion_producto_item = $p->model->id_operacion_producto_item;
  	
  	mysql_query("START TRANSACTION");
  	
	if ($id_operacion_producto_item == "0") {
		$sql = "INSERT operacion_producto_item SET " . $set;
		mysql_query($sql);
		$id_operacion_producto_item = mysql_insert_id();
	} else {
		$sql = "UPDATE operacion_producto_item SET " . $set . " WHERE id_operacion_producto_item=" . $id_operacion_producto_item;
		mysql_query($sql);
	}
	
	mysql_query("COMMIT");
	
	return $id_operacion_producto_item;
  }
  
  
  /*
  public function method_leer_pagossssss($params, $error) {
  	$p = $params[0];
  	
  	$resultado = new stdClass;
  	$resultado->presupuesto_item = array();
  	$resultado->pago = array();
  	
	$pago = new stdClass;
	
	$sql = "SELECT * FROM pago WHERE id_operacion=" . $p->id_operacion . " ORDER BY fecha";
	$rsPago = mysql_query($sql);
	while ($rowPago = mysql_fetch_object($rsPago)) {
		$rowPago->importe = (float) $rowPago->importe;
		
		$pago->{$rowPago->id_pago} = $rowPago->importe;
		
		$sql = "SELECT id_presupuesto_item FROM pago_item WHERE id_pago=" . $rowPago->id_pago;
		$rowPago->presupuesto_item = $this->toJson($sql);
		
		$resultado->pago[] = $rowPago;
	}
  	
	$sql = "SELECT * FROM presupuesto_item WHERE id_proforma=" . $p->id_proforma . " ORDER BY id_presupuesto_item";
	$rs = mysql_query($sql);
	while ($row = mysql_fetch_object($rs)) {
		$row->precio = (float) $row->precio;
		$row->cotiza = (float) $row->cotiza;
		$row->falta = $row->precio;
		
		$sql = "SELECT pago.id_pago FROM pago INNER JOIN pago_item USING(id_pago) WHERE id_operacion=" . $p->id_operacion . " AND id_presupuesto_item=" . $row->id_presupuesto_item;
		$rsPago = mysql_query($sql);
		while ($rowPago = mysql_fetch_object($rsPago)) {
			if ($pago->{$rowPago->id_pago} >= $row->falta) {
				$pago->{$rowPago->id_pago} = $pago->{$rowPago->id_pago} - $row->falta;
				$row->falta = 0;
			} else {
				$row->falta = $row->falta - $pago->{$rowPago->id_pago};
				$pago->{$rowPago->id_pago} = 0;
			}
		}
		
		if ($row->falta == $row->precio) {
			$row->estado = "Pendiente";
			$row->bandera = 1;
		} else if ($row->falta == 0) {
			$row->estado = "Cancelado";
			$row->falta = null;
			$row->bandera = 0;
		} else if ($row->falta < $row->precio) {
			$row->estado = "Fijado";
			$row->bandera = -1;
		}
		
		$resultado->presupuesto_item[] = $row;
	}
	
  	return $resultado;
  }
  */
  
  
  public function method_grabar_pago($params, $error) {
  	$p = $params[0];
  	
  	$p->fecha = date("Y-m-d H:i:s");
  	$p->json = json_encode($p->json);
  	$set = $this->prepararCampos($p, "pago");
  	
  	mysql_query("START TRANSACTION");
  	
	$sql = "INSERT pago SET " . $set;
	mysql_query($sql);
	$insert_id = mysql_insert_id();
	
	foreach ($p->operacion_producto_item as $item) {
		$sql = "INSERT pago_item SET id_pago=" . $insert_id . ", id_operacion_producto_item=" . $item;
		mysql_query($sql);
	}

	mysql_query("COMMIT");
	
	/*
	$respuesta = $this->method_leer_pagos($params, $error);
	foreach ($respuesta->operacion_producto_item as $item) {
		if ($item->id_operacion_producto_item) {
			
		}
	}
	*/
	
	return $insert_id;
  }
  
  
  public function method_leer_operaciones($params, $error) {
  	$p = $params[0];
  	
  	$resultado = array();
  	
	$sql = "SELECT operacion.*, presupuesto.id_proforma FROM operacion INNER JOIN presupuesto USING(id_operacion) ORDER BY fecha DESC";
	$rs = mysql_query($sql);
	while ($row = mysql_fetch_object($rs)) {
		$row->cant_mayores = (int) $row->cant_mayores;
		$row->cant_menores = (int) $row->cant_menores;
		
		$sql = "SELECT apellido, nombre FROM operacion_cliente INNER JOIN cliente USING(id_cliente) WHERE id_operacion=" . $row->id_operacion;
		$rsCliente = mysql_query($sql);
		$rowCliente = mysql_fetch_object($rsCliente);
		
		$row->apellido = $rowCliente->apellido;
		$row->nombre = $rowCliente->nombre;
		$resultado[] = $row;
	}
	
  	return $resultado;
  }
  
  
  public function method_leer_datos_operacion_basicos($params, $error) {
  	$p = $params[0];
  	
  	$resultado = new stdClass;
  	$sql = "SELECT * FROM operacion WHERE id_operacion=" . $p->id_operacion;
	$rs = mysql_query($sql);
	$row = mysql_fetch_object($rs);
	$row->cant_mayores = (int) $row->cant_mayores;
	$row->cant_menores = (int) $row->cant_menores;
	$resultado->model = $row;
  	
  	
	$sql = "SELECT cliente.* FROM cliente INNER JOIN operacion_cliente USING(id_cliente) WHERE id_operacion=" . $p->id_operacion;
	$resultado->pasajero = $this->toJson($sql);
  	return $resultado;
  }
  
  
  public function method_escribir_operacion($params, $error) {
  	$p = $params[0];
  	
  	$fecha = date("Y-m-d H:i:s");
  	
  	mysql_query("START TRANSACTION");
  	
	if (is_null($p->id_operacion)) {
		$sql = "SELECT * FROM proforma WHERE id_proforma=" . $p->id_proforma;
		$rs = mysql_query($sql);
		$rowProforma = mysql_fetch_object($rs);		
		
		$sql = "SELECT * FROM presupuesto WHERE id_proforma=" . $p->id_proforma;
		$rs = mysql_query($sql);
		$rowPresupuesto = mysql_fetch_object($rs);
		
		$rowPresupuesto->cant_mayores = $p->cant_mayores;
		$rowPresupuesto->cant_menores = $p->cant_menores;
		$rowPresupuesto->fecha = $fecha;
		$rowPresupuesto->json = $rowProforma->json;
		$set = $this->prepararCampos($rowPresupuesto, "operacion");
		
		$sql = "INSERT operacion SET " . $set;
		mysql_query($sql);
		$id_operacion = mysql_insert_id();
		
		$sql = "SELECT * FROM presupuesto_item WHERE id_proforma=" . $p->id_proforma;
		$rs = mysql_query($sql);
		while ($row = mysql_fetch_object($rs)) {
			$row->id_operacion = $id_operacion;
			
			$set = $this->prepararCampos($row, "operacion_producto_item");
			$sql = "INSERT operacion_producto_item SET " . $set;
			mysql_query($sql);
		}
		
		$sql = "UPDATE presupuesto SET id_operacion=" . $id_operacion . " WHERE id_proforma=" . $p->id_proforma;
		mysql_query($sql);
	} else {
		$id_operacion = $p->id_operacion;
		
		$sql = "DELETE FROM operacion_cliente WHERE id_operacion=" . $id_operacion;
		mysql_query($sql);
	}
  	
	foreach ($p->model as $item) {
		$set = $this->prepararCampos($item, "cliente");
		
		if ($item->id_cliente == "0") {
			$sql = "INSERT cliente SET " . $set;
			mysql_query($sql);
			$id_cliente =  mysql_insert_id();
		} else {
			$sql = "UPDATE cliente SET " . $set . " WHERE id_cliente=" . $item->id_cliente;
			mysql_query($sql);
			$id_cliente =  $item->id_cliente;
		}
		
		if (! is_null($item->contacto)) {
			$sql = "DELETE FROM cliente_contacto WHERE id_cliente=" . $id_cliente;
			mysql_query($sql);
			foreach ($item->contacto as $contacto) {
				$sql = "INSERT cliente_contacto SET id_cliente=" . $id_cliente . ", tipo='" . $contacto->tipo . "', descrip='" . $contacto->descrip . "'";
				mysql_query($sql);
			}
		}
		
		$sql = "INSERT operacion_cliente SET id_operacion=" . $id_operacion . ", id_cliente=" . $id_cliente;
		mysql_query($sql);
	}
	
	mysql_query("COMMIT");
	
	return $id_operacion;
  }
  
  
  public function method_generar_presupuesto($params, $error) {
  	$p = $params[0];
  	
  	$date = date_create();
  	$fecha = $date->format("Y-m-d H:i:s");
  	
  	mysql_query("START TRANSACTION");
  	
	foreach ($p->model->json->producto as $key => $value) {
		foreach ($value->cod as $item) {
			$item->id_proforma = $p->id_proforma;
			$item->producto = $key;
			$item->json = json_encode($item->json);
			
			//$sql = "INSERT presupuesto_item SET id_proforma=" . $p->id_proforma . ", producto='" . $key . "', localizador='" . $item->localizador . "', descrip='" . $item->descrip . "', f_venc='" . $item->f_venc . "', precio='" . $item->precio . "', cotiza='" . $item->cotiza . "', comision='" . $item->comision . "', json='" . $item->json . "'";
			//mysql_query($sql);
			
			$set = $this->prepararCampos($item, "presupuesto_item");
			$sql = "INSERT presupuesto_item SET " . $set;
			mysql_query($sql);
		}
		
		//unset($value->cod);
	}
	
	//$p->model->json = json_encode($p->model->json);
	$p->model->fecha = $fecha;
	$p->model->id_proforma = $p->id_proforma;
	
	$set = $this->prepararCampos($p->model, "presupuesto");
	$sql = "INSERT presupuesto SET " . $set;
	mysql_query($sql);
	
	$sql = "UPDATE proforma SET presupuesto = TRUE WHERE id_proforma=" . $p->id_proforma;
	mysql_query($sql);

	
	$descrip = "Presupuesto asignado" . "<br/>";
	$descrip.= "Fecha: " . $fecha . "<br/>";
	$descrip.= "Usuario: " . $p->model->usuario . "<br/>";
	$descrip.= "Presupuesto: " . $p->model->archivo . "<br/>";
	
	$sql = "SELECT * FROM proforma WHERE id_proforma=" . $p->id_proforma;
	$rsPresupuesto = mysql_query($sql);
	$rowPresupuesto = mysql_fetch_object($rsPresupuesto);

	$descrip.= "Apellido: " . $rowPresupuesto->apellido . "<br/>";
	$descrip.= "Nombre: " . $rowPresupuesto->nombre . "<br/>";
	
	
	$date->add(new DateInterval("P1D"));
	$sql = "INSERT alerta SET fecha='" . $fecha . "', descrip='" . $descrip . "', tipo='P', f_desde='" . $date->format("Y-m-d H:i:s") . "', id=" . $p->id_proforma;
	mysql_query($sql);
	
	mysql_query("COMMIT");
  }
  
  
  public function method_leer_proforma($params, $error) {
  	$p = $params[0];
  	
  	$resultado = new stdClass;
  	
	$sql = "SELECT * FROM proforma WHERE id_proforma=" . $p->id_proforma;
	$rs = mysql_query($sql);
	$row = mysql_fetch_object($rs);
	$resultado->json = json_decode($row->json);
	unset($row->json);
	
	$row->cant_menores = (int) $row->cant_menores;
	$row->cant_mayores = (int) $row->cant_mayores;
	$row->presupuesto = (bool) $row->presupuesto;
	$resultado->model = $row;
	
	$sql = "SELECT * FROM proforma_contactar WHERE id_proforma=" . $p->id_proforma;
	$resultado->contactar = $this->toJson($sql);
	
	$sql = "SELECT token_destino.* FROM token_destino INNER JOIN proforma_token_destino USING(id_token_destino) WHERE id_proforma=" . $p->id_proforma;
	$resultado->destino = $this->toJson($sql);
	
	$sql = "SELECT token_motivo.* FROM token_motivo INNER JOIN proforma_token_motivo USING(id_token_motivo) WHERE id_proforma=" . $p->id_proforma;
	$resultado->motivo = $this->toJson($sql);
	
  	return $resultado;
  }
  
  
  public function method_nueva_proforma($params, $error) {
	$p = $params[0];
	
	$id_proforma = $p->model->id_proforma;
	
	mysql_query("START TRANSACTION");
	
	if ($id_proforma != "0") {
		$row = new stdClass;
		
		$sql = "SELECT * FROM proforma WHERE id_proforma=" . $id_proforma;
		$row->proforma = $this->toJson($sql);
		
		$sql = "SELECT * FROM proforma_contactar WHERE id_proforma=" . $id_proforma;
		$row->proforma_contactar = $this->toJson($sql);
		
		$sql = "SELECT * FROM proforma_token_destino WHERE id_proforma=" . $id_proforma;
		$row->proforma_token_destino = $this->toJson($sql);
		
		$sql = "SELECT * FROM proforma_token_motivo WHERE id_proforma=" . $id_proforma;
		$row->proforma_token_motivo = $this->toJson($sql);
		
		$sql = "INSERT proforma_historial SET id_proforma=" . $id_proforma . ", json='" . json_encode($row) . "'";
		mysql_query($sql);
		
		
		
		$sql = "DELETE FROM proforma_contactar WHERE id_proforma=" . $id_proforma;
		mysql_query($sql);
		
		$sql = "DELETE FROM proforma_token_destino WHERE id_proforma=" . $id_proforma;
		mysql_query($sql);
		
		$sql = "DELETE FROM proforma_token_motivo WHERE id_proforma=" . $id_proforma;
		mysql_query($sql);
	}
	
	$token_destino = new stdClass;
	$token_motivo = new stdClass;

	$p->model->fecha = date("Y-m-d H:i:s");
	$p->model->json = json_encode($p->model->json);
	
	$set = $this->prepararCampos($p->model, "proforma");
	
	if ($id_proforma == "0") {
		$sql = "INSERT proforma SET " . $set . ", presupuesto=FALSE";
		mysql_query($sql);

		$id_proforma = mysql_insert_id();
	} else {
		$sql = "UPDATE proforma SET " . $set . " WHERE id_proforma=" . $id_proforma;
		mysql_query($sql);
	}
	
	foreach ($p->token_destino as $item) {
		if ($item->id_token_destino=="nuevo") {
			$sql = "SELECT * FROM token_destino WHERE descrip='" . $item->descrip . "'";
			$rs = mysql_query($sql);
			if (mysql_num_rows($rs) == 0) {
				$sql = "INSERT token_destino SET descrip='" . $item->descrip . "'";
				mysql_query($sql);
				$item->id_token_destino = mysql_insert_id();
			} else {
				$row = mysql_fetch_object($rs);
				$item->id_token_destino = $row->id_token_destino;
			}
		}
		
		if (is_null($token_destino->{$item->id_token_destino})) {
			$sql = "INSERT proforma_token_destino SET id_proforma=" . $id_proforma . ", id_token_destino=" . $item->id_token_destino;
			mysql_query($sql);
			$token_destino->{$item->id_token_destino} = "grabado";
		}
	}
	
	foreach ($p->token_motivo as $item) {
		if ($item->id_token_motivo=="nuevo") {
			$sql = "SELECT * FROM token_motivo WHERE descrip='" . $item->descrip . "'";
			$rs = mysql_query($sql);
			if (mysql_num_rows($rs) == 0) {
				$sql = "INSERT token_motivo SET descrip='" . $item->descrip . "'";
				mysql_query($sql);
				$item->id_token_motivo = mysql_insert_id();
			} else {
				$row = mysql_fetch_object($rs);
				$item->id_token_motivo = $row->id_token_motivo;
			}
		}
		
		if (is_null($token_motivo->{$item->id_token_motivo})) {
			$sql = "INSERT proforma_token_motivo SET id_proforma=" . $id_proforma . ", id_token_motivo=" . $item->id_token_motivo;
			mysql_query($sql);
			$token_motivo->{$item->id_token_motivo} = "grabado";
		}
	}
	
	foreach ($p->contactar as $item) {
		$sql = "INSERT proforma_contactar SET id_proforma=" . $id_proforma . ", tipo='" . $item->tipo . "', descrip='" . $item->descrip . "'";
		mysql_query($sql);
	}
	
	mysql_query("COMMIT");
	
	return $id_proforma;
  }
  
  
  public function method_buscar_proforma_relacionada($params, $error) {
	$p = $params[0];
	
	$resultado = array();
	
	$sql = "SELECT DISTINCTROW proforma.*, usuario.descrip AS usuario FROM (proforma INNER JOIN usuario USING(id_usuario)) INNER JOIN proforma_contactar USING(id_proforma)";
	if (! is_null($p)) {
		$sql.= " WHERE id_proforma <> " . $p->id_proforma;
		
		if (empty($p->apellido)) {
			$sql.= " AND (FALSE";
		} else {
			$sql.= " AND ((apellido LIKE '%" . substr($p->apellido, 0, 3) . "%'";
			$p->nombre = explode(" ", $p->nombre);
			foreach ($p->nombre as $nombre) {
				if (!empty($nombre)) $sql.= " AND nombre LIKE '%" . $nombre . "%'";
			}
			$sql.= ")";
		}
		
		foreach ($p->contactar as $key => $value) {
			$p->contactar[$key] = $value->descrip;
		}
		$contactar = implode("', '", $p->contactar);
		$sql.= " OR proforma_contactar.descrip IN ('" . $contactar . "'))";
		 
	}
	$sql.= " ORDER BY fecha DESC";
	
	$rs = mysql_query($sql);
	while ($row = mysql_fetch_object($rs)) {
		$row->json = json_decode($row->json);
		$row->presupuesto = (bool) $row->presupuesto;
		$row->operacion = false;
		$row->cant_mayores = (int) $row->cant_mayores;
		$row->cant_menores = (int) $row->cant_menores;
		$row->archivo = "";
		
		if ($row->presupuesto) {
			$sql = "SELECT * FROM presupuesto WHERE id_proforma=" . $row->id_proforma;
			$rsPresupuesto = mysql_query($sql);
			$rowPresupuesto = mysql_fetch_object($rsPresupuesto);
			
			$row->archivo = $rowPresupuesto->archivo;
			$row->id_operacion = $rowPresupuesto->id_operacion;
			$row->operacion = ! is_null($row->id_operacion);
			$row->contacto = array();
			
  			$opciones = new stdClass;
  			$opciones->precio = "float";
  			$opciones->cotiza = "float";
  			
			foreach ($row->json->producto as $key => $value) {
				$sql = "SELECT * FROM presupuesto_item WHERE id_proforma=" . $row->id_proforma . " AND producto='" . $key . "' ORDER BY id_presupuesto_item";
				$row->json->producto->{$key}->cod = $this->toJson($sql, $opciones);
			}
		}
		
		$contactar = new stdClass;
		$contactar->C = "Celular";
		$contactar->E = "Email";
		$contactar->T = "Teléfono";
		
		$sql = "SELECT tipo, descrip FROM proforma_contactar WHERE id_proforma=" . $row->id_proforma;
		$rsContactar = mysql_query($sql);
		
		$row->contacto_html = '<table border="1" width="100%" cellpadding="2">';
		$row->contacto_html.= '<tr><th>Tiempo est.</th><td>' . $row->tiempo_estimado . '</td></tr>';
		$row->contacto_html.= '<tr><th>Cant.may.</th><td>' . $row->cant_mayores . '</td></tr>';
		$row->contacto_html.= '<tr><th>Cant.men.</th><td>' . $row->cant_menores . '</td></tr>';
		$row->contacto_html.= '<tr><th colspan="2">Contacto</th></tr>';
		$row->contacto_html.= '<tr><th>Horario</th><td>' . $row->horario_contactar . '</td></tr>';
		while ($rowContactar = mysql_fetch_object($rsContactar)) {
			$row->contacto[] = $rowContactar;
			$row->contacto_html.= '<tr><th>' . $contactar->{$rowContactar->tipo} . '</th><td>' . $rowContactar->descrip . '</td></tr>';
		}
		$row->contacto_html.= '</table>';
		
		$row->datos = '<table border="1" width="100%" cellpadding="2">';

		//$row->datos.= '<tr><td colspan="2">&nbsp;</td></tr>';
		$row->datos.= '<tr><th colspan="3">Productos</th></tr>';
		//$row->datos.= '<tr><td colspan="2">&nbsp;</td></tr>';
		
		
		$producto = new stdClass;
		$producto->{"0"} = "Aéreo";
		$producto->{"1"} = "Hoteles";
		$producto->{"2"} = "Autos";
		$producto->{"3"} = "Seguros";
		$producto->{"4"} = "Cruceros";
		$producto->{"5"} = "Paquetes";
		$producto->{"6"} = "Trenes";
		$producto->{"7"} = "Traslado";
		$producto->{"8"} = "Excursiones";
		$producto->{"9"} = "Servicios";
		
		
		foreach ($row->json->producto as $key => $value) {
			//$row->datos.= '<tr><th>' . $producto->{$key} . '</th><td>' . nl2br(rawurldecode($value->txt)) . '</td><td>' . nl2br(rawurldecode(json_encode($value->cod))) . '</td></tr>';
			
			
			$row->datos.= '<tr><th>' . $producto->{$key} . '</th><td>' . nl2br(rawurldecode($value->txt)) . '</td><td>';
			$row->datos.= '<table border="0" rules="all" width="100%">';
			if ($row->presupuesto) {
				foreach ($value->cod as $item) {
					$row->datos.= '<tr><td>' . rawurldecode($item->localizador) . '</td><td>' . rawurldecode($item->descrip) . '</td><td align="right">' . number_format($item->precio, 2, ",", ".") . '</td><td align="right">' . number_format($item->cotiza, 2, ",", ".") . '</td><td align="right">' . number_format($item->comision, 2, ",", ".") . '</td></tr>';
				}
			}
			$row->datos.= '</table>';
			$row->datos.= '</td></tr>';
		}

		$row->datos.= '</table>';

		
		$resultado[] = $row;
	}

	return $resultado;
  }
  
  
  public function method_leer_token_destino($params, $error) {
  	$p = $params[0];
  	
  	$resultado = array();
  	
	$sql = "SELECT * FROM token_destino WHERE descrip='" . $p->descrip . "'";
	$rs = mysql_query($sql);
	if (mysql_num_rows($rs) == 0) {
		$item = new stdClass;
		$item->id_token_destino = "nuevo";
		$item->descrip = $p->descrip;
		
		$resultado[] = $item;
	} else {
		$row = mysql_fetch_object($rs);
		
		$item = new stdClass;
		$item->id_token_destino = $row->id_token_destino;
		$item->descrip = $row->descrip;
		
		$resultado[] = $item;
	}
	
	$sql = "SELECT * FROM token_destino WHERE descrip LIKE '%" . $p->descrip . "%' ORDER BY descrip";
	$rs = mysql_query($sql);
	while ($row = mysql_fetch_object($rs)) {
		if ($row->descrip != $p->descrip) $resultado[] = $row;
	}
	
	return $resultado;
  }
  
  
  public function method_escribir_token_destino($params, $error) {
  	$p = $params[0];
  	
  	foreach ($p->data as $item) {
  		if ($item->id_token_destino == "nuevo") {
			$sql = "INSERT token_destino SET descrip='" . $item->descrip . "'";
			mysql_query($sql);
  		}
  	}
  }
  
  
  public function method_autocompletarCliente($params, $error) {
  	global $p, $contexto;
  	
  	$p = $params[0];
  	$contexto = $this;
  	
	function functionAux(&$row, $key) {
		global $p, $contexto;
		
		$row->model = $row->id_cliente;
		$row->contacto = $contexto->toJson("SELECT tipo, descrip FROM cliente_contacto WHERE id_cliente=" . $row->id_cliente);
		
		if (is_numeric($p->texto)) {
			if (! is_null(stripos($row->dni, $p->texto))) {
				$row->label = $row->dni . " (" . $row->apellido . ", " . $row->nombre . ((empty($row->cuit)) ? "" : ") (" . $row->cuit) . ")";
			} else {
				$row->label = $row->cuit . " (" . $row->apellido . ", " . $row->nombre . ((empty($row->dni)) ? "" : ") (" . $row->dni) . ")";
			}
		} else {
			$row->label = $row->apellido . ", " . $row->nombre . " (" . $row->dni . ((empty($row->cuit)) ? "" : ") (" . $row->cuit) . ")";
		}
	};
  	
  	$opciones = new stdClass;
  	$opciones->functionAux = functionAux;
  	
  	if (is_numeric($p->texto)) {
		$sql = "SELECT * FROM cliente WHERE dni LIKE '%" . $p->texto . "%' OR cuit LIKE '%" . $p->texto . "%' ORDER BY dni, cuit, apellido, nombre";
  	} else {
  		$sql = "SELECT * FROM cliente WHERE apellido LIKE '%" . $p->texto . "%' OR nombre LIKE '%" . $p->texto . "%' ORDER BY apellido, nombre, dni, cuit";
  	}
	return $this->toJson($sql, $opciones);
  }
  
  
  public function method_autocompletarUsuario($params, $error) {
  	$p = $params[0];
	$sql = "SELECT descrip AS label, id_usuario AS model, password FROM usuario WHERE descrip LIKE '%" . $p->texto . "%' ORDER BY label";
	return $this->toJson($sql);
  }
  
  
  public function method_leer_token_motivo($params, $error) {
  	$p = $params[0];
  	
  	$resultado = array();
  	
	$sql = "SELECT * FROM token_motivo WHERE descrip='" . $p->descrip . "'";
	$rs = mysql_query($sql);
	if (mysql_num_rows($rs) == 0) {
		$item = new stdClass;
		$item->id_token_motivo = "nuevo";
		$item->descrip = $p->descrip;
		
		$resultado[] = $item;
	} else {
		$row = mysql_fetch_object($rs);
		
		$item = new stdClass;
		$item->id_token_motivo = $row->id_token_motivo;
		$item->descrip = $row->descrip;
		
		$resultado[] = $item;
	}
	
	$sql = "SELECT * FROM token_motivo WHERE descrip LIKE '%" . $p->descrip . "%' ORDER BY descrip";
	$rs = mysql_query($sql);
	while ($row = mysql_fetch_object($rs)) {
		if ($row->descrip != $p->descrip) $resultado[] = $row;
	}
	
	return $resultado;
  }
  
  
  public function method_escribir_token_motivo($params, $error) {
  	$p = $params[0];
  	
  	foreach ($p->data as $item) {
  		if ($item->id_token_motivo == "nuevo") {
			$sql = "INSERT token_motivo SET descrip='" . $item->descrip . "'";
			mysql_query($sql);
  		}
  	}
  }
  
  
  public function method_cargar_presupuesto($params, $error) {
  	$p = $params[0];
  	
	$sql = "UPDATE presupuesto SET archivo='" . $p->archivo . "' WHERE id_proforma=" . $p->id_proforma;
	mysql_query($sql);
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  


}

?>