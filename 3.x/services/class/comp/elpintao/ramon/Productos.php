<?php

require("Base.php");

class class_Productos extends class_Base
{
  function __construct() {
    parent::__construct();
  }
  
  
  public function method_leer_clasificacion($params, $error) {
  	$p = $params[0];
  	
  	$resultado = "";
  	
	$sql = "SELECT id_padre, descrip FROM arbol WHERE id_arbol=" . $p->id_arbol;
	$rs = mysql_query($sql);
	$row = mysql_fetch_object($rs);
		
	if ($row->id_padre >= 1) {
		$p->id_arbol = $row->id_padre;
		$resultado = $this->method_leer_clasificacion($params, $error) . " / " . $row->descrip;
	}
	
	return $resultado;
  }
  
  
  public function method_leer_arbol($params, $error) {
  	$p = $params[0];
  	
	$sql = "SELECT * FROM arbol WHERE id_arbol=" . $p->id_arbol;
	$rs = mysql_query($sql);
	$rowArbol = mysql_fetch_object($rs);
	$rowArbol->cant_hijos = (int) $rowArbol->cant_hijos;
	$rowArbol->cant_productos = (int) $rowArbol->cant_productos;
	$rowArbol->clasificacion = "";
	$rowArbol->vtitem = null;
	$rowArbol->hijos = array();
	
	$sql = "SELECT id_arbol FROM arbol WHERE id_padre=" . $rowArbol->id_arbol . " ORDER BY descrip";
	$rs = mysql_query($sql);
	while ($row = mysql_fetch_object($rs)) {
		$p->id_arbol = $row->id_arbol;
		$rowArbol->hijos[] = $this->method_leer_arbol($params, $error);
	}
	
	return $rowArbol;
  }
  
/*  
  public function method_leer_arbol($params, $error) {
  	$p = $params[0];
  	
  	$resultado = array();
  	
	$sql = "SELECT * FROM arbol WHERE id_padre=" . $p->id_padre . " ORDER BY descrip";
	$rs = mysql_query($sql);
	while ($row = mysql_fetch_object($rs)) {
		$row->cant_hijos = (int) $row->cant_hijos;
		$row->cant_productos = (int) $row->cant_productos;
		$row->clasificacion = "";
		$row->vtitem = null;
		$p->id_padre = $row->id_arbol;
		$row->hijos = $this->method_leer_arbol($params, $error);
		$resultado[] = $row;
	}
	
  	return $resultado;
  }
*/  
  
  public function method_eliminar_mensaje($params, $error) {
	$p = $params[0];
	
	$sql = "DELETE FROM mensaje WHERE id_mensaje=" . $p->id_mensaje;
	mysql_query($sql);
  }
  
  
  public function method_anotar_producto($params, $error) {
	$p = $params[0];
	
	$p->model->fecha = date("Y-m-d H:i:s");
	$p->model->sucursal = $this->arraySucursal[$this->rowParamet->id_sucursal]->descrip;
	
	$encabezado = $p->model->fecha . " - Sucursal: " . $p->model->sucursal . "<br/>";
	$encabezado.= "De: " . $p->model->usuario_de;
	if (empty($p->model->id_usuario_para)) $encabezado.= "<br/>"; else $encabezado.= ", Para: " . $p->model->usuario_para . "<br/>";
	if (empty($p->model->asunto)) $encabezado.= "<br/><br/>"; else $encabezado.= "Asunto: " . $p->model->asunto . "<br/><br/>";
	$mensaje = '<table border="1" rules="rows" cellpadding=3 cellspacing=0 width=650 height=1% align="left">';
	$mensaje.= '<tr><td>Fábrica</td><td>Descripción</td><td>Capacidad</td><td>Color</td><td>Unidad</td><td>Cod.interno</td><td>Cod.externo</td><td>Cod.barra</td></tr>';
	foreach ($p->tabla as $item) {
		$mensaje.= '<tr><td>' . $item->fabrica . '</td><td>' . $item->descrip . '</td><td>' . $item->capacidad . '</td><td>' . $item->color . '</td><td>' . $item->unidad . '</td><td>' . $item->cod_interno . '</td><td>' . $item->cod_externo . '</td><td>' . $item->cod_barra . '</td></tr>';
	}
	$mensaje.= '</table>';
	
	$p->model->mensaje = htmlentities($mensaje);
	
	$descrip = $encabezado . $mensaje;
	if (strlen($descrip) > 400) $descrip = substr($descrip, 0, 400) . " ...";

	$json = json_encode($p->model);
	
	$sql = "INSERT mensaje SET id_sucursal=" . $this->rowParamet->id_sucursal . ", id_usuario_para=" . $p->model->id_usuario_para . ", descrip='" . $descrip . "', json='" . $json . "', mostrar=TRUE";
	$this->transmitir($sql, $this->rowParamet->id_sucursal_deposito);
  }
  
  
  public function method_asignar_stock($params, $error) {
	$p = $params[0];
	
	mysql_query("START TRANSACTION");

  	if (!is_null($p->stock) && $p->adicionar != 0) {
		$sql = "UPDATE stock SET stock=" . ($p->stock + $p->adicionar) . ", transmitir=TRUE WHERE id_sucursal=" . $this->rowParamet->id_sucursal . " AND id_producto_item=" . $p->id_producto_item;
		mysql_query($sql);
		
		$sql = "INSERT stock_log SET descrip='Productos.method_asignar_stock', sql_texto='" . mysql_real_escape_string($sql) . "', fecha=NOW()";
		mysql_query($sql);
  	}
  	if (!is_null($p->cod_barra)) {
  		$sql = "UPDATE producto_item SET cod_barra='" . $p->cod_barra . "' WHERE id_producto_item=" . $p->id_producto_item;
  		mysql_query($sql);
  		
  		$this->transmitir($sql);
  	}
  	
  	mysql_query("COMMIT");
  }
  
  
  public function method_aplicar_porcentaje($params, $error) {
  	$p = $params[0];
  	$p->fecha = date("Y-m-d H:i:s");
  	
  	mysql_query("START TRANSACTION");
  	
  	$this->method_aplicar_porcentaje_recursivo($params, $error);
  	
  	mysql_query("COMMIT");
  }
  
  
  public function method_aplicar_porcentaje_recursivo($params, $error) {
  	$p = $params[0];

	if ($p->aplicar == "pcfcd") {
		$sql = "SELECT producto.iva, producto.desc_producto, producto_item.*, fabrica.desc_fabrica FROM (producto INNER JOIN producto_item USING(id_producto)) INNER JOIN fabrica USING(id_fabrica) WHERE producto.activo AND producto.id_arbol=" . $p->id_arbol . (is_null($p->id_fabrica) ? "" : " AND producto.id_fabrica=" . $p->id_fabrica);
		$rs = mysql_query($sql);
		while ($row = mysql_fetch_object($rs)) {
			$row->iva = (float) $row->iva;
			$row->desc_producto = (float) $row->desc_producto;
			$row->precio_lista = (float) $row->precio_lista;
			$row->remarc_final = (float) $row->remarc_final;
			$row->remarc_mayorista = (float) $row->remarc_mayorista;
			$row->desc_final = (float) $row->desc_final;
			$row->desc_mayorista = (float) $row->desc_mayorista;
			$row->bonif_final = (float) $row->bonif_final;
			$row->bonif_mayorista = (float) $row->bonif_mayorista;
			$row->comision_vendedor = (float) $row->comision_vendedor;
			$row->desc_fabrica = (float) $row->desc_fabrica;
			
			$this->functionCalcularImportes($row);
			
			if ($p->porcentaje > 0) {
				$row->pcfcd = $row->pcfcd + ($row->pcfcd * abs($p->porcentaje) / 100);
			} else {
				$row->pcfcd = $row->pcfcd - ($row->pcfcd * abs($p->porcentaje) / 100);
			}
			
			$row->remarc_final = (1000000 * $row->pcfcd - ((100 * $row->bonif_final - 10000) * $row->desc_final - 10000 * $row->bonif_final + 1000000) * $row->costo) / ((($row->bonif_final - 100) * $row->desc_final - 100 * $row->bonif_final + 10000) * $row->costo);
			
			$sql = "UPDATE producto_item SET remarc_final = " . $row->remarc_final . " WHERE id_producto_item=" . $row->id_producto_item;
			mysql_query($sql);
			$this->transmitir($sql);
		}
	} else {
		$sql = "UPDATE producto INNER JOIN producto_item USING(id_producto) SET producto_item." . $p->aplicar . " = producto_item." . $p->aplicar . (($p->porcentaje > 0) ? " + " : " - ") . "(producto_item." . $p->aplicar . " * " . abs($p->porcentaje) . " / 100) WHERE producto.activo AND producto.id_arbol=" . $p->id_arbol . (is_null($p->id_fabrica) ? "" : " AND producto.id_fabrica=" . $p->id_fabrica);
		mysql_query($sql);
		$this->transmitir($sql);
	}

	
	$sql = "SELECT producto.iva, producto.desc_producto, producto_item.*, fabrica.desc_fabrica FROM (producto INNER JOIN producto_item USING(id_producto)) INNER JOIN fabrica USING(id_fabrica) WHERE producto.activo AND producto.id_arbol=" . $p->id_arbol . (is_null($p->id_fabrica) ? "" : " AND producto.id_fabrica=" . $p->id_fabrica);
	$rs = mysql_query($sql);
	while ($row = mysql_fetch_object($rs)) {
		$row->fecha = $p->fecha;
		$set = $this->prepararCampos($row, "historico_precio");
		$sql = "INSERT historico_precio SET " . $set;
		mysql_query($sql);
	}
	
	
	$sql = "SELECT id_arbol FROM arbol WHERE id_padre=" . $p->id_arbol;
	$rs = mysql_query($sql);
	while ($row = mysql_fetch_object($rs)) {
		$p->id_arbol = $row->id_arbol;
		$this->method_aplicar_porcentaje_recursivo($params, $error);
	}
  }
  
  
  public function method_mover_nodo($params, $error) {
  	$p = $params[0];
  	
  	mysql_query("START TRANSACTION");
  	
	$sql = "UPDATE arbol SET cant_hijos = cant_hijos - 1 WHERE id_arbol='" . $p->id_padre_original . "'";
	mysql_query($sql);
	$this->transmitir($sql);
	
	$sql = "UPDATE arbol SET cant_hijos = cant_hijos + 1 WHERE id_arbol='" . $p->id_padre . "'";
	mysql_query($sql);
	$this->transmitir($sql);
	
	$sql = "UPDATE arbol SET id_padre = '" . $p->id_padre . "' WHERE id_arbol='" . $p->id_arbol . "'";
	mysql_query($sql);
	$this->transmitir($sql);
	
	foreach ($p->clasificacion as $item) {
		$sql = "SELECT id_producto_item, busqueda FROM producto INNER JOIN producto_item USING(id_producto) WHERE id_arbol=" . $item->id_arbol;
		$rs = mysql_query($sql);
		while ($row = mysql_fetch_object($rs)) {
			$busqueda = json_decode($row->busqueda);
			$busqueda[0] = $item->clasificacion;
			$busqueda = json_encode($busqueda);
			$sql = "UPDATE producto_item SET busqueda = '" . $busqueda . "' WHERE id_producto_item=" . $row->id_producto_item;
			mysql_query($sql);
			$this->transmitir($sql);
		}
	}

	mysql_query("COMMIT");
  }
  
  
  public function method_mover_productos($params, $error) {
  	$p = $params[0];
  	
  	mysql_query("START TRANSACTION");
  	
	$sql = "UPDATE arbol SET cant_productos = cant_productos - 1 WHERE id_arbol='" . $p->id_arbol_actual . "'";
	mysql_query($sql);
	$this->transmitir($sql);

	$sql = "UPDATE arbol SET cant_productos = cant_productos + 1 WHERE id_arbol='" . $p->id_arbol . "'";
	mysql_query($sql);
	$this->transmitir($sql);

	$sql = "UPDATE producto SET id_arbol='" . $p->id_arbol . "' WHERE id_producto='" . $p->id_producto . "'";
	mysql_query($sql);
	$this->transmitir($sql);

	$sql = "SELECT id_producto_item, busqueda FROM producto_item WHERE id_producto=" . $p->id_producto;
	$rs = mysql_query($sql);
	while ($row = mysql_fetch_object($rs)) {
		$busqueda = json_decode($row->busqueda);
		$busqueda[0] = $p->clasificacion;
		$busqueda = json_encode($busqueda);
		$sql = "UPDATE producto_item SET busqueda = '" . $busqueda . "' WHERE id_producto_item=" . $row->id_producto_item;
		mysql_query($sql);
		$this->transmitir($sql);
	}
	
	mysql_query("COMMIT");
  }
  

  public function method_grabar_precios($params, $error) {
  	$p = $params[0];
        
    mysql_query("START TRANSACTION");
    
	$sql = "UPDATE producto SET desc_producto='" . $p->desc_producto . "', serializer='" . $p->serializer . "' WHERE id_producto='" . $p->id_producto . "'";
	mysql_query($sql);
	$this->transmitir($sql);
	
	$sql = "UPDATE fabrica SET desc_fabrica='" . $p->desc_fabrica . "' WHERE id_fabrica='" . $p->id_fabrica . "'";
	mysql_query($sql);
	$this->transmitir($sql);
	
	$fecha = date("Y-m-d H:i:s");
    
    foreach ($p->producto_item as $item) {
		$set = $this->prepararCampos($item, "producto_item");
		$sql = "UPDATE producto_item SET " . $set . " WHERE id_producto_item='" . $item->id_producto_item . "'";
		mysql_query($sql);
		$this->transmitir($sql);
		
		$item->fecha = $fecha;
		$set = $this->prepararCampos($item, "historico_precio");
		$sql = "INSERT historico_precio SET " . $set;
		mysql_query($sql);
    }
    
    mysql_query("COMMIT");
  }


  public function method_leer_precios($params, $error) {
  	$p = $params[0];
  	
	$resultado = new stdClass;
	$resultado->producto_item = array();
	
	$sql = "SELECT";
	$sql.=" producto.*, fabrica.descrip AS fabrica, fabrica.desc_fabrica";
	$sql.=" FROM producto INNER JOIN fabrica USING (id_fabrica)";
	$sql.=" WHERE producto.activo AND id_producto=" . $p->id_producto;
	$rs = mysql_query($sql);
	$producto = mysql_fetch_object($rs);
	$producto->desc_producto = (float) $producto->desc_producto;
	$producto->desc_fabrica = (float) $producto->desc_fabrica;
	$producto->iva = (float) $producto->iva;

	$resultado->producto = $producto;
	

	$sql = "SELECT";
	$sql.=" producto_item.*, unidad.descrip AS unidad, color.descrip AS color";
	$sql.=" FROM (producto_item INNER JOIN unidad USING (id_unidad)) INNER JOIN color USING (id_color)";
	$sql.=" WHERE producto_item.activo AND id_producto=" . $p->id_producto;
	$sql.=" ORDER BY color, unidad, producto_item.capacidad";
	$rs = mysql_query($sql);
	while ($reg = mysql_fetch_object($rs)) {
		$reg->iva = $producto->iva;
		$reg->desc_producto = $producto->desc_producto;
		$reg->desc_fabrica = $producto->desc_fabrica;
		
		$reg->capacidad = (float) $reg->capacidad;
		$reg->duracion = (float) $reg->duracion;
		$reg->precio_lista = (float) $reg->precio_lista;
		$reg->remarc_final = (float) $reg->remarc_final;
		$reg->remarc_mayorista = (float) $reg->remarc_mayorista;
		$reg->desc_final = (float) $reg->desc_final;
		$reg->desc_mayorista = (float) $reg->desc_mayorista;
		$reg->bonif_final = (float) $reg->bonif_final;
		$reg->bonif_mayorista = (float) $reg->bonif_mayorista;
		$reg->comision_vendedor = (float) $reg->comision_vendedor;
		
		$resultado->producto_item[] = $reg;
		

/*
		$plmasiva = $reg->precio_lista + ($reg->precio_lista * $model->iva / 100);
		$pcf = $plmasiva + ($plmasiva * $reg->remarc_final / 100);
		$pcfcd = $pcf - ($pcf * $reg->desc_final /100);
		$pmay = $plmasiva + ($plmasiva * $reg->remarc_mayorista / 100);
		$pmaycd = $pmay - ($pmay * (float)$reg->desc_mayorista /100);
		$costo = $plmasiva - ($plmasiva * (float)$model->desc_fabrica / 100);
		
		$calculo = "";
		$calculo->item = $contador;
		$calculo->plmasiva = (float) number_format($plmasiva, 2);
		$calculo->costo = (float) number_format($costo, 2);
		$calculo->pcf = (float) number_format($pcf, 2);
		$calculo->pcfcd = (float) number_format($pcfcd, 2);
		$calculo->utilcf = (float) number_format($pcfcd - $costo, 2);
		$calculo->pmay = (float) number_format($pmay, 2);
		$calculo->pmaycd = (float) number_format($pmaycd, 2);
		$calculo->utilmay = (float) number_format($pmaycd - $costo, 2);
		$calculo->comision = (float) number_format($pcfcd * $reg->comision_vendedor /100, 2);
		
		$resultado->calculo[] = $calculo;
*/
	}
	
	return $resultado;
  }


  public function method_agregar_nodo($params, $error) {
  	$p = $params[0];
  	
  	mysql_query("START TRANSACTION");
  	
	$sql="UPDATE arbol SET cant_hijos = cant_hijos + 1 WHERE id_arbol='" . $p->id_padre . "'";
	mysql_query($sql);
	$this->transmitir($sql);
	$insert_id = "0";
	$sql = "INSERT arbol SET id_arbol='" . $insert_id . "', id_padre='" . $p->id_padre . "', descrip='Nuevo nodo', cant_hijos=0, cant_productos=0";
	mysql_query($sql);
	$insert_id = mysql_insert_id();
	$sql = "INSERT arbol SET id_arbol='" . $insert_id . "', id_padre='" . $p->id_padre . "', descrip='Nuevo nodo', cant_hijos=0, cant_productos=0";
	$this->transmitir($sql);

	mysql_query("COMMIT");

	return $insert_id;
  }
  
  
  public function verifica_arbol_usuario(&$arbol, &$usuario, $id_arbol) {
  	if ($id_arbol == "0") {
  		$bandera = false;
  	} else if ($id_arbol == $usuario->id_arbol) {
  		$bandera = true;
  	} else {
  		$bandera = $this->verifica_arbol_usuario($arbol, $usuario, $arbol[$id_arbol]->id_padre);
  	}
	
	return $bandera;
  }


  public function method_leer_producto($params, $error) {
  	set_time_limit(60);
  	$p = $params[0];
  	
	$todos = is_null($p->id_producto);
	
	if ($todos) {
		$resultado = new stdClass;
		$resultado->producto_item = array();
		$resultado->producto = array();
		
		$WHERE = " WHERE producto_item.activo";
		
		if (is_null($p->cod_barra)) {
			$descrip = explode(" ", $p->descrip);
			foreach ($descrip as $palabra) {
				if (!empty($palabra)) {
					if (is_numeric($palabra)) {
						$WHERE.= " AND producto_item.cod_interno LIKE '" . $palabra . "'";
					} else if ($palabra[0]=="*") {
						$WHERE.= " AND producto_item.capacidad LIKE '" . substr($palabra, 1) . "%'";
					} else {
						$WHERE.= " AND producto_item.busqueda LIKE '%" . $palabra . "%'";
					}
				}
			}
		} else {
			$WHERE.= " AND producto_item.cod_barra='" . $p->cod_barra . "'";
		}
	

		$sql = "SELECT";
		$sql.=" producto.id_arbol";
		$sql.=", producto.descrip";
		$sql.=", producto.iva";
		$sql.=", producto.desc_producto";
		$sql.=", fabrica.descrip AS fabrica";
		$sql.=", fabrica.desc_fabrica";
		$sql.=", moneda.simbolo AS moneda";
		$sql.=", producto_item.*";
		$sql.=", unidad.descrip AS unidad";
		$sql.=", color.descrip AS color";
		$sql.=" FROM ((producto INNER JOIN moneda USING(id_moneda)) INNER JOIN fabrica USING(id_fabrica))";
		$sql.=" INNER JOIN ((producto_item INNER JOIN color USING(id_color)) INNER JOIN unidad USING(id_unidad)) USING(id_producto)";

		if (is_null($p->id_arbol)) {
			$sql.= $WHERE;
			
			if (!is_null($p->usuario)) {
				$arbol = array();
				$rs = mysql_query("SELECT id_arbol, id_padre FROM arbol");
				while ($row = mysql_fetch_object($rs)) {
					$arbol[$row->id_arbol] = $row;
				}
			}
		} else {
			$sql.=" WHERE producto_item.activo AND id_arbol=" . $p->id_arbol;
		}
		
		$rs = mysql_query($sql);
		while ($row = mysql_fetch_object($rs)) {
			$bandera = true;
			if (is_null($p->id_arbol) || !is_null($p->usuario)) {
				$bandera = $this->verifica_arbol_usuario($arbol, $p->usuario, $row->id_arbol);
			}
			if ($bandera) {
				$row->capacidad = (float) $row->capacidad;
				$row->iva = (float) $row->iva;
				$row->desc_producto = (float) $row->desc_producto;
				$row->desc_fabrica = (float) $row->desc_fabrica;
				
				$row->precio_lista = (float) $row->precio_lista;
				$row->remarc_final = (float) $row->remarc_final;
				$row->remarc_mayorista = (float) $row->remarc_mayorista;
				$row->desc_final = (float) $row->desc_final;
				$row->desc_mayorista = (float) $row->desc_mayorista;
				$row->bonif_final = (float) $row->bonif_final;
				$row->bonif_mayorista = (float) $row->bonif_mayorista;
				$row->comision_vendedor = (float) $row->comision_vendedor;
				
				$sql = "SELECT stock FROM stock WHERE id_sucursal='" . $this->rowParamet->id_sucursal . "' AND id_producto_item='" . $row->id_producto_item . "'";
				$rsStock = mysql_query($sql);
				$rowStock = mysql_fetch_object($rsStock);
				$row->stock = (float) $rowStock->stock;
				
				$resultado->producto_item[] = $row;
			}
		}
		
		


		
		$sql = "SELECT DISTINCTROW";
		$sql.=" producto.id_arbol";
		$sql.=", producto.id_producto";
		$sql.=", producto.descrip";
		$sql.=", producto.iva";
		$sql.=", producto.desc_producto";
		$sql.=", fabrica.descrip AS fabrica";
		$sql.=", fabrica.desc_fabrica";
		$sql.=", moneda.simbolo AS moneda";
		$sql.=" FROM ((producto INNER JOIN moneda USING(id_moneda)) INNER JOIN fabrica USING(id_fabrica))";
		$sql.=" INNER JOIN ((producto_item INNER JOIN color USING(id_color)) INNER JOIN unidad USING(id_unidad)) USING(id_producto)";

		if (is_null($p->id_arbol)) {
			$sql.= $WHERE;
			
			if (!is_null($p->usuario)) {
				$arbol = array();
				$rs = mysql_query("SELECT id_arbol, id_padre FROM arbol");
				while ($row = mysql_fetch_object($rs)) {
					$arbol[$row->id_arbol] = $row;
				}
			}
		} else {
			$sql.=" WHERE producto_item.activo AND id_arbol=" . $p->id_arbol;
		}
		
		$sql.=" ORDER BY fabrica, descrip";
		
		$rs = mysql_query($sql);
		while ($row = mysql_fetch_object($rs)) {
			$bandera = true;
			if (is_null($p->id_arbol) || !is_null($p->usuario)) {
				$bandera = $this->verifica_arbol_usuario($arbol, $p->usuario, $row->id_arbol);
			}
			if ($bandera) {
				$row->iva = (float) $row->iva;
				$row->desc_producto = (float) $row->desc_producto;
				$row->desc_fabrica = (float) $row->desc_fabrica;
				
				$resultado->producto[] = $row;
			}
		}
	} else {
		$resultado = "";
		$resultado->items = array();
		
		$sql = "SELECT";
		$sql.=" *";
		$sql.=" FROM producto";
		$sql.=" WHERE producto.activo AND id_producto=" . $p->id_producto;
		$rs = mysql_query($sql);
		$row = mysql_fetch_object($rs);
		$row->desc_producto = (float) $row->desc_producto;
		$row->iva = (float) $row->iva;
	
		$resultado->model = $row;
		
	
		$sql = "SELECT";
		$sql.=" *";
		$sql.=" FROM producto_item";
		$sql.=" WHERE producto_item.activo AND id_producto=" . $p->id_producto;
		$rs = mysql_query($sql);
		while ($row = mysql_fetch_object($rs)) {
			$row->capacidad = (float) $row->capacidad;
			$row->duracion = (float) $row->duracion;
			
			$row->precio_lista = (float) $row->precio_lista;
			$row->remarc_final = (float) $row->remarc_final;
			$row->remarc_mayorista = (float) $row->remarc_mayorista;
			$row->desc_final = (float) $row->desc_final;
			$row->desc_mayorista = (float) $row->desc_mayorista;
			$row->bonif_final = (float) $row->bonif_final;
			$row->bonif_mayorista = (float) $row->bonif_mayorista;
			$row->comision_vendedor = (float) $row->comision_vendedor;
			
			$resultado->items[] = $row;
		}
	}
	
	return $resultado;
  }


  public function method_alta_modifica_producto($params, $error) {
  	$p = $params[0];
  	
  	$resultado=array();
  	
	$model = $p->model;
	$items = $p->items;
	
	$set = $this->prepararCampos($model);
	
	mysql_query("START TRANSACTION");
	
	try {
	
		if ($model->id_producto == "0") {
			$sql="UPDATE arbol SET cant_productos = cant_productos + 1 WHERE id_arbol='" . $model->id_arbol . "'";
			mysql_query($sql);
			$this->transmitir($sql);
			
			$sql = "INSERT producto SET " . $set . ", serializer='{\"agrupar\":false,\"colores\":{}}', activo=TRUE";
			mysql_query($sql);
			$id_producto = mysql_insert_id();
			$model->id_producto = $id_producto;
			$set = $this->prepararCampos($model);
			$sql = "INSERT producto SET " . $set . ", serializer='{\"agrupar\":false,\"colores\":{}}', activo=TRUE";
			$this->transmitir($sql);
		} else {
			$id_producto = $model->id_producto;
			$sql = "UPDATE producto SET " . $set . " WHERE id_producto='" . $model->id_producto . "'";
			mysql_query($sql);
			$this->transmitir($sql);
		}
		
		foreach ($items->altas as $item) {
			$item->id_producto = $id_producto;
			$set = $this->prepararCampos($item);
			$sql = "INSERT producto_item SET " . $set . ", activo=TRUE";
			mysql_query($sql);
			$id_producto_item = mysql_insert_id();
			$item->id_producto_item = $id_producto_item;
			$set = $this->prepararCampos($item);
			$sql = "INSERT producto_item SET " . $set . ", activo=TRUE";
			$this->transmitir($sql);
			
			foreach ($this->arraySucursal as $sucursal) {
				$sql = "INSERT stock SET id_producto_item='" . $id_producto_item . "', id_sucursal='" . $sucursal->id_sucursal . "', stock=0";
				mysql_query($sql);
				
				if ($sucursal->id_sucursal != $this->rowParamet->id_sucursal) $this->transmitir($sql, $sucursal->id_sucursal);
			}
		}
	
		foreach ($items->modificados as $item) {
			$set = $this->prepararCampos($item);
			$sql = "UPDATE producto_item SET " . $set . " WHERE id_producto_item='" . $item->id_producto_item . "'";
			mysql_query($sql);
			$this->transmitir($sql);
		}
	
		foreach ($items->eliminados as $item) {
			$sql="UPDATE producto_item SET activo=FALSE WHERE id_producto_item='" . $item . "'";
			mysql_query($sql);
			$this->transmitir($sql);
		}
		
		mysql_query("COMMIT");
		$resultado = $id_producto;
	
	} catch (Exception $e) {
		$message = $e->getLine();
		mysql_query("ROLLBACK");
		$resultado = $message;
	}
	
	return $resultado;
  }

  public function method_eliminar_nodo($params, $error) {
  	$p = $params[0];
  	
  	mysql_query("START TRANSACTION");
  	
	$sql="UPDATE arbol SET cant_hijos = cant_hijos - 1 WHERE id_arbol='" . $p->id_padre . "'";
	mysql_query($sql);
	$this->transmitir($sql);
	$sql="DELETE FROM arbol WHERE id_arbol=" . $p->id_arbol;
	mysql_query($sql);
	$this->transmitir($sql);
	
	mysql_query("COMMIT");
  }

  public function method_modificar_nodo($params, $error) {
  	$p = $params[0];
  	
  	mysql_query("START TRANSACTION");
  	
	$sql="UPDATE arbol SET descrip='" . $p->descrip . "' WHERE id_arbol='" . $p->id_arbol . "'";
	mysql_query($sql);
	$this->transmitir($sql);
	
	foreach ($p->clasificacion as $item) {
		$sql = "SELECT id_producto_item, busqueda FROM producto INNER JOIN producto_item USING(id_producto) WHERE id_arbol=" . $item->id_arbol;
		$rs = mysql_query($sql);
		while ($row = mysql_fetch_object($rs)) {
			$busqueda = json_decode($row->busqueda);
			$busqueda[0] = $item->clasificacion;
			$busqueda = json_encode($busqueda);
			$sql = "UPDATE producto_item SET busqueda = '" . $busqueda . "' WHERE id_producto_item=" . $row->id_producto_item;
			mysql_query($sql);
			$this->transmitir($sql);
		}
	}
	
	mysql_query("COMMIT");
  }

  public function method_eliminar_producto($params, $error) {
  	$p = $params[0];
	
	mysql_query("START TRANSACTION");
	
	$sql="UPDATE arbol SET cant_productos = cant_productos - 1 WHERE id_arbol='" . $p->id_arbol . "'";
	mysql_query($sql);
	$this->transmitir($sql);
	$sql="UPDATE producto SET activo=FALSE WHERE id_producto='" . $p->id_producto . "'";
	mysql_query($sql);
	$this->transmitir($sql);
	$sql="UPDATE producto_item SET activo=FALSE WHERE id_producto='" . $p->id_producto . "'";
	mysql_query($sql);
	$this->transmitir($sql);
	
	mysql_query("COMMIT");
  }

  public function method_buscar_productos($params, $error) {
  	$p = $params[0];
	$resultado = array();
	
	$sql = "SELECT producto_item.id_producto_item, fabrica.descrip AS fabrica, producto.descrip AS producto, producto.iva, producto_item.capacidad, producto_item.precio_lista, color.descrip AS color, unidad.descrip AS unidad, producto_item.id_unidad, producto_item.cod_barra";
	$sql.= " FROM ((((producto INNER JOIN fabrica USING(id_fabrica)) INNER JOIN producto_item USING (id_producto)) INNER JOIN color USING (id_color)) INNER JOIN unidad USING (id_unidad))";
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

	$sql.=" ORDER BY fabrica, producto, color, unidad, capacidad";

	$rs = mysql_query($sql);
	while ($reg = mysql_fetch_object($rs)) {
		$sql="SELECT stock FROM stock WHERE id_sucursal='" . $this->rowParamet->id_sucursal . "' AND id_producto_item='" . $reg->id_producto_item . "'";
		$rsStock = mysql_query($sql);
		$rowStock = mysql_fetch_object($rsStock);
		
		$reg->stock = (float) $rowStock->stock;
		
		$reg->capacidad = (float) $reg->capacidad;
		$reg->cantidad = 0;
		$reg->recibido = 0;
		$reg->precio_lista = (float) $reg->precio_lista;
		$reg->plmasiva = $reg->precio_lista + ($reg->precio_lista * (float) $reg->iva / 100);
		$resultado[] = $reg;
	}
	return $resultado;
  }
}
?>
