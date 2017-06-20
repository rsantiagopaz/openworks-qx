
<?php
// Este modulo contiene el c�digo a disposicion por parte de IFDRIVERS
// en una base TAL CUAL. Todo receptor del Modulo se considera
// bajo licencia de los derechos de autor de IFDRIVERS para utilizar el
// codigo fuente siempre en modo que el o ella considere conveniente,
// incluida la copia, la compilacion, su modificacion o la redistribucion,
// con o sin modificaciones. Ninguna licencia o patentes de IFDRivers
// este implicita en la presente licencia.
//
// El usuario del codigo fuente debera entender que IFDRIVERS no puede
// Proporcionar apoyo tecnico para el modulo y no sera Responsable
// de las consecuencias del uso del programa.
//
// Todas las comunicaciones, incluida esta, no deben ser removidos
// del modulo sin el consentimiento previo por escrito de IFDRIVERS
// www: http://www.impresoras-fiscales.com.ar/
// email: soporte@impresoras-fiscales.com.ar
//
// Instrucciones para usar el driver y las funciones de alto nivel en PHP:
//
// 1) Instale la extension fiscal en el directorio ext de PHP.
// 2) Agregue la extension fiscal en el archivo php.ini, por ejemplo
//
// Para versiones de PHP Thread Safe ( la mas usada)
// extension = php_LX30V5xts.dll 
//
// Para versiones de PHP Non-Thread Safe (la menos usada)
// extension = php_LX30V5xnts.dll 
//
// 3) Copie el archivo con estas funciones al directorio de su su proyecto.
// 4) Agregue las funciones con la funcion required al principio del codigo php
// 5) Todas las funciones de la extension fiscal mas las funciones de alto nivel
//    seran accesibles desde PHP.
// 
// Por ejemplo:
//
// require 'LX30PhpApi.php'
//
// $nError = IF_OPEN("COM1",9600);
//
// $nError = Sincro();
//
// ....etc
//

//***************************************************************
//* 1. Comandos de diagn�stico
//*******************************************************************************
// ESTADO()
// 
// Syntax: 
//		ESTADO($byVar1);
// Prop�sito:
//		Consulta de estado
// Argumentos: 
//		byVar1	C�digo de operaci�n {NACDP}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION ESTADO($byVar1)
{

 if(!is_string($byVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return (-1);
 }

 $strBuff= "@ESTADO" . "|" . $byVar1;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//***************************************************************
//* 2. Comandos de control fiscal
//*******************************************************************************
// CIERRE()
// 
// Syntax: 
//		CIERRE($byVar1, $byVar2);
// Prop�sito:
//		Cierre de jornada fiscal
// Argumentos: 
//		byVar1	Tipo de reporte {ZX}
//		byVar2	Imprimir {PN}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION CIERRE($byVar1, $byVar2)
{
 global $conexion;

 if(!is_string($byVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return (-1);
 }

 if(!is_string($byVar2))
 {
  echo "Error: el tipo del parametro 2 no coincide\n";
  return (-1);
 }

 $strBuff = "@CIERRE" . "|" . $byVar1 . "|" . $byVar2;
 $strBuff.= "\r\n";
 
 $nError = fwrite($conexion, $strBuff);
 $nError = "@CIERRE" . "|" . $nError;
 return ($nError);
}
//*******************************************************************************
// CIERREZ()
// 
// Syntax: 
//		CIERREZ();
// Prop�sito:
//		Efect�a un CierreZ
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION CIERREZ()
{

 $strBuff= "@CIERREZ";	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// CIERREX()
// 
// Syntax: 
//		CIERREX();
// Prop�sito:
//		Efectua un CierreX
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION CIERREX()
{

 $strBuff= "@CIERREX";	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// AUDITORIAF()
// 
// Syntax: 
//		AUDITORIAF($strVar1, $strVar2, $byVar3);
// Prop�sito:
//		Reporte de auditor�a por fechas
// Argumentos: 
//		strVar1	Fecha inicial (AAMMDD) (max 6 bytes)
//		strVar2	Fecha final (AAMMDD) (max 6 bytes)
//		byVar3	tipo {TDtd}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION AUDITORIAF($strVar1, $strVar2, $byVar3)
{

 if(!is_string($strVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return (-1);
 }

 if(!is_string($strVar2))
 {
  echo "Error: el tipo del parametro 2 no coincide\n";
  return (-1);
 }

 if(!is_string($byVar3))
 {
  echo "Error: el tipo del parametro 3 no coincide\n";
  return (-1);
 }

 $strBuff= "@AUDITORIAF" . "|" . $strVar1 . "|" . $strVar2 . "|" . $byVar3;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// AUDITORIAZ()
// 
// Syntax: 
//		AUDITORIAZ($nVar1, $nVar2, $byVar3);
// Prop�sito:
//		Reporte de auditor�a por fechas
// Argumentos: 
//		nVar1	Nro Z inicial (nnnn)
//		nVar2	Nro Z final (nnnn)
//		byVar3	tipo {TDtd}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION AUDITORIAZ($nVar1, $nVar2, $byVar3)
{
 global $conexion;

 if(!is_int($nVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return -1;
 }

 if(!is_int($nVar2))
 {
  echo "Error: el tipo del parametro 2 no coincide\n";
  return -1;
 }

 if(!is_string($byVar3))
 {
  echo "Error: el tipo del parametro 3 no coincide\n";
  return (-1);
 }

 $strBuff = "@AUDITORIAZ" . "|" . $nVar1 . "|" . $nVar2 . "|" . $byVar3;
 $strBuff.= "\r\n";
 
 $nError = fwrite($conexion, $strBuff);
 $nError = "@AUDITORIAZ" . "|" . $nError;
 return ($nError);
}
//***************************************************************
//* 3. Comandos para generar comprobantes no fiscales
//*******************************************************************************
// PREFERENCIA()
// 
// Syntax: 
//		PREFERENCIA($byVar1, $byVar2, $byVar3, $byVar4, $strVar5, $strVar6, $strVar7);
// Prop�sito:
//		Seleccionar las preferencias del usuario
// Argumentos: 
//		byVar1	Se debe enviar 'P' {P}
//		byVar2	Opci�n 2 {DP}
//		byVar3	Opci�n 3 {MSR}
//		byVar4	Opci�n 4 {FUS}
//		strVar5	Opci�n 5 (max 3 bytes)
//		strVar6	Opci�n 6 (max 3 bytes)
//		strVar7	Opci�n 7 (max 3 bytes)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION PREFERENCIA($byVar1, $byVar2, $byVar3, $byVar4, $strVar5, $strVar6, $strVar7)
{

 if(!is_string($byVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return (-1);
 }

 if(!is_string($byVar2))
 {
  echo "Error: el tipo del parametro 2 no coincide\n";
  return (-1);
 }

 if(!is_string($byVar3))
 {
  echo "Error: el tipo del parametro 3 no coincide\n";
  return (-1);
 }

 if(!is_string($byVar4))
 {
  echo "Error: el tipo del parametro 4 no coincide\n";
  return (-1);
 }

 if(!is_string($strVar5))
 {
  echo "Error: el tipo del parametro 5 no coincide\n";
  return (-1);
 }

 if(!is_string($strVar6))
 {
  echo "Error: el tipo del parametro 6 no coincide\n";
  return (-1);
 }

 if(!is_string($strVar7))
 {
  echo "Error: el tipo del parametro 7 no coincide\n";
  return (-1);
 }

 $strBuff= "@PREFERENCIA" . "|" . $byVar1 . "|" . $byVar2 . "|" . $byVar3 . "|" . 
             $byVar4 . "|" . $strVar5 . "|" . $strVar6 . "|" . $strVar7;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// LEEPREFERENCIA()
// 
// Syntax: 
//		LEEPREFERENCIA($byVar1, $byVar2, $byVar3, $byVar4, $byVar5);
// Prop�sito:
//		Leer las preferencias del usuario
// Argumentos: 
//		byVar1	Se debe enviar P {P}
//		byVar2	Opci�n 2 {DP}
//		byVar3	Opci�n 3 {SR}
//		byVar4	Opci�n 4 {S}
//		byVar5	Opci�n 5 {U}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION LEEPREFERENCIA($byVar1, $byVar2, $byVar3, $byVar4, $byVar5)
{

 if(!is_string($byVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return (-1);
 }

 if(!is_string($byVar2))
 {
  echo "Error: el tipo del parametro 2 no coincide\n";
  return (-1);
 }

 if(!is_string($byVar3))
 {
  echo "Error: el tipo del parametro 3 no coincide\n";
  return (-1);
 }

 if(!is_string($byVar4))
 {
  echo "Error: el tipo del parametro 4 no coincide\n";
  return (-1);
 }

 if(!is_string($byVar5))
 {
  echo "Error: el tipo del parametro 5 no coincide\n";
  return (-1);
 }

 $strBuff= "@LEEPREFERENCIA" . "|" . $byVar1 . "|" . $byVar2 . "|" . $byVar3 . "|" . 
             $byVar4 . "|" . $byVar5;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// ESTACIONPPAL()
// 
// Syntax: 
//		ESTACIONPPAL();
// Prop�sito:
//		Preparar estaci�n principal
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION ESTACIONPPAL()
{

 $strBuff= "@ESTACIONPPAL";	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// NOFISABRE()
// 
// Syntax: 
//		NOFISABRE($byVar1);
// Prop�sito:
//		Abrir comprobante no-fiscal
// Argumentos: 
//		byVar1	Se debe enviar S para imprimir en hoja suelta {S}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION NOFISABRE($byVar1)
{

 if(!is_string($byVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return (-1);
 }

 $strBuff= "@NOFISABRE" . "|" . $byVar1;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// NOFISITEM()
// 
// Syntax: 
//		NOFISITEM($strVar1);
// Prop�sito:
//		Imprimir texto no-fiscal
// Argumentos: 
//		strVar1	Texto no fiscal (max 136 bytes)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION NOFISITEM($strVar1)
{

 if(!is_string($strVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return (-1);
 }

 $strBuff= "@NOFISITEM" . "|" . $strVar1;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// NOFISCIERRA()
// 
// Syntax: 
//		NOFISCIERRA($byVar1);
// Prop�sito:
//		Cerrar comprobante no-fiscal
// Argumentos: 
//		byVar1	Tipo de corte (opci�n ignorada en LX300F y FX880F) {TP}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION NOFISCIERRA($byVar1)
{

 if(!is_string($byVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return (-1);
 }

 $strBuff= "@NOFISCIERRA" . "|" . $byVar1;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//***************************************************************
//* 4. Comandos de control de la impresora
//*******************************************************************************
// AVANZAHOJA()
// 
// Syntax: 
//		AVANZAHOJA($nVar1);
// Prop�sito:
//		Avanzar hoja suelta o factura
// Argumentos: 
//		nVar1	Nro de l�neas a avanzar (nn)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION AVANZAHOJA($nVar1)
{

 if(!is_int($nVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return -1;
 }

 $strBuff= "@AVANZAHOJA" . "|" . $nVar1;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// CORTAPAPEL()
// 
// Syntax: 
//		CORTAPAPEL();
// Prop�sito:
//		Expulsar Hoja Suelta of Formulario Continuo
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION CORTAPAPEL()
{

 $strBuff= "@CORTAPAPEL";	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//***************************************************************
//* 5. Comandos generales
//*******************************************************************************
// PONEFECHORA()
// 
// Syntax: 
//		PONEFECHORA($strVar1, $strVar2);
// Prop�sito:
//		Ingresar fecha y hora
// Argumentos: 
//		strVar1	Fecha (AAMMDD) (max 6 bytes)
//		strVar2	Hora (HHMMSS) (max 6 bytes)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION PONEFECHORA($strVar1, $strVar2)
{

 if(!is_string($strVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return (-1);
 }

 if(!is_string($strVar2))
 {
  echo "Error: el tipo del parametro 2 no coincide\n";
  return (-1);
 }

 $strBuff= "@PONEFECHORA" . "|" . $strVar1 . "|" . $strVar2;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// PIDEFECHORA()
// 
// Syntax: 
//		PIDEFECHORA();
// Prop�sito:
//		Consultar fecha y hora
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION PIDEFECHORA()
{

 $strBuff= "@PIDEFECHORA";	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// PONEENCABEZADO()
// 
// Syntax: 
//		PONEENCABEZADO($nVar1, $strVar2);
// Prop�sito:
//		Programar texto de encabezamiento y cola
// Argumentos: 
//		nVar1	Nro de l�nea de datos fijos (nnnnn)
//		strVar2	Texto fiscal de datos fijos (max 40 bytes)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION PONEENCABEZADO($nVar1, $strVar2)
{
 global $conexion;

 if(!is_int($nVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return -1;
 }

 if(!is_string($strVar2))
 {
  echo "Error: el tipo del parametro 2 no coincide\n";
  return (-1);
 }

 $strBuff = "@PONEENCABEZADO" . "|" . $nVar1 . "|" . $strVar2;
 $strBuff.= "\r\n";
 
 $nError = fwrite($conexion, $strBuff);
 $nError = "@PONEENCABEZADO" . "|" . $nError;
 return ($nError);
}
//*******************************************************************************
// PIDEENCABEZADO()
// 
// Syntax: 
//		PIDEENCABEZADO($nVar1);
// Prop�sito:
//		Consultar texto de encabezamiento y cola
// Argumentos: 
//		nVar1	Nro de l�nea de datos fijos (nnnnn)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION PIDEENCABEZADO($nVar1)
{

 if(!is_int($nVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return -1;
 }

 $strBuff= "@PIDEENCABEZADO" . "|" . $nVar1;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// BARCODE()
// 
// Syntax: 
//		BARCODE($nVar1, $strVar2, $nVar3);
// Prop�sito:
//		Imprimir C�digo de Barras en los encabezados o pi� del Ticket.
// Argumentos: 
//		nVar1	Tipo de c�digo de Barra a imprimir (nn)
//		strVar2	Datos a Imprimir (max 40 bytes)
//		nVar3	Nro de l�nea de datos fijos (nnnnn)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION BARCODE($nVar1, $strVar2, $nVar3)
{

 if(!is_int($nVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return -1;
 }

 if(!is_string($strVar2))
 {
  echo "Error: el tipo del parametro 2 no coincide\n";
  return (-1);
 }

 if(!is_int($nVar3))
 {
  echo "Error: el tipo del parametro 3 no coincide\n";
  return -1;
 }

 $strBuff= "@BARCODE" . "|" . $nVar1 . "|" . $strVar2 . "|" . $nVar3;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// ZONAS()
// 
// Syntax: 
//		ZONAS($nVar1, $nVar2, $nVar3, $nVar4, $nVar5);
// Prop�sito:
//		Configurar zonas de impresi�n fiscal
// Argumentos: 
//		nVar1	Nro de zona a configurar (nnn)
//		nVar2	Coordenada horizontal borde superior izquierdo (nn)
//		nVar3	Coordenada vertical  borde superior izquierdo (nn)
//		nVar4	Coordenada horizontal borde inferior derecho (nn)
//		nVar5	Coordenada vertical borde inferior derecho (nn)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION ZONAS($nVar1, $nVar2, $nVar3, $nVar4, $nVar5)
{

 if(!is_int($nVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return -1;
 }

 if(!is_int($nVar2))
 {
  echo "Error: el tipo del parametro 2 no coincide\n";
  return -1;
 }

 if(!is_int($nVar3))
 {
  echo "Error: el tipo del parametro 3 no coincide\n";
  return -1;
 }

 if(!is_int($nVar4))
 {
  echo "Error: el tipo del parametro 4 no coincide\n";
  return -1;
 }

 if(!is_int($nVar5))
 {
  echo "Error: el tipo del parametro 5 no coincide\n";
  return -1;
 }

 $strBuff= "@ZONAS" . "|" . $nVar1 . "|" . $nVar2 . "|" . $nVar3 . "|" . $nVar4 . "|" . 
             $nVar5;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// OFFSET()
// 
// Syntax: 
//		OFFSET($nVar1);
// Prop�sito:
//		Preferencias del offset
// Argumentos: 
//		nVar1	Valor en l�neas desde el borde superior en la cual se empezar� a imprimir los subtotales de la factura (nn)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION OFFSET($nVar1)
{

 if(!is_int($nVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return -1;
 }

 $strBuff= "@OFFSET" . "|" . $nVar1;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// LEEZONAS()
// 
// Syntax: 
//		LEEZONAS($nVar1);
// Prop�sito:
//		Obtener la configuraci�n de las zonas de impresi�n
// Argumentos: 
//		nVar1	Nro de zona (nnn)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION LEEZONAS($nVar1)
{

 if(!is_int($nVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return -1;
 }

 $strBuff= "@LEEZONAS" . "|" . $nVar1;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// CLEARZONEDAT()
// 
// Syntax: 
//		CLEARZONEDAT();
// Prop�sito:
//		Borrar la configuraci�n de las zonas de impresi�n
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION CLEARZONEDAT()
{

 $strBuff= "@CLEARZONEDAT";	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// CLEARUSERDAT()
// 
// Syntax: 
//		CLEARUSERDAT();
// Prop�sito:
//		Borrar todas las cfg def por el usuario
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION CLEARUSERDAT()
{

 $strBuff= "@CLEARUSERDAT";	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//***************************************************************
//* 6. Emisi�n de Facturas y Notas de D�bito,Cr�dito y Recibos
//*******************************************************************************
// FACTABRE()
// 
// Syntax: 
//		FACTABRE($byVar1, $byVar2, $byVar3, $nVar4, $byVar5, $strVar6, $byVar7, $byVar8, 
//		          $strVar9, $strVar10, $strVar11, $strVar12, $byVar13, $strVar14, 
//		           $strVar15, $strVar16, $strVar17, $strVar18, $byVar19);
// Prop�sito:
//		Abrir comprobante fiscal Factura o Nota de Cr�dito
// Argumentos: 
//		byVar1	Tipo de documento {FDRNELC}
//		byVar2	Tipo de salida impresa para factura fiscal o recibo - factura {CS}
//		byVar3	Letra del documento fiscal (A,B,C o X) {ABCX}
//		nVar4	Cantidad de copias que se deben IMPRIMIR (1 a 5) (n)
//		byVar5	Tipo de formulario que se utiliza para la factura emitidas en hoja suelta o formulario continuo {PFA}
//		strVar6	Tama�o de los caracteres que se van a utilizar en toda la factura emitida en hoja suelta o formulario continuo) (max 2 bytes)
//		byVar7	Responsabilidad frente al IVA del EMISOR en el modo entrenamiento {IRNEM}
//		byVar8	Responsabilidad frente al IVA del COMPRADOR {IRNEMFS}
//		strVar9	Nombre comercial del comprador l�nea 1 (max 80 bytes)
//		strVar10	Nombre comercial del comprador l�nea 2 (max 80 bytes)
//		strVar11	Tipo de documento del comprador (CUIT, CUIL,DNI) (max 6 bytes)
//		strVar12	CUIT o documento del comprador (max 11 bytes)
//		byVar13	Linea OPCIONAL bien de USO {NB}
//		strVar14	Domicilio del comprador, l�nea 1 (max 40 bytes)
//		strVar15	Domicilio del comprador, l�nea 2 (max 40 bytes)
//		strVar16	Domicilio del comprador, l�nea 3 (max 40 bytes)
//		strVar17	L�nea 1 con datos sobre los remitos relacionados (max 60 bytes)
//		strVar18	L�nea 2 con datos sobre los remitos relacionados (max 60 bytes)
//		byVar19	Formato para almacenar los datos (C o G) {CG}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION FACTABRE($byVar1, $byVar2, $byVar3, $nVar4, $byVar5, $strVar6, $byVar7, 
                   $byVar8, $strVar9, $strVar10, $strVar11, $strVar12, $byVar13, 
                    $strVar14, $strVar15, $strVar16, $strVar17, $strVar18, 
                     $byVar19)
{
 global $conexion;

 if(!is_string($byVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return (-1);
 }

 if(!is_string($byVar2))
 {
  echo "Error: el tipo del parametro 2 no coincide\n";
  return (-1);
 }

 if(!is_string($byVar3))
 {
  echo "Error: el tipo del parametro 3 no coincide\n";
  return (-1);
 }

 if(!is_int($nVar4))
 {
  echo "Error: el tipo del parametro 4 no coincide\n";
  return -1;
 }

 if(!is_string($byVar5))
 {
  echo "Error: el tipo del parametro 5 no coincide\n";
  return (-1);
 }

 if(!is_string($strVar6))
 {
  echo "Error: el tipo del parametro 6 no coincide\n";
  return (-1);
 }

 if(!is_string($byVar7))
 {
  echo "Error: el tipo del parametro 7 no coincide\n";
  return (-1);
 }

 if(!is_string($byVar8))
 {
  echo "Error: el tipo del parametro 8 no coincide\n";
  return (-1);
 }

 if(!is_string($strVar9))
 {
  echo "Error: el tipo del parametro 9 no coincide\n";
  return (-1);
 }

 if(!is_string($strVar10))
 {
  echo "Error: el tipo del parametro 10 no coincide\n";
  return (-1);
 }

 if(!is_string($strVar11))
 {
  echo "Error: el tipo del parametro 11 no coincide\n";
  return (-1);
 }

 if(!is_string($strVar12))
 {
  echo "Error: el tipo del parametro 12 no coincide\n";
  return (-1);
 }

 if(!is_string($byVar13))
 {
  echo "Error: el tipo del parametro 13 no coincide\n";
  return (-1);
 }

 if(!is_string($strVar14))
 {
  echo "Error: el tipo del parametro 14 no coincide\n";
  return (-1);
 }

 if(!is_string($strVar15))
 {
  echo "Error: el tipo del parametro 15 no coincide\n";
  return (-1);
 }

 if(!is_string($strVar16))
 {
  echo "Error: el tipo del parametro 16 no coincide\n";
  return (-1);
 }

 if(!is_string($strVar17))
 {
  echo "Error: el tipo del parametro 17 no coincide\n";
  return (-1);
 }

 if(!is_string($strVar18))
 {
  echo "Error: el tipo del parametro 18 no coincide\n";
  return (-1);
 }

 if(!is_string($byVar19))
 {
  echo "Error: el tipo del parametro 19 no coincide\n";
  return (-1);
 }

 $strBuff = "@FACTABRE" . "|" . $byVar1 . "|" . $byVar2 . "|" . $byVar3 . "|" . $nVar4 . "|" . 
             $byVar5 . "|" . $strVar6 . "|" . $byVar7 . "|" . $byVar8 . "|" . 
              $strVar9 . "|" . $strVar10 . "|" . $strVar11 . "|" . 
               $strVar12 . "|" . $byVar13 . "|" . $strVar14 . "|" . $strVar15 . "|" . 
                $strVar16 . "|" . $strVar17 . "|" . $strVar18 . "|" . 
                 $byVar19;	
 $strBuff.= "\r\n";

 $nError = fwrite($conexion, $strBuff);
 $nError = "@FACTABRE" . "|" . $nError;
 return ($nError);
}
//*******************************************************************************
// FACTITEM()
// 
// Syntax: 
//		FACTITEM($strVar1, $dblVar2, $dblVar3, $dblVar4, $byVar5, $nVar6, $dblVar7, $strVar8, 
//		          $strVar9, $strVar10, $dblVar11, $dblVar12);
// Prop�sito:
//		Imprimir �tem
// Argumentos: 
//		strVar1	Descripci�n del producto (max 40 bytes)
//		dblVar2	Cantidad de unidades (nnnnn.nnn)
//		dblVar3	Monto del �tem (nnnnnnn.nn)
//		dblVar4	Tasa del IVA (nn.nn)
//		byVar5	Calificador de la operaci�n {MmRr}
//		nVar6	Nro de bultos (nnnnn)
//		dblVar7	Tasa de ajuste variable (.nnnnnnnn)
//		strVar8	L�nea 1 descripci�n complementaria del �tem (max 40 bytes)
//		strVar9	L�nea 2 descripci�n complementaria del �tem (max 40 bytes)
//		strVar10	L�nea 3 descripci�n complementaria del �tem (max 40 bytes)
//		dblVar11	Acrecentamiento (.nnnn)
//		dblVar12	Impuestos internos fijos (nnnnnnnnn.nnnnnnnn)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION FACTITEM($strVar1, $dblVar2, $dblVar3, $dblVar4, $byVar5, $nVar6, $dblVar7, 
                   $strVar8, $strVar9, $strVar10, $dblVar11, $dblVar12)
{
 global $conexion;

 if(!is_string($strVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return (-1);
 }

 if(!is_numeric($dblVar2))
 {
  echo "Error: el tipo del parametro 2 no coincide\n";
  return -1;
 }

 if(!is_numeric($dblVar3))
 {
  echo "Error: el tipo del parametro 3 no coincide\n";
  return -1;
 }

 if(!is_numeric($dblVar4))
 {
  echo "Error: el tipo del parametro 4 no coincide\n";
  return -1;
 }

 if(!is_string($byVar5))
 {
  echo "Error: el tipo del parametro 5 no coincide\n";
  return (-1);
 }

 if(!is_int($nVar6))
 {
  echo "Error: el tipo del parametro 6 no coincide\n";
  return -1;
 }

 if(!is_numeric($dblVar7))
 {
  echo "Error: el tipo del parametro 7 no coincide\n";
  return -1;
 }

 if(!is_string($strVar8))
 {
  echo "Error: el tipo del parametro 8 no coincide\n";
  return (-1);
 }

 if(!is_string($strVar9))
 {
  echo "Error: el tipo del parametro 9 no coincide\n";
  return (-1);
 }

 if(!is_string($strVar10))
 {
  echo "Error: el tipo del parametro 10 no coincide\n";
  return (-1);
 }

 if(!is_numeric($dblVar11))
 {
  echo "Error: el tipo del parametro 11 no coincide\n";
  return -1;
 }

 if(!is_numeric($dblVar12))
 {
  echo "Error: el tipo del parametro 12 no coincide\n";
  return -1;
 }

 $strBuff = "@FACTITEM" . "|" . $strVar1 . "|" . $dblVar2 . "|" . $dblVar3 . "|" . 
             $dblVar4 . "|" . $byVar5 . "|" . $nVar6 . "|" . $dblVar7 . "|" . 
              $strVar8 . "|" . $strVar9 . "|" . $strVar10 . "|" . $dblVar11 . "|" . 
               $dblVar12;	
 $strBuff.= "\r\n";

 $nError = fwrite($conexion, $strBuff);
 $nError = "@FACTITEM" . "|" . $nError;
 return ($nError);
}
//*******************************************************************************
// FACTSUBTOTAL()
// 
// Syntax: 
//		FACTSUBTOTAL($byVar1, $strVar2);
// Prop�sito:
//		Subtotal
// Argumentos: 
//		byVar1	Imprimir {PN}
//		strVar2	Texto a imprimir en el subtotal (max 29 bytes)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION FACTSUBTOTAL($byVar1, $strVar2)
{
 global $conexion;

 if(!is_string($byVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return (-1);
 }

 if(!is_string($strVar2))
 {
  echo "Error: el tipo del parametro 2 no coincide\n";
  return (-1);
 }

 $strBuff = "@FACTSUBTOTAL" . "|" . $byVar1 . "|" . $strVar2;
 $strBuff.= "\r\n";
 
 $nError = fwrite($conexion, $strBuff);
 $nError = "@FACTSUBTOTAL" . "|" . $nError;
 return ($nError);
}
//*******************************************************************************
// FACTPAGO()
// 
// Syntax: 
//		FACTPAGO($strVar1, $dblVar2, $byVar3);
// Prop�sito:
//		Devoluci�n de envases, Bonificaciones y Recargos
// Argumentos: 
//		strVar1	Texto con descripci�n del pago (max 40 bytes)
//		dblVar2	monto (nnnnnnnnnn.nn)
//		byVar3	Calificador del �tem de l�nea {CTtDR}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION FACTPAGO($strVar1, $dblVar2, $byVar3)
{
 global $conexion;

 if(!is_string($strVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return (-1);
 }

 if(!is_numeric($dblVar2))
 {
  echo "Error: el tipo del parametro 2 no coincide\n";
  return -1;
 }

 if(!is_string($byVar3))
 {
  echo "Error: el tipo del parametro 3 no coincide\n";
  return (-1);
 }

 $strBuff = "@FACTPAGO" . "|" . $strVar1 . "|" . $dblVar2 . "|" . $byVar3;
 $strBuff.= "\r\n";
 
 $nError = fwrite($conexion, $strBuff);
 $nError = "@FACTPAGO" . "|" . $nError;
 return ($nError);
}
//*******************************************************************************
// FACTPERCEP()
// 
// Syntax: 
//		FACTPERCEP($strVar1, $byVar2, $dblVar3, $dblVar4);
// Prop�sito:
//		Percepciones Tique Factura
// Argumentos: 
//		strVar1	Descripci�n de la percepci�n (max 25 bytes)
//		byVar2	Indica si es una percepci�n sobre el IVA u otra percepci�n {OIT}
//		dblVar3	Monto de la percepci�n (nnnnnnnn.nn)
//		dblVar4	Tasa del IVA (percepciones sobre el IVA) (nn.nn)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION FACTPERCEP($strVar1, $byVar2, $dblVar3, $dblVar4)
{

 if(!is_string($strVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return (-1);
 }

 if(!is_string($byVar2))
 {
  echo "Error: el tipo del parametro 2 no coincide\n";
  return (-1);
 }

 if(!is_numeric($dblVar3))
 {
  echo "Error: el tipo del parametro 3 no coincide\n";
  return -1;
 }

 if(!is_numeric($dblVar4))
 {
  echo "Error: el tipo del parametro 4 no coincide\n";
  return -1;
 }

 $strBuff= "@FACTPERCEP" . "|" . $strVar1 . "|" . $byVar2 . "|" . $dblVar3 . "|" . 
             $dblVar4;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// FACTCIERRA()
// 
// Syntax: 
//		FACTCIERRA($byVar1, $byVar2, $strVar3);
// Prop�sito:
//		Cerrar comprobante fiscal
// Argumentos: 
//		byVar1	Tipo de documento {FDRNELC}
//		byVar2	Letra del documento fiscal {ABCX}
//		strVar3	Descripci�n que se imprime en la l�nea TOTAL (max 20 bytes)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION FACTCIERRA($byVar1, $byVar2, $strVar3)
{
 global $conexion;

 if(!is_string($byVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return (-1);
 }

 if(!is_string($byVar2))
 {
  echo "Error: el tipo del parametro 2 no coincide\n";
  return (-1);
 }

 if(!is_string($strVar3))
 {
  echo "Error: el tipo del parametro 3 no coincide\n";
  return (-1);
 }

 $strBuff = "@FACTCIERRA" . "|" . $byVar1 . "|" . $byVar2 . "|" . $strVar3;
 $strBuff.= "\r\n";
 
 $nError = fwrite($conexion, $strBuff);
 $nError = "@FACTCIERRA" . "|" . $nError;
 return ($nError);
}
//*******************************************************************************
// FACTCANCEL()
// 
// Syntax: 
//		FACTCANCEL();
// Prop�sito:
//		Cancela una factura
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION FACTCANCEL()
{

 $strBuff= "@FACTCANCEL";	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//***************************************************************
//* 7. Otros comandos
//*******************************************************************************
// CTRLINEA()
// 
// Syntax: 
//		CTRLINEA();
// Prop�sito:
//		Control de Items de l�nea
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION CTRLINEA()
{

 $strBuff= "@CTRLINEA";	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// PAUSA()
// 
// Syntax: 
//		PAUSA($nVar1);
// Prop�sito:
//		Efect�a una pausa
// Argumentos: 
//		nVar1	timeout (en milisegundos) (nnnn)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION PAUSA($nVar1)
{

 if(!is_int($nVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return -1;
 }

 $strBuff= "@PAUSA" . "|" . $nVar1;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// SINCRO()
// 
// Syntax: 
//		SINCRO();
// Prop�sito:
//		Cancela cualquier comprobante fiscal abierto
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION SINCRO()
{

 $strBuff= "@SINCRO";	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// TRANSPORTE()
// 
// Syntax: 
//		TRANSPORTE($byVar1);
// Prop�sito:
//		Abre, cierra o efectua un transporte en reportes detallados
// Argumentos: 
//		byVar1	Tipo de Transporte {OTA}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION TRANSPORTE($byVar1)
{

 if(!is_string($byVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return (-1);
 }

 $strBuff= "@TRANSPORTE" . "|" . $byVar1;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// TRANSPORTEDETAL()
// 
// Syntax: 
//		TRANSPORTEDETAL();
// Prop�sito:
//		Transporte en Reportes Detallados
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION TRANSPORTEDETAL()
{

 $strBuff= "@TRANSPORTEDETAL";	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// TRANSPOABRE()
// 
// Syntax: 
//		TRANSPOABRE();
// Prop�sito:
//		Abre una nueva hoja de transporte
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION TRANSPOABRE()
{

 $strBuff= "@TRANSPOABRE";	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// TRANSPOPIDE()
// 
// Syntax: 
//		TRANSPOPIDE();
// Prop�sito:
//		Cerrar hoja y proceder al transporte
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION TRANSPOPIDE()
{

 $strBuff= "@TRANSPOPIDE";	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// TAMANO()
// 
// Syntax: 
//		TAMANO($nVar1, $nVar2);
// Prop�sito:
//		Configurar el tama�o de la hoja
// Argumentos: 
//		nVar1	Nro de columnas (nn)
//		nVar2	Nro de filas (nn)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION TAMANO($nVar1, $nVar2)
{

 if(!is_int($nVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return -1;
 }

 if(!is_int($nVar2))
 {
  echo "Error: el tipo del parametro 2 no coincide\n";
  return -1;
 }

 $strBuff= "@TAMANO" . "|" . $nVar1 . "|" . $nVar2;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
 
?>
