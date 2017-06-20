<?php
class class_archivo_Epson
{
  function __construct() {

  }
  
  
  public function method_FACT($params, $error) {
  	global $conexion;
  	
  	$p = $params[0];
  	
	require_once("ConvertCharset_v1.1/ConvertCharset.class.full.php");

	if ($p->ifiscal->modelo == "TM-U220AFII") {
		require_once("archivo_Epson_Tm20PhpApi.php");
	} else if ($p->ifiscal->modelo == "LX300F+") {
		require_once("archivo_Epson_LX30PhpApi.php");
	}
  	
  	$ConvertCharset = new ConvertCharset("utf-8", "cp437");

	$p->cliente->nombre = $ConvertCharset->Convert($p->cliente->nombre);
	$p->cliente->domicilio = $ConvertCharset->Convert($p->cliente->domicilio);

	$resultado = array();
	
	$conexion = fopen($p->conexion->archivo . ".in.txt", "w");
	if ($conexion) {
		if (!is_null($p->encabezado)) {
			foreach($p->encabezado as $key => $value) {
				$resultado[] = PONEENCABEZADO($key, $ConvertCharset->Convert($value));
			}
		}
		
    	$resultado[] = FACTABRE($p->documento->tipo, $p->documento->estacion, $p->documento->letra, $p->documento->copias, "F", "10", "I", $p->cliente->responsabilidadIVA, $p->cliente->nombre, "", $p->cliente->tipodoc, $p->cliente->nrodoc, "N", $p->cliente->domicilio, "", "", $p->documento_vinculado[0], $p->documento_vinculado[1], "C");
    	
	    if ($p->ifiscal->modelo == "TM-U220AFII") {
	    	$lineaTextoFiscal = 30;
	    	$lineaItem = 20;
	    } else {
	    	$lineaTextoFiscal = 50;
	    	$lineaItem = 50;
	    }
	    
	    foreach($p->detalle as $item) {
	    	$descrip = array();
	    	$desc = $ConvertCharset->Convert(substr($item->descrip, 0, $lineaItem + $lineaTextoFiscal * 3));
	    	
	    	$aux = substr($desc, - $lineaItem, $lineaItem);
	    	$descrip[] = ($aux == false) ? "" : $aux;
	    	$desc = substr_replace($desc, "", - $lineaItem, $lineaItem);
	    	
	    	$aux = substr($desc, - $lineaTextoFiscal, $lineaTextoFiscal);
	    	$descrip[] = ($aux == false) ? "" : $aux;
	    	$desc = substr_replace($desc, "", - $lineaTextoFiscal, $lineaTextoFiscal);
	    	
	    	$aux = substr($desc, - $lineaTextoFiscal, $lineaTextoFiscal);
	    	$descrip[] = ($aux == false) ? "" : $aux;
	    	$desc = substr_replace($desc, "", - $lineaTextoFiscal, $lineaTextoFiscal);
	    	
	    	$aux = substr($desc, - $lineaTextoFiscal, $lineaTextoFiscal);
	    	$descrip[] = ($aux == false) ? "" : $aux;
	    	$desc = substr_replace($desc, "", - $lineaTextoFiscal, $lineaTextoFiscal);
	    	
	    	$resultado[] = FACTITEM($descrip[0], $item->cantidad, $item->monto, $item->iva, $item->operacion, 0, 0, $descrip[3], $descrip[2], $descrip[1], 0, $item->impuesto_interno);
	    }
	    
	    $resultado[] = FACTSUBTOTAL("P", "Subtotal");
    
		foreach($p->pago as $item) {
			$resultado[] = FACTPAGO($ConvertCharset->Convert($item->descrip), $item->monto, $item->calificador);
		}
		
	    $resultado[] = FACTCIERRA($p->documento->tipo, $p->documento->letra, "FINAL");
	    
	    fclose ($conexion);
	} else {
		return "no conecta";
	}
	
	return $resultado;
  }
  
  
  public function method_CIERRE($params, $error) {
  	global $conexion;
  	
  	$p = $params[0];
  	
	if ($p->ifiscal->modelo == "TM-U220AFII") {
		require_once("archivo_Epson_Tm20PhpApi.php");
	} else if ($p->ifiscal->modelo == "LX300F+") {
		require_once("archivo_Epson_LX30PhpApi.php");
	}
  	
	$resultado = array();
	
	$conexion = fopen($p->conexion->archivo . ".in.txt", "w");
	if ($conexion) {
		
		if ($p->rutina == "cierreX") {
    		$resultado[] = CIERRE("X", "P");
		} else if ($p->rutina == "cierreZ") {
			$resultado[] = CIERRE("Z", "P");
		}

	    fclose ($conexion);
	} else {
		return "no conecta";
	}
	
	return $resultado;
  }
  
  
  public function method_AUDITORIAZ($params, $error) {
  	global $conexion;
  	
  	$p = $params[0];
  	
	if ($p->ifiscal->modelo == "TM-U220AFII") {
		require_once("archivo_Epson_Tm20PhpApi.php");
	} else if ($p->ifiscal->modelo == "LX300F+") {
		require_once("archivo_Epson_LX30PhpApi.php");
	}
  	
	$resultado = array();
	
	$conexion = fopen($p->conexion->archivo . ".in.txt", "w");
	if ($conexion) {
   		$resultado[] = AUDITORIAZ($p->numero_inicial, $p->numero_final, $p->tipo_datos);

	    fclose ($conexion);
	} else {
		return "no conecta";
	}
	
	return $resultado;
  }
  
  
  public function method_parsear_salida($params, $error) {
  	global $conexion;
  	
  	$p = $params[0];
  	
  	$resultado = array();
  	
	$conexion = fopen($p->conexion->archivo . ".out.txt", "r");
	if ($conexion) {
		while (!feof($conexion)) {
			$aux = fgets($conexion);
			if (! empty($aux)) $resultado[] = substr($aux, 0, strlen($aux) - 2);
	    }
		fclose($conexion);
		
		$aux = array();
		foreach($resultado as $i) {
			$item = explode("|", $i);
			$item[2] = $this->status_impresora($item[2]);
			$item[3] = $this->status_fiscal($item[3]);
			$aux[] = $item;
		}
		$resultado = $aux;
		
		return $resultado;
	}
  }
  
  
  
  public function status_fiscal($status) {
	$resultado = new stdClass;
	$resultado->status_fiscal = $status;
	$resultado->bits = array();
	
	$status = hexdec($status);
	if ((bool)($status & bindec('0000000000000001'))) {
		$aux = new stdClass;
		$aux->bit = 0;
		$aux->descrip = "Error en chequeo de memoria fiscal. Al encenderse la impresora se produjo un error en el checksum. La impresora no funcionará.";
		$resultado->bits[] = $aux;
	}
	if ((bool)($status & bindec('0000000000000010'))) {
		$aux = new stdClass;
		$aux->bit = 1;
		$aux->descrip = "Error en chequeo de memoria de trabajo. Al encenderse la impresora se produjo un error en el checksum. La impresora no funcionará.";
		$resultado->bits[] = $aux;
	}
	if ((bool)($status & bindec('0000000000000100'))) {
		$aux = new stdClass;
		$aux->bit = 2;
		$aux->descrip = "Carga de batería baja. La carga de la batería de respaldo de la memoria de trabajo se encuentra baja.";
		$resultado->bits[] = $aux;
	}
	if ((bool)($status & bindec('0000000000001000'))) {
		$aux = new stdClass;
		$aux->bit = 3;
		$aux->descrip = "Comando desconocido.";
		$resultado->bits[] = $aux;
	}
	if ((bool)($status & bindec('0000000000010000'))) {
		$aux = new stdClass;
		$aux->bit = 4;
		$aux->descrip = "Datos no válidos en un campo.";
		$resultado->bits[] = $aux;
	}
	if ((bool)($status & bindec('0000000000100000'))) {
		$aux = new stdClass;
		$aux->bit = 5;
		$aux->descrip = "Comando no válido para el estado fiscal actual.";
		$resultado->bits[] = $aux;
	}
	if ((bool)($status & bindec('0000000001000000'))) {
		$aux = new stdClass;
		$aux->bit = 6;
		$aux->descrip = "Desborde del Total.";
		$resultado->bits[] = $aux;
	}
	if ((bool)($status & bindec('0000000010000000'))) {
		$aux = new stdClass;
		$aux->bit = 7;
		$aux->descrip = "Memoria fiscal llena, bloqueada o dada de baja.";
		$resultado->bits[] = $aux;
	}
	if ((bool)($status & bindec('0000000100000000'))) {
		$aux = new stdClass;
		$aux->bit = 8;
		$aux->descrip = "Memoria fiscal a punto de llenarse.";
		$resultado->bits[] = $aux;
	}
	if ((bool)($status & bindec('0000001000000000'))) {
		//$aux = new stdClass;
		//$aux->bit = 9;
		//$aux->descrip = "Terminal fiscal certificada.";
		//$resultado->bits[] = $aux;
	}
	if ((bool)($status & bindec('0000010000000000'))) {
		//$aux = new stdClass;
		//$aux->bit = 10;
		//$aux->descrip = "Terminal fiscal fiscalizada.";
		//$resultado->bits[] = $aux;
	}
	if ((bool)($status & bindec('0000100000000000'))) {
		$aux = new stdClass;
		$aux->bit = 11;
		$aux->descrip = "Error en ingreso de fecha.";
		$resultado->bits[] = $aux;
	}
	if ((bool)($status & bindec('0001000000000000'))) {
		//$aux = new stdClass;
		//$aux->bit = 12;
		//$aux->descrip = "Documento fiscal abierto.";
		//$resultado->bits[] = $aux;
	}
	if ((bool)($status & bindec('0010000000000000'))) {
		//$aux = new stdClass;
		//$aux->bit = 13;
		//$aux->descrip = "Documento abierto.";
		//$resultado->bits[] = $aux;
	}

	
	return $resultado;
  }
  
  
  public function status_impresora($status) {
	$resultado = new stdClass;
	$resultado->status_impresora = $status;
	$resultado->bits = array();
	
	$status = hexdec($status);
	if ((bool)($status & bindec('0000000000000001'))) {
		$aux = new stdClass;
		$aux->bit = 0;
		$aux->descrip = "Impresora ocupada.";
		$resultado->bits[] = $aux;
	}
	if ((bool)($status & bindec('0000000000000100'))) {
		$aux = new stdClass;
		$aux->bit = 2;
		$aux->descrip = "Error de impresora. Se ha interrumpido la conexión entre el controlador fiscal y la impresora.";
		$resultado->bits[] = $aux;
	}
	if ((bool)($status & bindec('0000000000001000'))) {
		$aux = new stdClass;
		$aux->bit = 3;
		$aux->descrip = "Impresora offline. La impresora no ha logrado comunicarse dentro del período de tiempo establecido.";
		$resultado->bits[] = $aux;
	}
	if ((bool)($status & bindec('0000000000010000'))) {
		$aux = new stdClass;
		$aux->bit = 4;
		$aux->descrip = "Falta papel del diario. El sensor de papel del diario ha detectado falta de papel.";
		$resultado->bits[] = $aux;
	}
	if ((bool)($status & bindec('0000000000100000'))) {
		$aux = new stdClass;
		$aux->bit = 5;
		$aux->descrip = "Falta papel de tiques. El sensor de papel de tiques ha detectado falta de papel.";
		$resultado->bits[] = $aux;
	}
	if ((bool)($status & bindec('0000000001000000'))) {
		$aux = new stdClass;
		$aux->bit = 6;
		$aux->descrip = "Buffer de impresora lleno.";
		$resultado->bits[] = $aux;
	}
	if ((bool)($status & bindec('0000000010000000'))) {
		//$aux = new stdClass;
		//$aux->bit = 7;
		//$aux->descrip = "Buffer de impresora vacío.";
		//$resultado->bits[] = $aux;
	}
	if ((bool)($status & bindec('0000000100000000'))) {
		$aux = new stdClass;
		$aux->bit = 8;
		$aux->descrip = "Tapa de impresora abierta.";
		$resultado->bits[] = $aux;
	}
	if ((bool)($status & bindec('0100000000000000'))) {
		$aux = new stdClass;
		$aux->bit = 14;
		$aux->descrip = "Cajón de dinero cerrado o ausente.";
		$resultado->bits[] = $aux;
	}
	
	return $resultado;
  }
}

?>