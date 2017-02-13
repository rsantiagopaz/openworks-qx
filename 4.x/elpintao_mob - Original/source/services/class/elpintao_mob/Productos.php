<?php

require("Base.php");

class class_Productos extends class_Base
{
  function __construct() {
    parent::__construct();
  }
  
  
  public function method_asignar_stock($params, $error) {
	$p = $params[0];
	
	mysql_query("START TRANSACTION");

	foreach ($p->ingresos as $ingreso) {
	  	if ($ingreso->adicionar != 0) {
			$sql = "UPDATE stock SET stock = stock + (" . $ingreso->adicionar . "), transmitir=TRUE WHERE id_sucursal=" . $this->rowParamet->id_sucursal . " AND id_producto_item=" . $ingreso->id_producto_item;
			mysql_query($sql);
			
			$sql = "INSERT stock_log SET descrip='Mob.Productos.method_asignar_stock', sql_texto='" . mysql_real_escape_string($sql) . "', fecha=NOW()";
			mysql_query($sql);
	  	}
	}
	
	foreach ($p->codbarra as $codbarra) {
  		$sql = "UPDATE producto_item SET cod_barra='" . $codbarra->cod_barra . "' WHERE id_producto_item=" . $codbarra->id_producto_item;
  		mysql_query($sql);
	  		
  		$this->transmitir($sql);
	}


  	mysql_query("COMMIT");
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



  public function method_buscar_productos($params, $error) {
  	$p = $params[0];
	$resultado = array();
	
	$sql = "SELECT DISTINCTROW producto.id_producto, producto.descrip AS producto, fabrica.descrip AS fabrica";
	$sql.= " FROM ((producto INNER JOIN fabrica USING(id_fabrica)) INNER JOIN producto_item USING (id_producto))";
	$sql.= " WHERE producto_item.activo";
	
	if (is_null($p->cod_barra)) {
		if ($p->id_fabrica != "1") {
			$sql.= " AND producto.id_fabrica='" . $p->id_fabrica . "'";
		}	
		
		$descrip = explode(" ", $p->descrip);
		foreach ($descrip as $palabra) {
			if (!empty($palabra)) {
				if (is_numeric($palabra)) {
					$sql.= " AND producto_item.cod_interno LIKE '" . $palabra . "'";
				} else if ($palabra[0]=="*") {
					$sql.= " AND producto_item.capacidad LIKE '" . substr($palabra, 1) . "%'";
				} else {
					$sql.= " AND producto_item.busqueda LIKE '%" . $palabra . "%'";
				}
			}
		}
	} else {
		$sql.= " AND producto_item.cod_barra='" . $p->cod_barra . "'";
	}

	$sql.=" ORDER BY fabrica, producto";

	return $this->toJson($sql);
  }
}
?>
