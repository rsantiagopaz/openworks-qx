<?php
require("Ifiscal.php");


$nc = new stdClass();
	$nc->conexion = new stdClass;
	$nc->conexion->host = "192.168.0.78";
	$nc->conexion->port = "1600";

	$nc->ifiscal = new stdClass();
	$nc->ifiscal->marca = "Hasar";
	$nc->ifiscal->modelo = "SMH/P-715F";
	$nc->ifiscal->firmware = "1.00";

	$nc->cliente = new stdClass();
	$nc->cliente->nombre = "PRUEBA DE SISTEMA ND";
	$nc->cliente->domicilio = "Rivadavia 1018";
	$nc->cliente->tipodoc = "2";
	$nc->cliente->nrodoc = "11223344";
	$nc->cliente->responsabilidadIVA = "C";

	$nc->documento = new stdClass;
	$nc->documento->tipo = "E";
	$nc->documento->estacion = "T";
	$nc->documento->copias = 1;

	$nc->encabezado = Array(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
	$nc->encabezado[11] = "VENDEDOR: ";
	$nc->encabezado[12] = "Reka";

	$nc->detalle = Array();
		$item = new stdClass();
		$item->monto = 0.05;
		$item->descrip = "Prueba de Nota de Debito B";
		$item->cantidad = 1;
		$item->iva = "21.00";
		$item->operacion = "M";
		$item->impuesto_interno = 0;
		$item->calificador_monto = "T";
	$nc->detalle []= $item;

	$nc->descuento_gral = new stdClass();
	$nc->descuento_gral->descrip = "Importe";
	$nc->descuento_gral->monto = 0.04;
	$nc->descuento_gral->imputacion = "m";
	$nc->descuento_gral->calificador_monto = "T";

	$nc->pago = array();
		
	$nc->pago[0] = new stdClass();
	$nc->pago[0]->descrip = "Efectivo";
	$nc->pago[0]->monto = 0.01;

	$nc->documento_vinculado = Array();
	$nc->documento_vinculado[0] = "NC Nro: 1";




$a = array($nc);
$Ifiscal = new class_Ifiscal;
$resultado = $Ifiscal->method_nota_debito($a, null);
echo json_encode($resultado);

?>
