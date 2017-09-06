<?php
class class_Ifiscal
{
  
  
  public function method_imprimir($params, $error) {
	$p = $params[0];

	exec("ixbatchw.exe -p COM4 -i " . $p->conexion->archivo . ".in.txt -o " . $p->conexion->archivo . ".out.txt", $out, $res);
	return $res;
  }
  
  
  public function method_adaptar_datos(&$params, $error) {
  	$p = $params[0];
  	
	if (!is_null($p->encabezado)) {
		foreach($p->encabezado as $key => $value) {
			if (is_null($value)) unset($p->encabezado[$key]);
		}
	}

  	if ($p->ifiscal->marca == "Epson") {

		if ($p->cliente->responsabilidadIVA=="N") $p->cliente->responsabilidadIVA = "R";
		if ($p->cliente->responsabilidadIVA=="A") $p->cliente->responsabilidadIVA = "N";
		if ($p->cliente->responsabilidadIVA=="C") $p->cliente->responsabilidadIVA = "F";
		
		if ($p->documento->estacion == "S") $p->documento->estacion = "C";
		
  		if ($p->cliente->tipodoc=="C") $p->cliente->tipodoc = "CUIT";
  		if ($p->cliente->tipodoc=="L") $p->cliente->tipodoc = "CUIL";
  		if ($p->cliente->tipodoc=="0") $p->cliente->tipodoc = "LibEnr";
  		if ($p->cliente->tipodoc=="1") $p->cliente->tipodoc = "LibCiv";
  		if ($p->cliente->tipodoc=="2") $p->cliente->tipodoc = "DNI";
  		if ($p->cliente->tipodoc=="3") $p->cliente->tipodoc = "Pasap";
  		if ($p->cliente->tipodoc=="4") $p->cliente->tipodoc = "CedIde";
  		
  		if ($p->rutina == "nota_credito" && trim($p->cliente->tipodoc) == "") {
  			$p->cliente->tipodoc = "DNI";
  			$p->cliente->nrodoc = "0";
  		}

  		
  		if (empty($p->documento_vinculado)) {
  			$p->documento_vinculado = array("", "");
  		} else {
  			if (empty($p->documento_vinculado[0])) $p->documento_vinculado[0] = "";
  			if (empty($p->documento_vinculado[1])) $p->documento_vinculado[1] = "";
  		}

  		
		foreach($p->pago as $item) {
			$item->calificador = "T";
		}
		
	    if (!is_null($p->descuento_gral)) {
			$item = new stdClass;
			$item->descrip = $p->descuento_gral->descrip;
			$item->monto = $p->descuento_gral->monto;
			$item->calificador = "D";
			array_unshift($p->pago, $item);
	    }

  		
  		if ($p->ifiscal->modelo == "TM-U220AFII") {
  			if ($p->documento->tipo=="A") {
  				$p->documento->tipo = "T";
  				$p->documento->letra = "A";
  			}
  			if ($p->documento->tipo=="B") {
  				$p->documento->tipo = "T";
  				$p->documento->letra = "B";
  			}
  			if ($p->documento->tipo=="R") {
  				$p->documento->tipo = "M";
  				$p->documento->letra = "A";
  			}
  			if ($p->documento->tipo=="S") {
  				$p->documento->tipo = "M";
  				$p->documento->letra = "B";
  			}
  			
  		} else if ($p->ifiscal->modelo == "LX300F+") {
  			if ($p->documento->tipo=="A") {
  				$p->documento->tipo = "F";
  				$p->documento->letra = "A";
  			}
  			if ($p->documento->tipo=="B") {
  				$p->documento->tipo = "F";
  				$p->documento->letra = "B";
  			}
  			if ($p->documento->tipo=="R") {
  				$p->documento->tipo = "N";
  				$p->documento->letra = "A";
  			}
  			if ($p->documento->tipo=="S") {
  				$p->documento->tipo = "N";
  				$p->documento->letra = "B";
  			}
  			if ($p->documento->tipo=="D") {
  				$p->documento->tipo = "D";
  				$p->documento->letra = "A";
  			}
  			if ($p->documento->tipo=="E") {
  				$p->documento->tipo = "D";
  				$p->documento->letra = "B";
  			}
  		}

  	} else if ($p->ifiscal->marca = "Hasar") {
  		foreach($p->detalle as $item) {
  			$item->iva = number_format($item->iva, 2, ".", "");
  		}
  	}
  }
  
  
  public function method_factura($params, $error) {
  	$p = $params[0];
  	
  	$p->rutina = "factura";
  	
  	$this->method_adaptar_datos($params, $error);
  	
  	if ($p->ifiscal->marca == "Epson") {
  		if (is_null($p->conexion->archivo)) {
  			
  		} else {
  			require_once("archivo_Epson.php");
			$ifiscal = new class_archivo_Epson;
			return $ifiscal->method_FACT($params, $error);
  		}
  	} else if ($p->ifiscal->marca = "Hasar") {
  		if (is_null($p->conexion->archivo)) {
  			require_once("tcpip_Hasar.php");
			$ifiscal = new class_tcpip_Hasar;
			return $ifiscal->method_documento_fiscal($params, $error);
  		} else {

  		}
  	}
  }
  
  
  public function method_nota_credito($params, $error) {
  	$p = $params[0];
  	
  	$p->rutina = "nota_credito";
  	
  	$this->method_adaptar_datos($params, $error);
  	
  	if ($p->ifiscal->marca == "Epson") {
  		if (is_null($p->conexion->archivo)) {
  			
  		} else {
  			require_once("archivo_Epson.php");
			$ifiscal = new class_archivo_Epson;
			return $ifiscal->method_FACT($params, $error);
  		}
  	} else if ($p->ifiscal->marca = "Hasar") {
  		if (is_null($p->conexion->archivo)) {
  			require_once("tcpip_Hasar.php");
			$ifiscal = new class_tcpip_Hasar;
			return $ifiscal->method_documento_no_fiscal_homologado($params, $error);
  		} else {

  		}
  	}
  }
  
  
  public function method_nota_debito($params, $error) {
  	$p = $params[0];
  	
  	$p->rutina = "nota_debito";
  	
  	$this->method_adaptar_datos($params, $error);
  	
  	if ($p->ifiscal->marca == "Epson") {
  		if (is_null($p->conexion->archivo)) {
  			
  		} else {
  			require_once("archivo_Epson.php");
			$ifiscal = new class_archivo_Epson;
			return $ifiscal->method_FACT($params, $error);
  		}
  	} else if ($p->ifiscal->marca = "Hasar") {
  		if (is_null($p->conexion->archivo)) {
  			require_once("tcpip_Hasar.php");
			$ifiscal = new class_tcpip_Hasar;
			return $ifiscal->method_documento_fiscal($params, $error);
  		} else {

  		}
  	}
  }
  
  
  public function method_cierreX($params, $error) {
  	$p = $params[0];
  	
  	$p->rutina = "cierreX";
  	
  	if ($p->ifiscal->marca == "Epson") {
  		if (is_null($p->conexion->archivo)) {
  			
  		} else {
  			require_once("archivo_Epson.php");
			$ifiscal = new class_archivo_Epson;
			return $ifiscal->method_CIERRE($params, $error);
  		}
  	} else if ($p->ifiscal->marca = "Hasar") {
  		if (is_null($p->conexion->archivo)) {
  			require_once("tcpip_Hasar.php");
			$ifiscal = new class_tcpip_Hasar;
			return $ifiscal->method_cierreX($params, $error);
  		} else {

  		}
  	}
  }
  
  
  public function method_cierreZ($params, $error) {
  	$p = $params[0];
  	
  	$p->rutina = "cierreZ";
  	
  	if ($p->ifiscal->marca == "Epson") {
  		if (is_null($p->conexion->archivo)) {
  			
  		} else {
  			require_once("archivo_Epson.php");
			$ifiscal = new class_archivo_Epson;
			return $ifiscal->method_CIERRE($params, $error);
  		}
  	} else if ($p->ifiscal->marca = "Hasar") {
  		if (is_null($p->conexion->archivo)) {
  			require_once("tcpip_Hasar.php");
			$ifiscal = new class_tcpip_Hasar;
			return $ifiscal->method_cierreZ($params, $error);
  		} else {

  		}
  	}
  }
  
  
  public function method_cierreZ_numero($params, $error) {
  	$p = $params[0];
  	
  	$p->rutina = "cierreZ_numero";
  	
  	if ($p->ifiscal->marca == "Epson") {
  		if (is_null($p->conexion->archivo)) {
  			
  		} else {
  			require_once("archivo_Epson.php");
			$ifiscal = new class_archivo_Epson;
			return $ifiscal->method_AUDITORIAZ($params, $error);
  		}
  	} else if ($p->ifiscal->marca = "Hasar") {
  		if (is_null($p->conexion->archivo)) {
  			require_once("tcpip_Hasar.php");
			$ifiscal = new class_tcpip_Hasar;
			return $ifiscal->method_cierreZ_numero($params, $error);
  		} else {

  		}
  	}
  }
  
  
  public function method_parsear_salida($params, $error) {
  	$p = $params[0];
  	
  	$this->method_adaptar_datos($params, $error);
  	
  	if ($p->ifiscal->marca == "Epson") {
  		if (is_null($p->conexion->archivo)) {
  			
  		} else {
  			require_once("archivo_Epson.php");
			$ifiscal = new class_archivo_Epson;
			return $ifiscal->method_parsear_salida($params, $error);
  		}
  	} else if ($p->ifiscal->marca = "Hasar") {
  		
  	}
  }
}

?>