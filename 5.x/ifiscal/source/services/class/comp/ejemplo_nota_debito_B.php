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
$p->documento->tipo = "A";
$p->documento->estacion = "S";

$p->cliente = new stdClass;
$p->cliente->nombre = "ABDALA DANIEL SEBASTIAN";
$p->cliente->domicilio = "ABSALON ROJAS 246 ( LA BANDA)";
$p->cliente->responsabilidadIVA = "I";
$p->cliente->nrodoc = "20269557495";
$p->cliente->tipodoc = "C";




$p->detalle = array();
$item = new stdClass;
$item->descrip = "310579 - SHERWIN WILLIAMS - LOXON FRENTES IMPERMEABILIZANTE - BLANCO - 20lts";
$item->cantidad = 1;
$item->monto = 908.89;
$item->iva = "21.00";
$item->imputacion = "M";
$item->impuesto_interno = 0;
$item->calificador_monto = "T";
$p->detalle[] = $item;

$item = new stdClass;
$item->descrip = "38569 - POLILAK - XYLASOL LASUR PROTECTOR - NATURAL - 4lts";
$item->cantidad = 1;
$item->monto = 223.36;
$item->iva = "21.00";
$item->imputacion = "M";
$item->impuesto_interno = 0;
$item->calificador_monto = "T";
$p->detalle[] = $item;

$item = new stdClass;
$item->descrip = "311138 - SHERWIN WILLIAMS - PROMAR 400 LATEX EXT.INT - BLANCO - 20lts";
$item->cantidad = 2;
$item->monto = 439.82;
$item->iva = "21.00";
$item->imputacion = "M";
$item->impuesto_interno = 0;
$item->calificador_monto = "T";
$p->detalle[] = $item;

$item = new stdClass;
$item->descrip = "33957 - SHERWIN WILLIAMS - PROBASE FIJADOR SELLADOR - TRANSPARENTE - 20lts";
$item->cantidad = 1;
$item->monto = 303.1;
$item->iva = "21.00";
$item->imputacion = "M";
$item->impuesto_interno = 0;
$item->calificador_monto = "T";
$p->detalle[] = $item;

$item = new stdClass;
$item->descrip = "315710 - SHERWIN WILLIAMS - LOXON INTERIOR MATE BASE TINTOMETRICA - BASE EW - 18lts";
$item->cantidad = 1;
$item->monto = 860.35;
$item->iva = "21.00";
$item->imputacion = "M";
$item->impuesto_interno = 0;
$item->calificador_monto = "T";
$p->detalle[] = $item;

$item = new stdClass;
$item->descrip = "COLOR 6120 SW - 1lts";
$item->cantidad = 1;
$item->monto = 70;
$item->iva = "21.00";
$item->imputacion = "M";
$item->impuesto_interno = 0;
$item->calificador_monto = "T";
$p->detalle[] = $item;

$item = new stdClass;
$item->descrip = "315703 - SHERWIN WILLIAMS - LOXON INTERIOR MATE BASE TINTOMETRICA - BASE DB - 3,60lts";
$item->cantidad = 1;
$item->monto = 158.36;
$item->iva = "21.00";
$item->imputacion = "M";
$item->impuesto_interno = 0;
$item->calificador_monto = "T";
$p->detalle[] = $item;

$item = new stdClass;
$item->descrip = "COLOR 6123 SW - 1lts";
$item->cantidad = 1;
$item->monto = 90;
$item->iva = "21.00";
$item->imputacion = "M";
$item->impuesto_interno = 0;
$item->calificador_monto = "T";
$p->detalle[] = $item;




$p->descuento_gral = new stdClass;
$p->descuento_gral->descrip = "Importe";
$p->descuento_gral->monto = 353.7;
$p->descuento_gral->imputacion = "m";
$p->descuento_gral->calificador_monto = "T";

$p->pago = array();
$item = new stdClass;
$item->descrip = "Efectivo";
$item->monto = 3140;
$p->pago[] = $item;




$a = array($p);
$IFiscal = new class_IFiscal;
$resultado = $IFiscal->method_documento_fiscal($a, null);
echo json_encode($resultado);

?>
