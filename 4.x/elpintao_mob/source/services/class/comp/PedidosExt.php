<?php

require("Base.php");

class class_PedidosExt extends class_Base
{
  function __construct() {
    parent::__construct();
  }


  public function method_leer_backup($params, $error) {
 	
  	$handle = fopen("backupNPE.dat", "r");
  	return json_decode(fgets($handle));
  }
  
  
  public function method_escribir_backup($params, $error) {
  	$p = $params[0];
  	
  	$handle = fopen("backupNPE.dat", "w");
  	fwrite($handle, json_encode($p));
  	fclose($handle);
  }


  public function method_recibir_pedido($params, $error) {
  	$p = $params[0];
  	
	$sql = "UPDATE pedido_ext SET recibido = TRUE, fecha_recibido= NOW() WHERE id_pedido_ext='" . $p->id_pedido_ext . "'";
	mysql_query($sql);
	
	$sql = "INSERT stock_log SET descrip='PedidosExt.method_recibir_pedido_mobile', sql_texto='" . mysql_real_escape_string($sql) . "', fecha=NOW()";
	mysql_query($sql);
  	
	foreach ($p->detalle as $item) {
		$sql = "UPDATE stock SET stock = stock + " . $item->total . " WHERE id_sucursal=" . $this->rowParamet->id_sucursal . " AND id_producto_item=" . $item->id_producto_item . "";
		mysql_query($sql);
		
		$sql = "INSERT stock_log SET descrip='PedidosExt.method_recibir_pedido_mobile', sql_texto='" . mysql_real_escape_string($sql) . "', fecha=NOW()";
		mysql_query($sql);
		
		$sql = "INSERT pedido_ext_recibido SET id_pedido_ext = '" . $item->id_pedido_ext . "', id_producto_item = '" . $item->id_producto_item . "', cantidad = '" . $item->total . "'";
		mysql_query($sql);
	}
  }


  public function method_alta_pedido_ext($params, $error) {
  	$p = $params[0];

  	$set = $this->prepararCampos($p->model);
  	
  	mysql_query("START TRANSACTION");
  	
	$sql = "INSERT pedido_ext SET " . $set . ", id_fabrica='" . $p->id_fabrica . "', fecha = NOW(), recibido = FALSE";
	mysql_query($sql);
	$insert_id = mysql_insert_id();
	
	foreach ($p->detalle as $item) {
		if ($item->cantidad > 0) {
			$sql = "INSERT pedido_ext_detalle SET id_pedido_ext = '" . $insert_id . "', id_producto_item = '" . $item->id_producto_item . "', cantidad = '" . $item->cantidad . "'";
			mysql_query($sql);
			
			foreach ($item->detallePedInt as $item2) {
				$sql = "UPDATE pedido_suc_detalle SET id_pedido_ext='" . $insert_id . "' WHERE id_pedido_suc_detalle='" . $item2->id_pedido_suc_detalle . "'";
				mysql_query($sql);
			}
		}
	}
	
	mysql_query("COMMIT");

  	$handle = fopen("backupNPE.dat", "w");
  	fwrite($handle, json_encode(null));
  	fclose($handle);
	
	//$resultado = $this->method_leer_pedido($params, $error);
	
	//return $resultado;
  }

  public function method_leer_pedido($params, $error) {
	$resultado = "";
	$resultado->internos = $this->method_leer_internos($params, $error);
	$resultado->externos = $this->method_leer_externos($params, $error);
	
	return $resultado;
  }
  
  
  public function method_buscar_producto_item($params, $error) {
  	$p = $params[0];
	$resultado = array();
	
	$sql = "SELECT producto_item.id_producto_item, producto_item.capacidad, producto_item.id_color, color.descrip AS color, unidad.descrip AS unidad";
	$sql.= " FROM ((producto_item INNER JOIN color USING (id_color)) INNER JOIN unidad USING (id_unidad))";
	$sql.= " WHERE producto_item.activo AND producto_item.id_producto=" . $p->id_producto;
	$sql.= " ORDER BY color, unidad, capacidad";
	
	
	$id_color = null;
	$item = null;
	
	$rs = mysql_query($sql);
	while ($row = mysql_fetch_object($rs)) {
		$aux = new stdClass;
		$aux->id_producto_item = $row->id_producto_item;
		$aux->unidad = $row->unidad;
		$aux->capacidad = (float) $row->capacidad;
		$aux->acumulado = 0;
		$aux->detallePedInt = $this->toJson("SELECT id_pedido_suc_detalle, descrip, SUM(cantidad) AS cantidad, sucursal.id_sucursal FROM (pedido_suc_detalle INNER JOIN pedido_suc USING(id_pedido_suc)) INNER JOIN sucursal USING(id_sucursal) WHERE id_producto_item = '" . $row->id_producto_item . "' AND id_pedido_ext=0 GROUP BY id_sucursal ORDER BY descrip");
		foreach ($aux->detallePedInt as $rowPS) {
			$rowPS->cantidad = (float) $rowPS->cantidad;
			$aux->acumulado = $aux->acumulado + $rowPS->cantidad;
		}

		if ($id_color == $row->id_color) {
			$item->presenta[] = $aux;
		} else {
			if (! is_null($item)) $resultado[] = $item;

			$item = new stdClass;
			$item->color = $row->color;
			$item->presenta = array();
			$item->presenta[] = $aux;
			
			$id_color = $row->id_color;
		}
	}
	
	$resultado[] = $item;

	return $resultado;
  }
  
  
  public function method_leer_generado($params, $error) {
  	$p = $params[0];
  	
	$resultado = array();
	$id = array();
	
	foreach ($p->ingresos as $id_producto => $value1) {
		foreach ($value1->items as $id_producto_item => $value2) {
			$id[] = $id_producto_item;
		}
	}
	
	$sql="SELECT producto.id_producto, producto.id_fabrica, producto_item.id_producto_item, fabrica.descrip AS fabrica, producto.descrip AS producto, color.descrip AS color, producto_item.capacidad AS capacidad, unidad.descrip AS unidad FROM (((producto INNER JOIN fabrica USING(id_fabrica)) INNER JOIN producto_item USING(id_producto)) INNER JOIN color USING(id_color)) INNER JOIN unidad USING(id_unidad) WHERE id_producto_item IN(" . implode(", ", $id) . ") ORDER BY fabrica, producto, color, unidad, capacidad";
	$rs = mysql_query($sql);
	
	while ($row = mysql_fetch_object($rs)) {
		$row->capacidad = (float) $row->capacidad;
		$row->cantidad = $p->ingresos->{$row->id_producto}->items->{$row->id_producto_item}->cantidad;
		$row->detallePedInt = $p->ingresos->{$row->id_producto}->items->{$row->id_producto_item}->detallePedInt;
		
		$resultado[] = $row;
	}

	return $resultado;
  }
  
  
  public function method_leer_externos($params, $error) {
  	$opciones = new stdClass;
  	$opciones->recibido = "bool";
  	
	$sql = "SELECT pedido_ext.*, fabrica.descrip AS fabrica FROM pedido_ext INNER JOIN fabrica USING(id_fabrica) ORDER BY fecha DESC";
	return $this->toJson($sql, $opciones);
  }
  
  
  public function method_leer_externo_detalle($params, $error) {
  	$p = $params[0];
  	
	function functionAux(&$row, $key) {
		$row->capacidad = (float) $row->capacidad;
		$row->cantidad = (float) $row->cantidad;
		$row->ingresar = 0;
		$row->total = 0;
	};
  	
  	$opciones = new stdClass;
  	$opciones->functionAux = functionAux;
		
	$sql = "SELECT pedido_ext_detalle.*, producto_item.id_unidad, producto_item.capacidad, producto.descrip AS producto, color.descrip AS color, unidad.descrip AS unidad";
	$sql.= " FROM ((((pedido_ext_detalle INNER JOIN producto_item USING (id_producto_item)) INNER JOIN producto USING(id_producto)) INNER JOIN color USING (id_color)) INNER JOIN unidad USING (id_unidad))";
	$sql.= " WHERE pedido_ext_detalle.id_pedido_ext=" . $p->id_pedido_ext;

	return $this->toJson($sql, $opciones);
  }
  
  
  public function method_leer_externo_recibido($params, $error) {
  	$p = $params[0];
  	
	$resultado = array();
	
	$sql="SELECT pedido_ext.*, fabrica.descrip AS fabrica, transporte.descrip AS transporte FROM (pedido_ext INNER JOIN fabrica USING(id_fabrica)) INNER JOIN transporte USING(id_transporte) ORDER BY fecha DESC";
	$rsPedido = mysql_query($sql);
	while ($regPedido = mysql_fetch_object($rsPedido)) {
		$regPedido->recibido = (bool) $regPedido->recibido;
		$regPedido->detalle = array();
		
		$sql="SELECT pedido_ext_detalle.id_pedido_ext_detalle, pedido_ext_detalle.id_pedido_ext, pedido_ext_detalle.cantidad, producto_item.id_producto_item, producto_item.cod_interno, producto_item.id_unidad, producto_item.precio_lista, producto.descrip AS producto, producto.iva, producto_item.capacidad, color.descrip AS color, unidad.descrip AS unidad";
		$sql.=" FROM ((((pedido_ext_detalle INNER JOIN producto_item USING (id_producto_item)) INNER JOIN producto USING(id_producto)) INNER JOIN color USING (id_color)) INNER JOIN unidad USING (id_unidad))";
		$sql.=" WHERE pedido_ext_detalle.id_pedido_ext='" . $regPedido->id_pedido_ext . "'";
		$rs = mysql_query($sql);
		while ($row = mysql_fetch_object($rs)) {
			$row->capacidad = (float) $row->capacidad;
			$row->precio_lista = (float) $row->precio_lista;
			$row->plmasiva = $row->precio_lista + ($row->precio_lista * (float) $row->iva / 100);
			$row->cantidad = (float) $row->cantidad;
			$row->ingresar = 0;
			$row->total = 0;
			$regPedido->detalle[] = $row;
		}
		
		
		$regPedido->recibidos = array();
		$sql="SELECT pedido_ext_recibido.cantidad, producto_item.id_producto_item, producto_item.id_unidad, producto_item.precio_lista, producto.descrip AS producto, producto.iva, producto_item.capacidad, color.descrip AS color, unidad.descrip AS unidad";
		$sql.=" FROM ((((pedido_ext_recibido INNER JOIN producto_item USING (id_producto_item)) INNER JOIN producto USING(id_producto)) INNER JOIN color USING (id_color)) INNER JOIN unidad USING (id_unidad))";
		$sql.=" WHERE pedido_ext_recibido.id_pedido_ext='" . $regPedido->id_pedido_ext . "'";
		$rs = mysql_query($sql);
		while ($row = mysql_fetch_object($rs)) {
			$row->capacidad = (float) $row->capacidad;
			$row->cantidad = (float) $row->cantidad;
			$regPedido->recibidos[] = $row;
		}
		
		
		$resultado[] = $regPedido;
	}
	return $resultado;
  }
}

?>