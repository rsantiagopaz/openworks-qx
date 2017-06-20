<?php
require("IFiscal.php");


$p = new stdClass;

$p->conexion = new stdClass;
$p->conexion->host = '10.0.0.71';
$p->conexion->port = 1600;

$p->ifiscal = new stdClass;
$p->ifiscal->modelo = "P-1120F";
$p->ifiscal->firmware = 1.00;

$p->documento = new stdClass;
$p->documento->tipo = "R";
$p->documento->estacion = "S";

$p->cliente = new stdClass;
$p->cliente->nombre = "ABUD JOSE MIGUEL";
$p->cliente->domicilio = "ALEM 126 LB";
$p->cliente->responsabilidadIVA = "I";
$p->cliente->nrodoc = "20238083029";
$p->cliente->tipodoc = "C";


$p->documento_vinculado = array();
$p->documento_vinculado[0] = "Factura A nro - 6336";


$p->detalle = array();
$item = new stdClass;
$item->descrip = "31902 - Wepel - WEPEL ENDUIDO PLASTIK INTERIOR - BLANCO - 20,000lts";
$item->cantidad = 1;
$item->monto = 209.7;
$item->iva = "21.00";
$item->imputacion = "M";
$item->impuesto_interno = 0;
$item->calificador_monto = "T";
$p->detalle[] = $item;

$item = new stdClass;
$item->descrip = "31920 - Wepel - WEPEL SELLADOR ACROLIT - TRANSPARENTE - 4,000lts";
$item->cantidad = 1;
$item->monto = 59.46;
$item->iva = "21.00";
$item->imputacion = "M";
$item->impuesto_interno = 0;
$item->calificador_monto = "T";
$p->detalle[] = $item;

$item = new stdClass;
$item->descrip = "33742 - NORTON - LIJAS AL AGUA T216 NORFLEX - TRANSPARENTE - 100,000un";
$item->cantidad = 10;
$item->monto = 4.24;
$item->iva = "21.00";
$item->imputacion = "M";
$item->impuesto_interno = 0;
$item->calificador_monto = "T";
$p->detalle[] = $item;

$item = new stdClass;
$item->descrip = "33742 - NORTON - LIJAS AL AGUA T216 NORFLEX - TRANSPARENTE - 150,000un";
$item->cantidad = 15;
$item->monto = 4.24;
$item->iva = "21.00";
$item->imputacion = "M";
$item->impuesto_interno = 0;
$item->calificador_monto = "T";
$p->detalle[] = $item;

$item = new stdClass;
$item->descrip = "34064 - DISTRIBUCIONES FATIMA - CM YESO TUYANO - TRANSPARENTE - 1,000kgs";
$item->cantidad = 2;
$item->monto = 3.06;
$item->iva = "21.00";
$item->imputacion = "M";
$item->impuesto_interno = 0;
$item->calificador_monto = "T";
$p->detalle[] = $item;




$p->descuento_gral = new stdClass;
$p->descuento_gral->descrip = "Importe";
$p->descuento_gral->monto = 26.68;
$p->descuento_gral->imputacion = "m";
$p->descuento_gral->calificador_monto = "T";

$p->pago = array();
$item = new stdClass;
$item->descrip = "Efectivo";
$item->monto = 381.28;
$p->pago[] = $item;




$a = array($p);
$IFiscal = new class_IFiscal;
$resultado = $IFiscal->method_documento_no_fiscal_homologado($a, null);
echo json_encode($resultado);

?>
