<?php

require("Base.php");

class class_Parametros extends class_Base
{
  function __construct() {
    parent::__construct();
  }
  
  
  public function method_grabar_entrega($params, $error) {
  	$p = $params[0];
  	
	mysql_query("BEGIN TRANSACTION");
	
	$sql = "INSERT entrega SET id_entrega_lugar = " . $p->id_entrega_lugar . ", descrip='" . $p->descrip . "', fecha = NOW()";
	mysql_query($sql);
	$id_entrega = mysql_insert_id();
	
	foreach ($p->items as $item) {
		$sql = "INSERT entrega_item SET id_entrega=" . $id_entrega . ", id_stock = " . $item->id_stock . ", id_producto = " . $item->id_producto . ", cantidad=" . $item->entregar;
		mysql_query($sql);
		
		$sql = "UPDATE stock SET stock = stock - " . $item->entregar . " WHERE id_stock = " . $item->id_stock . " AND TRUE";
		mysql_query($sql);
	}
	
	mysql_query("COMMIT");
	
	return $id_entrega;
  }
  
  
  public function method_grabar_ingreso($params, $error) {
  	$p = $params[0];
  	
	mysql_query("BEGIN TRANSACTION");
	
	$sql = "INSERT ingreso SET id_ingreso_lugar = " . $p->id_ingreso_lugar . ", descrip='" . $p->descrip . "', fecha = NOW()";
	mysql_query($sql);
	$id_ingreso = mysql_insert_id();
	
	foreach ($p->items as $item) {
		$sql = "INSERT stock SET id_producto = " . $item->id_producto . ", lote='" . $item->lote . "', f_vencimiento='" . $item->f_vencimiento . "', stock=" . $item->cantidad;
		mysql_query($sql);
		$id_stock = mysql_insert_id();
		
		$sql = "INSERT ingreso_item SET id_ingreso=" . $id_ingreso . ", id_stock = " . $id_stock . ", id_producto = " . $item->id_producto . ", lote='" . $item->lote . "', f_vencimiento='" . $item->f_vencimiento . "', cantidad=" . $item->cantidad;
		mysql_query($sql);
	}
	
	mysql_query("COMMIT");
	
  }
  
  
  public function method_escribir_productos($params, $error) {
  	$p = $params[0];
  	
  	$cambios = $p->cambios;
  	
  	try {
		mysql_query("START TRANSACTION");
		
		foreach ($cambios->altas as $item) {
			$sql="INSERT producto SET descrip='" . $item->descrip . "', pto_reposicion='" . $item->pto_reposicion . "'";
			mysql_query($sql);
		}
	
		foreach ($cambios->modificados as $item) {
			$sql="UPDATE producto SET descrip='" . $item->descrip . "', pto_reposicion='" . $item->pto_reposicion . "' WHERE id_producto='" . $item->id_producto . "'";
			mysql_query($sql);
		}	
	
		mysql_query("COMMIT");
	
	} catch (Exception $e) {
		mysql_query("ROLLBACK");
	}
  }
  
  
  public function method_leer_productos($params, $error) {
  	$p = $params[0];
  	
	function functionAux(&$row, $key) {
		$row->pto_reposicion = (int) $row->pto_reposicion;
	};
  	
  	$opciones = new stdClass;
  	$opciones->pto_reposicion = "int";
  	
	$sql = "SELECT * FROM producto ORDER BY descrip";
	return $this->toJson($sql, $opciones);
  }
  
  
  public function method_leer_ingreso($params, $error) {
  	$p = $params[0];
  	
	$sql = "SELECT ingreso.*, ingreso_lugar.descrip AS lugar FROM ingreso INNER JOIN ingreso_lugar USING(id_ingreso_lugar) ORDER BY fecha DESC";
	return $this->toJson($sql);
  }
  
  
  public function method_leer_ingreso_item($params, $error) {
  	$p = $params[0];
  	
  	$opciones = new stdClass;
  	$opciones->cantidad = "int";
  	
	$sql = "SELECT ingreso_item.*, producto.descrip FROM ingreso_item INNER JOIN producto USING(id_producto) WHERE id_ingreso=" . $p->id_ingreso;
	return $this->toJson($sql, $opciones);
  }
  
  
  public function method_leer_entrega($params, $error) {
  	$p = $params[0];
  	
	$sql = "SELECT entrega.*, entrega_lugar.descrip AS lugar FROM entrega INNER JOIN entrega_lugar USING(id_entrega_lugar) ORDER BY fecha DESC";
	return $this->toJson($sql);
  }
  
  
  public function method_leer_entrega_item($params, $error) {
  	$p = $params[0];
  	
  	$opciones = new stdClass;
  	$opciones->cantidad = "int";
  	
	$sql = "SELECT entrega_item.*, stock.*, producto.descrip FROM (entrega_item INNER JOIN stock USING(id_stock)) INNER JOIN producto ON stock.id_producto = producto.id_producto WHERE id_entrega=" . $p->id_entrega;
	return $this->toJson($sql, $opciones);
  }
  
  
  public function method_leer_ingreso_lugar($params, $error) {
	$sql = "SELECT * FROM ingreso_lugar ORDER BY descrip";
	return $this->toJson($sql);
  }
  
  
  public function method_leer_entrega_lugar($params, $error) {
	$sql = "SELECT * FROM entrega_lugar ORDER BY descrip";
	return $this->toJson($sql);
  }
  
  
  public function method_buscar_producto($params, $error) {
  	$p = $params[0];
  	
	function functionAux(&$row, $key) {
		$row->stock = (int) $row->stock;
		$row->entregar = 0;
	};
  	
  	$opciones = new stdClass;
  	$opciones->functionAux = functionAux;
  	
	$sql = "SELECT stock.*, descrip FROM producto INNER JOIN stock USING(id_producto) WHERE descrip LIKE '%" . $p->texto . "%' AND stock > 0 ORDER BY descrip, f_vencimiento";
	return $this->toJson($sql, $opciones);
  }

  
  public function method_autocompletarProducto($params, $error) {
  	$p = $params[0];
  	
	$sql = "SELECT id_producto AS model, descrip AS label FROM producto WHERE descrip LIKE '%" . $p->texto . "%' ORDER BY label";
	return $this->toJson($sql);
  }

}

?>