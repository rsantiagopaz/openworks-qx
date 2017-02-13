<?php

class class_Fe
{
  function __construct() {
  	require("Fe_config.php");
  	
	mysql_connect("$servidor", "$usuario", "$password");
	mysql_select_db("$base");
	mysql_query("SET NAMES 'utf8'");
  }
  
  
  public function method_fe_documento($params, $error) {
  	$p = $params[0];
  	
  	require("Fe_config.php");
  	
  	$factura = $p->factura;
  	
  	$cwd = getcwd();
	chdir("$pyafipws");
  	
	// Guardar el archivo json para consultar la ultimo numero de factura:
	$json = file_put_contents('./entrada.txt', json_encode(array($factura)));
	
	file_put_contents('./salida.txt', "[]");
	
	// Obtener el último número para este tipo de comprobante / punto de venta:
	exec("$rece1 $ini /json /ult " . $factura['tipo_cbte'] . " " . $factura['punto_vta']);
	
	$json = file_get_contents('./salida.txt');
	$salida = json_decode($json, true);
	
	if (empty($salida[0]['err_msg'])) {
		$cbte_nro = intval($salida[0]['cbt_desde']) + 1;
		
		// Vuelvo a guardar el archivo json para actualizar el número de factura:
		$factura['cbt_desde'] = $cbte_nro;  // para WSFEv1
		$factura['cbt_hasta'] = $cbte_nro;  // para WSFEv1
		$factura['cbte_nro'] = $cbte_nro;   // para PDF
		$json = file_put_contents('./entrada.txt', json_encode(array($factura)));
		
		file_put_contents('./salida.txt', "[]");
		
		// Obtención de CAE: llamo a la herramienta para WSFEv1
		exec("$rece1 $ini /json");
		
		// Ejemplo para levantar el archivo json con el CAE obtenido:
		$json = file_get_contents('./salida.txt');
		$salida = json_decode($json, true);
		
		if (empty($salida[0]['err_msg'])) {
			// Vuelvo a guardar el archivo json para actualizar el CAE y otros datos:
			$factura['cae'] = $salida[0]['cae'];
			$factura['fecha_vto'] = $salida[0]['fch_venc_cae'];
			$factura['motivos_obs'] = $salida[0]['motivos_obs'];
			$factura['err_code'] = $salida[0]['err_code'];
			$factura['err_msg'] = $salida[0]['err_msg'];
			$json = file_put_contents('./entrada.txt', json_encode(array($factura)));
			
			// Genero la factura en PDF (agregar --mostrar si se tiene visor de PDF)
			//exec("$pyfepdf $ini --cargar --json --mostrar");
		}
	}
	
	$sql = "INSERT fe_documento SET";
	$sql.= "  punto_vta=" . $factura['punto_vta'];
	$sql.= "  tipo_cbte=" . $factura['tipo_cbte'];
	$sql.= ", cbt_desde=" . $salida[0]['cbt_desde'];
	$sql.= ", cbt_hasta=" . $salida[0]['cbt_hasta'];
	$sql.= ", cae='" . $factura['cae'] . "'";
	$sql.= ", emision_tipo='" . $salida[0]['emision_tipo'] . "'";
	$sql.= ", err_msg='" . $salida[0]['err_msg'] . "'";
	$sql.= ", err_code='" . $salida[0]['err_code'] . "'";
	$sql.= ", fch_venc_cae='" . $salida[0]['fch_venc_cae'] . "'";
	$sql.= ", motivos_obs='" . $salida[0]['motivos_obs'] . "'";
	$sql.= ", reproceso='" . $salida[0]['reproceso'] . "'";
	$sql.= ", resultado='" . $salida[0]['resultado'] . "'";
	$sql.= ", factura='" . htmlentities($factura) . "'";
	$sql.= ", salida='" . htmlentities($salida) . "'";

	mysql_query($sql);
	$salida[0]['id_fe_documento'] = mysql_insert_id();
	
	return $salida;
  }
}

?>