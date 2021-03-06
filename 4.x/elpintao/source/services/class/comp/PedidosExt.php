<?php

session_start();

require($_SESSION['services_require'] . "Base.php");

class class_PedidosExt extends class_Base
{
  function __construct() {
    parent::__construct();
  }
  
  
  public function method_autocompletarFabrica($params, $error) {
  	$p = $params[0];
  	set_time_limit(120);
  	
	$sql = "SELECT descrip AS label, id_fabrica AS model, fabrica.* FROM fabrica WHERE descrip LIKE '%" . $p->texto . "%' ORDER BY label";
	return $this->toJson($sql);
  }


  public function method_recibir_pedido($params, $error) {
  	$p = $params[0];
  	
	$sql = "UPDATE pedido_ext SET recibido = TRUE, fecha_recibido= NOW() WHERE id_pedido_ext='" . $p->id_pedido_ext . "'";
	mysql_query($sql);
	
	$sql = "INSERT stock_log SET descrip='PedidosExt.method_recibir_pedido', sql_texto='" . mysql_real_escape_string($sql) . "', fecha=NOW()";
	mysql_query($sql);
  	
	foreach ($p->detalle as $item) {
		$sql = "UPDATE stock SET stock = stock + " . $item->total . " WHERE id_sucursal=" . $this->rowParamet->id_sucursal . " AND id_producto_item=" . $item->id_producto_item . "";
		mysql_query($sql);
		
		$sql = "INSERT stock_log SET descrip='PedidosExt.method_recibir_pedido', sql_texto='" . mysql_real_escape_string($sql) . "', fecha=NOW()";
		mysql_query($sql);
		
		$sql = "INSERT pedido_ext_recibido SET id_pedido_ext = '" . $item->id_pedido_ext . "', id_producto_item = '" . $item->id_producto_item . "', sumado='" . $item->sumado . "', restado='" . $item->restado . "', cantidad = '" . $item->total . "'";
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
	
	return $insert_id;
  }

  public function method_leer_pedido($params, $error) {
	$resultado = "";
	$resultado->internos = $this->method_leer_internos($params, $error);
	$resultado->externos = $this->method_leer_externos($params, $error);
	
	return $resultado;
  }
  
  public function method_leer_internos($params, $error) {
  	$p = $params[0];
  	
  	set_time_limit(120);
  	
	$resultado = array();
	
	$sql="SELECT" .
			" fabrica.id_fabrica" .
			", fabrica.descrip AS fabrica" .
			", fabrica.desc_fabrica" .
			", producto.descrip AS producto" .
			", producto.iva" .
			", producto.desc_producto" .
			", producto_item.id_producto_item" .
			", producto_item.precio_lista" .
			", producto_item.capacidad" .
			", producto_item.busqueda" .
			", unidad.id_unidad" .
			", unidad.descrip AS unidad" .
			", color.descrip AS color" .
		" FROM (((producto_item INNER JOIN producto USING(id_producto)) INNER JOIN fabrica USING(id_fabrica)) INNER JOIN unidad USING(id_unidad)) INNER JOIN color USING(id_color)";

	if ($p->id_fabrica == "1") {
		$sql.=" WHERE FALSE";
	} else {
		$sql.=" WHERE producto_item.activo AND producto.id_fabrica='" . $p->id_fabrica . "'";
	}

	$sql.=" ORDER BY fabrica, producto, color, unidad, capacidad"
	;
	
	$rsPedidoSuc = mysql_query($sql);
	while ($rowPedidoSuc = mysql_fetch_object($rsPedidoSuc)) {
		$rowPedidoSuc->desc_fabrica = (float) $rowPedidoSuc->desc_fabrica;
		$rowPedidoSuc->desc_producto = (float) $rowPedidoSuc->desc_producto;
		
		$rowPedidoSuc->seleccionado = (bool) $rowPedidoSuc->seleccionado;
		$rowPedidoSuc->capacidad = (float) $rowPedidoSuc->capacidad;
		$rowPedidoSuc->acumulado = 0;
		$rowPedidoSuc->precio_lista = (float) $rowPedidoSuc->precio_lista;
		$rowPedidoSuc->iva = (float) $rowPedidoSuc->iva;
		
		$rowPedidoSuc->plmasiva = $rowPedidoSuc->precio_lista + ($rowPedidoSuc->precio_lista * $rowPedidoSuc->iva / 100);
		
		$rowPedidoSuc->costo = $rowPedidoSuc->plmasiva;
		$rowPedidoSuc->costo = $rowPedidoSuc->costo - ($rowPedidoSuc->costo * $rowPedidoSuc->desc_fabrica / 100);
		$rowPedidoSuc->costo = $rowPedidoSuc->costo - ($rowPedidoSuc->costo * $rowPedidoSuc->desc_producto / 100);
		
		
		$rowPedidoSuc->stock = 0;
		$rowPedidoSuc->stock_suc = 0;
		$rowPedidoSuc->vendido = 0;
		$rowPedidoSuc->cantidad = 0;
		$rowPedidoSuc->detalleStock = array();
		$rowPedidoSuc->detallePedInt = $this->toJson("SELECT id_pedido_suc_detalle, descrip, cantidad FROM (pedido_suc_detalle INNER JOIN pedido_suc USING(id_pedido_suc)) INNER JOIN sucursal USING(id_sucursal) WHERE id_producto_item = '" . $rowPedidoSuc->id_producto_item . "' AND id_pedido_ext=0 ORDER BY descrip");
		foreach ($rowPedidoSuc->detallePedInt as $item) {
			$item->cantidad = (float) $item->cantidad;
			$rowPedidoSuc->acumulado = $rowPedidoSuc->acumulado + $item->cantidad;
		}

		
		$sql="SELECT id_sucursal, descrip, stock FROM stock INNER JOIN sucursal USING(id_sucursal) WHERE sucursal.activo AND id_producto_item = '" . $rowPedidoSuc->id_producto_item . "' ORDER BY descrip";
		$rsStock = mysql_query($sql);
		while ($rowStock = mysql_fetch_object($rsStock)) {
			$rowStock->stock = (float) $rowStock->stock;
			$rowPedidoSuc->detalleStock[] = $rowStock;
			if ($rowStock->id_sucursal == $this->rowParamet->id_sucursal) {
				$rowPedidoSuc->stock = $rowStock->stock;
			} else {
				$rowPedidoSuc->stock_suc = $rowPedidoSuc->stock_suc + $rowStock->stock;
			}
		}

		
		$resultado[] = $rowPedidoSuc;
	}

	return $resultado;
  }
  
  public function method_leer_externos($params, $error) {
	$p = $params[0];
	
	set_time_limit(120);
  	
	$opciones = array("recibido"=>"bool");
	$sql="SELECT pedido_ext.*, fabrica.descrip AS fabrica, transporte.descrip AS transporte FROM (pedido_ext INNER JOIN fabrica USING(id_fabrica)) INNER JOIN transporte USING(id_transporte) WHERE pedido_ext.recibido=" . (($p->recibido) ? "TRUE" : "FALSE") . " ORDER BY fecha DESC";
	return $this->toJson(mysql_query($sql), $opciones);
  }
  
  
  public function method_leer_externos_detalle($params, $error) {
	$p = $params[0];
  	
	$resultado = new stdClass;
	
	$sql = "SELECT pedido_ext.*, fabrica.desc_fabrica FROM pedido_ext INNER JOIN fabrica USING(id_fabrica) WHERE pedido_ext.id_pedido_ext=" . $p->id_pedido_ext;
	$rsPedido = mysql_query($sql);
	$regPedido = mysql_fetch_object($rsPedido);
	$regPedido->recibido = (bool) $regPedido->recibido;
	$regPedido->desc_fabrica = (float) $regPedido->desc_fabrica;
	
	$resultado->detalle = array();
	$sql = "SELECT pedido_ext_detalle.id_pedido_ext_detalle, pedido_ext_detalle.id_pedido_ext, pedido_ext_detalle.cantidad, producto_item.id_producto_item, producto_item.cod_interno, producto_item.id_unidad, producto_item.precio_lista, producto.descrip AS producto, producto.iva, producto.desc_producto, producto_item.capacidad, color.descrip AS color, unidad.descrip AS unidad";
	$sql.= " FROM ((((pedido_ext_detalle INNER JOIN producto_item USING (id_producto_item)) INNER JOIN producto USING(id_producto)) INNER JOIN color USING (id_color)) INNER JOIN unidad USING (id_unidad))";
	$sql.= " WHERE pedido_ext_detalle.id_pedido_ext=" . $p->id_pedido_ext;
	$sql.= " ORDER BY producto, color, unidad, capacidad";
	$rs = mysql_query($sql);
	while ($row = mysql_fetch_object($rs)) {
		$row->cantidad = (float) $row->cantidad;
		$row->capacidad = (float) $row->capacidad;
		$row->precio_lista = (float) $row->precio_lista;
		$row->iva = (float) $row->iva;
		$row->desc_producto = (float) $row->desc_producto;
		
		$row->plmasiva = $row->precio_lista + ($row->precio_lista * $row->iva / 100);
		
		$row->costo = $row->plmasiva;
		$row->costo = $row->costo - ($row->costo * $regPedido->desc_fabrica / 100);
		$row->costo = $row->costo - ($row->costo * $row->desc_producto / 100);
		
		$row->ingresar = 0;
		$row->sumado = 0;
		$row->restado = 0;
		$row->total = 0;
		$resultado->detalle[] = $row;
	}
	
	
	$resultado->recibidos = array();
	$sql = "SELECT pedido_ext_recibido.cantidad, pedido_ext_recibido.sumado, pedido_ext_recibido.restado, producto_item.id_producto_item, producto_item.id_unidad, producto_item.precio_lista, producto.descrip AS producto, producto.iva, producto_item.capacidad, color.descrip AS color, unidad.descrip AS unidad";
	$sql.= " FROM ((((pedido_ext_recibido INNER JOIN producto_item USING (id_producto_item)) INNER JOIN producto USING(id_producto)) INNER JOIN color USING (id_color)) INNER JOIN unidad USING (id_unidad))";
	$sql.= " WHERE pedido_ext_recibido.id_pedido_ext=" . $p->id_pedido_ext;
	$sql.= " ORDER BY producto, color, unidad, capacidad";
	$rs = mysql_query($sql);
	while ($row = mysql_fetch_object($rs)) {
		$row->capacidad = (float) $row->capacidad;
		$row->sumado = (float) $row->sumado;
		$row->restado = (float) $row->restado;
		$row->cantidad = (float) $row->cantidad;
		$resultado->recibidos[] = $row;
	}
	
	
	return $resultado;
  }
}

?>