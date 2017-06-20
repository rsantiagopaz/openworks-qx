
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
// extension = php_H715V5xts.dll 
//
// Para versiones de PHP Non-Thread Safe (la menos usada)
// extension = php_H715V5xnts.dll 
//
// 3) Copie el archivo con estas funciones al directorio de su su proyecto.
// 4) Agregue las funciones con la funcion required al principio del codigo php
// 5) Todas las funciones de la extension fiscal mas las funciones de alto nivel
//    seran accesibles desde PHP.
// 
// Por ejemplo:
//
// require 'H715PhpApi.php'
//
// $nError = IF_OPEN("COM1",9600);
//
// $nError = Sincro();
//
// ....etc
//

//***************************************************************
//* 1. Comandos de inicializaci�n
//*******************************************************************************
// ConfigureControllerByBlock()
// 
// Syntax: 
//		ConfigureControllerByBlock($dblVar1, $dblVar2, $dblVar3, $byVar4, $byVar5, $byVar6, 
//		                            $byVar7);
// Prop�sito:
//		Configuraci�n del controlador en bloque
// Argumentos: 
//		dblVar1	L�mite de ingreso datos consumidor (nnnnnn.nn)
//		dblVar2	L�mite ticket factura (nnnnnn.nn)
//		dblVar3	Porcentaje IVA responsable inscripto (nn.nn)
//		byVar4	Cantidad de copias
//		byVar5	Impresi�n CAMBIO {PO}
//		byVar6	Impresion leyendas opcionales {PO}
//		byVar7	Tipo de corte del papel de ticket {FPN}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION ConfigureControllerByBlock($dblVar1, $dblVar2, $dblVar3, $byVar4, $byVar5, 
                                     $byVar6, $byVar7)
{

 if(!is_numeric($dblVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return -1;
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

 if(!is_string($byVar6))
 {
  echo "Error: el tipo del parametro 6 no coincide\n";
  return (-1);
 }

 if(!is_string($byVar7))
 {
  echo "Error: el tipo del parametro 7 no coincide\n";
  return (-1);
 }

 $strBuff= "@ConfigureControllerByBlock" . "|" . $dblVar1 . "|" . $dblVar2 . "|" . 
             $dblVar3 . "|" . $byVar4 . "|" . $byVar5 . "|" . $byVar6 . "|" . 
              $byVar7;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// ConfigureControllerByOne()
// 
// Syntax: 
//		ConfigureControllerByOne($byVar1, $strVar2);
// Prop�sito:
//		Config del controlador por par�metros
// Argumentos: 
//		byVar1	Par�metro a modificar {456}
//		strVar2	Valor del par�metro
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION ConfigureControllerByOne($byVar1, $strVar2)
{

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

 $strBuff= "@ConfigureControllerByOne" . "|" . $byVar1 . "|" . $strVar2;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// ChangeIVAResponsability()
// 
// Syntax: 
//		ChangeIVAResponsability($byVar1);
// Prop�sito:
//		Cambio de responsabilidad frente al IVA
// Argumentos: 
//		byVar1	Responsabilidad frente al IVA {INEAMS}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION ChangeIVAResponsability($byVar1)
{

 if(!is_string($byVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return (-1);
 }

 $strBuff= "@ChangeIVAResponsability" . "|" . $byVar1;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// ChangeIBNumber()
// 
// Syntax: 
//		ChangeIBNumber($strVar1);
// Prop�sito:
//		Cambio de nro de ingresos brutos
// Argumentos: 
//		strVar1	Nro de ingresos brutos (max 20 bytes)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION ChangeIBNumber($strVar1)
{

 if(!is_string($strVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return (-1);
 }

 $strBuff= "@ChangeIBNumber" . "|" . $strVar1;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//***************************************************************
//* 2. Comandos de diagn�stico
//*******************************************************************************
// StatusRequest()
// 
// Syntax: 
//		StatusRequest();
// Prop�sito:
//		Consulta de estado
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION StatusRequest()
{

 $strBuff= "@StatusRequest";	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// GetConfigurationData()
// 
// Syntax: 
//		GetConfigurationData();
// Prop�sito:
//		Consulta de configuraci�n
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION GetConfigurationData()
{

 $strBuff= "@GetConfigurationData";	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// GetInitData()
// 
// Syntax: 
//		GetInitData();
// Prop�sito:
//		Consulta de datos de inicializaci�n
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION GetInitData()
{

 $strBuff= "@GetInitData";	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// GetPrinterVersion()
// 
// Syntax: 
//		GetPrinterVersion();
// Prop�sito:
//		Consulta de versi�n de controlador fiscal
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION GetPrinterVersion()
{

 $strBuff= "@GetPrinterVersion";	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//***************************************************************
//* 3. Comandos de control fiscal
//*******************************************************************************
// HistoryCapacity()
// 
// Syntax: 
//		HistoryCapacity();
// Prop�sito:
//		Capacidad restante
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION HistoryCapacity()
{

 $strBuff= "@HistoryCapacity";	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// DailyClose()
// 
// Syntax: 
//		DailyClose($byVar1);
// Prop�sito:
//		Cierre de jornada fiscal
// Argumentos: 
//		byVar1	Z: Cierre de jornada fiscal; X: Informe X {XZ}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION DailyClose($byVar1)
{

 if(!is_string($byVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return (-1);
 }

 $strBuff= "@DailyClose" . "|" . $byVar1;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// DailyCloseByDate()
// 
// Syntax: 
//		DailyCloseByDate($strVar1, $strVar2, $byVar3);
// Prop�sito:
//		Reporte de auditoria por fechas
// Argumentos: 
//		strVar1	Fecha inicial del per�odo (formato AAMMDD) (max 6 bytes)
//		strVar2	Fecha final del per�odo (formato AAMMDD) (max 6 bytes)
//		byVar3	T: datos globales; otro caracter: datos por Z {TO}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION DailyCloseByDate($strVar1, $strVar2, $byVar3)
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

 $strBuff= "@DailyCloseByDate" . "|" . $strVar1 . "|" . $strVar2 . "|" . $byVar3;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// DailyCloseByNumber()
// 
// Syntax: 
//		DailyCloseByNumber($nVar1, $nVar2, $byVar3);
// Prop�sito:
//		Reporte de auditoria por n�mero de Z
// Argumentos: 
//		nVar1	N�mero de Z inicial del per�odo (nnnn)
//		nVar2	N�mero de Z final del per�odo (nnnn)
//		byVar3	T: datos globales; otro caracter: datos por Z {TO}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION DailyCloseByNumber($nVar1, $nVar2, $byVar3)
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

 if(!is_string($byVar3))
 {
  echo "Error: el tipo del parametro 3 no coincide\n";
  return (-1);
 }

 $strBuff= "@DailyCloseByNumber" . "|" . $nVar1 . "|" . $nVar2 . "|" . $byVar3;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// GetDailyReport()
// 
// Syntax: 
//		GetDailyReport($strVar1, $byVar2);
// Prop�sito:
//		Reporte de registro diario
// Argumentos: 
//		strVar1	N�mero de Z o fecha (campo de longitud variable) (max 6 bytes)
//		byVar2	Z: n�mero de Z; T: fecha {ZT}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION GetDailyReport($strVar1, $byVar2)
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

 $strBuff= "@GetDailyReport" . "|" . $strVar1 . "|" . $byVar2;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// GetWorkingMemory()
// 
// Syntax: 
//		GetWorkingMemory();
// Prop�sito:
//		Consulta de memoria de trabajo
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION GetWorkingMemory()
{

 $strBuff= "@GetWorkingMemory";	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// SendFirstIVA()
// 
// Syntax: 
//		SendFirstIVA();
// Prop�sito:
//		Iniciar informaci�n de IVA
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION SendFirstIVA()
{

 $strBuff= "@SendFirstIVA";	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// NextIVATransmission()
// 
// Syntax: 
//		NextIVATransmission();
// Prop�sito:
//		Continuar informaci�n de IVA
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION NextIVATransmission()
{

 $strBuff= "@NextIVATransmission";	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//***************************************************************
//* 4. Emisi�n de documentos fiscales y notas de cr�dito
//*******************************************************************************
// OpenFiscalReceipt()
// 
// Syntax: 
//		OpenFiscalReceipt($byVar1, $byVar2);
// Prop�sito:
//		Abrir comprobante fiscal
// Argumentos: 
//		byVar1	Tipo de documento {TABDE}
//		byVar2	T � S (valor fijo) {TS}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION OpenFiscalReceipt($byVar1, $byVar2)
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

 $strBuff= "@OpenFiscalReceipt" . "|" . $byVar1 . "|" . $byVar2;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// PrintFiscalText()
// 
// Syntax: 
//		PrintFiscalText($strVar1, $byVar2);
// Prop�sito:
//		Imprimir texto fiscal
// Argumentos: 
//		strVar1	Texto fiscal (max 30 bytes)
//		byVar2	Par�metro display: 0, 1 o 2
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION PrintFiscalText($strVar1, $byVar2)
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

 $strBuff= "@PrintFiscalText" . "|" . $strVar1 . "|" . $byVar2;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// PrintLineItem()
// 
// Syntax: 
//		PrintLineItem($strVar1, $dblVar2, $dblVar3, $strVar4, $byVar5, $strVar6, $byVar7, 
//		               $byVar8);
// Prop�sito:
//		Imprimir �tem
// Argumentos: 
//		strVar1	Texto descripci�n del item (max 20 bytes)
//		dblVar2	Cantidad (nnnn.nnnnnnnnnn)
//		dblVar3	Precio unitario (nnnnnn.nn)
//		strVar4	Porcentaje IVA (nn.nn)/(**.**) (max 5 bytes)
//		byVar5	Calificador de la operaci�n {Mm}
//		strVar6	Impuestos internos
//		byVar7	Par�metro display: 0, 1 o 2 {012}
//		byVar8	T: precio total; otro car�cter: precio base {TBO}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION PrintLineItem($strVar1, $dblVar2, $dblVar3, $strVar4, $byVar5, $strVar6, 
                        $byVar7, $byVar8)
{

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

 if(!is_string($strVar4))
 {
  echo "Error: el tipo del parametro 4 no coincide\n";
  return (-1);
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

 $strBuff= "@PrintLineItem" . "|" . $strVar1 . "|" . $dblVar2 . "|" . $dblVar3 . "|" . 
             $strVar4 . "|" . $byVar5 . "|" . $strVar6 . "|" . $byVar7 . "|" . 
              $byVar8;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// PrintLineItem2()
// 
// Syntax: 
//		PrintLineItem2($strVar1, $dblVar2, $dblVar3, $strVar4, $byVar5, $strVar6, $byVar7, 
//		                $byVar8);
// Prop�sito:
//		Imprimir �tem
// Argumentos: 
//		strVar1	Texto descripci�n del item (max 20 bytes)
//		dblVar2	Cantidad (nnnn.nnnnnnnnnn)
//		dblVar3	Precio unitario (nnnnnn.nnnn)
//		strVar4	Porcentaje IVA (nn.nn)/(**.**) (max 5 bytes)
//		byVar5	Calificador de la operaci�n {Mm}
//		strVar6	Impuestos internos
//		byVar7	Par�metro display: 0, 1 o 2 {012}
//		byVar8	T: precio total; otro car�cter: precio base {TBO}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION PrintLineItem2($strVar1, $dblVar2, $dblVar3, $strVar4, $byVar5, $strVar6, 
                         $byVar7, $byVar8)
{

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

 if(!is_string($strVar4))
 {
  echo "Error: el tipo del parametro 4 no coincide\n";
  return (-1);
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

 $strBuff= "@PrintLineItem2" . "|" . $strVar1 . "|" . $dblVar2 . "|" . $dblVar3 . "|" . 
             $strVar4 . "|" . $byVar5 . "|" . $strVar6 . "|" . $byVar7 . "|" . 
              $byVar8;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// LastItemDiscount()
// 
// Syntax: 
//		LastItemDiscount($strVar1, $dblVar2, $byVar3, $byVar4, $byVar5);
// Prop�sito:
//		Descuento/Recargo sobre �ltimo �tem vendido
// Argumentos: 
//		strVar1	Texto descripci�n (max 20 bytes)
//		dblVar2	Monto (nnnnnnn.nn)
//		byVar3	Imputaci�n {Mm}
//		byVar4	Par�metro display: 0, 1 o 2 {012}
//		byVar5	Calificador de monto {BTO}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION LastItemDiscount($strVar1, $dblVar2, $byVar3, $byVar4, $byVar5)
{

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

 $strBuff= "@LastItemDiscount" . "|" . $strVar1 . "|" . $dblVar2 . "|" . $byVar3 . "|" . 
             $byVar4 . "|" . $byVar5;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// GeneralDiscount()
// 
// Syntax: 
//		GeneralDiscount($strVar1, $dblVar2, $byVar3, $byVar4, $byVar5);
// Prop�sito:
//		Descuento general
// Argumentos: 
//		strVar1	Texto descripci�n (max 20 bytes)
//		dblVar2	Monto (nnnnnnn.nn)
//		byVar3	Imputaci�n {Mm}
//		byVar4	Par�metro display: 0, 1 o 2 {012}
//		byVar5	Calificador de monto {BTO}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION GeneralDiscount($strVar1, $dblVar2, $byVar3, $byVar4, $byVar5)
{

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

 $strBuff= "@GeneralDiscount" . "|" . $strVar1 . "|" . $dblVar2 . "|" . $byVar3 . "|" . 
             $byVar4 . "|" . $byVar5;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// ReturnRecharge()
// 
// Syntax: 
//		ReturnRecharge($strVar1, $dblVar2, $strVar3, $byVar4, $strVar5, $byVar6, $byVar7, 
//		                $byVar8);
// Prop�sito:
//		Devoluci�n de envases, Bonificaciones y Recargos
// Argumentos: 
//		strVar1	Texto descripci�n (max 20 bytes)
//		dblVar2	Monto (nnnnnnn.nn)
//		strVar3	Porcentaje IVA (nn.nn)/(**.**) (max 5 bytes)
//		byVar4	Imputaci�n {Mm}
//		strVar5	Impuestos internos
//		byVar6	Par�metro display: 0, 1 o 2 {012}
//		byVar7	T:precio total, otro caracter precio base {BTO}
//		byVar8	Calificador de operaci�n {BO}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION ReturnRecharge($strVar1, $dblVar2, $strVar3, $byVar4, $strVar5, $byVar6, 
                         $byVar7, $byVar8)
{

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

 if(!is_string($strVar3))
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

 if(!is_string($byVar6))
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

 $strBuff= "@ReturnRecharge" . "|" . $strVar1 . "|" . $dblVar2 . "|" . $strVar3 . "|" . 
             $byVar4 . "|" . $strVar5 . "|" . $byVar6 . "|" . $byVar7 . "|" . 
              $byVar8;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// ChargeNonRegisteredTax()
// 
// Syntax: 
//		ChargeNonRegisteredTax($dblVar1);
// Prop�sito:
//		Recargo IVA a Responsable no Inscripto
// Argumentos: 
//		dblVar1	Monto (nnnnnnn.nn)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION ChargeNonRegisteredTax($dblVar1)
{

 if(!is_numeric($dblVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return -1;
 }

 $strBuff= "@ChargeNonRegisteredTax" . "|" . $dblVar1;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// Perceptions()
// 
// Syntax: 
//		Perceptions($strVar1, $strVar2, $dblVar3);
// Prop�sito:
//		Percepciones
// Argumentos: 
//		strVar1	Al�cuota IVA (nn.nn / **.**) (max 5 bytes)
//		strVar2	Texto descripci�n (max 20 bytes)
//		dblVar3	Monto (nnnnnnn.nn)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION Perceptions($strVar1, $strVar2, $dblVar3)
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

 if(!is_numeric($dblVar3))
 {
  echo "Error: el tipo del parametro 3 no coincide\n";
  return -1;
 }

 $strBuff= "@Perceptions" . "|" . $strVar1 . "|" . $strVar2 . "|" . $dblVar3;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// Subtotal()
// 
// Syntax: 
//		Subtotal($byVar1, $strVar2, $byVar3);
// Prop�sito:
//		Subtotal
// Argumentos: 
//		byVar1	Par�metro impresi�n
//		strVar2	Reservado (llenar con un caracter cualquiera) (max 26 bytes)
//		byVar3	Par�metro display: 0, 1 o 2 {012}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION Subtotal($byVar1, $strVar2, $byVar3)
{

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

 if(!is_string($byVar3))
 {
  echo "Error: el tipo del parametro 3 no coincide\n";
  return (-1);
 }

 $strBuff= "@Subtotal" . "|" . $byVar1 . "|" . $strVar2 . "|" . $byVar3;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// TotalTender()
// 
// Syntax: 
//		TotalTender($strVar1, $dblVar2, $byVar3, $byVar4);
// Prop�sito:
//		Total
// Argumentos: 
//		strVar1	Texto de descripci�n (max 30 bytes)
//		dblVar2	Monto pagado (nnnnnnn.nn)
//		byVar3	Calificador operaci�n {CT}
//		byVar4	Par�metro display: 0, 1 o 2 {012}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION TotalTender($strVar1, $dblVar2, $byVar3, $byVar4)
{

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

 if(!is_string($byVar4))
 {
  echo "Error: el tipo del parametro 4 no coincide\n";
  return (-1);
 }

 $strBuff= "@TotalTender" . "|" . $strVar1 . "|" . $dblVar2 . "|" . $byVar3 . "|" . 
             $byVar4;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// CloseFiscalReceipt()
// 
// Syntax: 
//		CloseFiscalReceipt();
// Prop�sito:
//		Cerrar comprobante fiscal
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION CloseFiscalReceipt()
{

 $strBuff= "@CloseFiscalReceipt";	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//***************************************************************
//* 5. Comandos de Comprobantes no fiscal
//*******************************************************************************
// OpenNonFiscalReceipt()
// 
// Syntax: 
//		OpenNonFiscalReceipt();
// Prop�sito:
//		Abrir comprobante no fiscal
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION OpenNonFiscalReceipt()
{

 $strBuff= "@OpenNonFiscalReceipt";	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// OpenNonFiscalSlip()
// 
// Syntax: 
//		OpenNonFiscalSlip();
// Prop�sito:
//		Abrir comprobante no fiscal en impresora slip
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION OpenNonFiscalSlip()
{

 $strBuff= "@OpenNonFiscalSlip";	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// PrintNonFiscalText()
// 
// Syntax: 
//		PrintNonFiscalText($strVar1, $byVar2);
// Prop�sito:
//		Imprimir texto no fiscal
// Argumentos: 
//		strVar1	Texto no fiscal (max 40 bytes)
//		byVar2	Par�metro display: 0, 1 o 2 {012}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION PrintNonFiscalText($strVar1, $byVar2)
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

 $strBuff= "@PrintNonFiscalText" . "|" . $strVar1 . "|" . $byVar2;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// CloseNonFiscalReceipt()
// 
// Syntax: 
//		CloseNonFiscalReceipt();
// Prop�sito:
//		Cerrar comprobante no fiscal
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION CloseNonFiscalReceipt()
{

 $strBuff= "@CloseNonFiscalReceipt";	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//***************************************************************
//* 6. Comandos de documentos no fiscales homologados
//*******************************************************************************
// OpenDNFH()
// 
// Syntax: 
//		OpenDNFH($byVar1, $byVar2, $strVar3);
// Prop�sito:
//		Abrir documento no fiscal homologado
// Argumentos: 
//		byVar1	Tipo de documento {RS}
//		byVar2	T � S (valor fijo) {TS}
//		strVar3	Identificaci�n del documento (max 20 bytes)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION OpenDNFH($byVar1, $byVar2, $strVar3)
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

 if(!is_string($strVar3))
 {
  echo "Error: el tipo del parametro 3 no coincide\n";
  return (-1);
 }

 $strBuff= "@OpenDNFH" . "|" . $byVar1 . "|" . $byVar2 . "|" . $strVar3;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// CloseDNFH()
// 
// Syntax: 
//		CloseDNFH();
// Prop�sito:
//		Cerrar documento no fiscal homologado
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION CloseDNFH()
{

 $strBuff= "@CloseDNFH";	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// DNFHFarmacias()
// 
// Syntax: 
//		DNFHFarmacias($nVar1);
// Prop�sito:
//		Documento No Fiscal Homologado para Farmacias
// Argumentos: 
//		nVar1	Cantidad de ejemplares a imprimir (n)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION DNFHFarmacias($nVar1)
{

 if(!is_int($nVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return -1;
 }

 $strBuff= "@DNFHFarmacias" . "|" . $nVar1;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// DNFHReparto()
// 
// Syntax: 
//		DNFHReparto($nVar1);
// Prop�sito:
//		Documento No Fiscal Homologado, ticket de reparto
// Argumentos: 
//		nVar1	Cantidad de ejemplares a imprimir (n)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION DNFHReparto($nVar1)
{

 if(!is_int($nVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return -1;
 }

 $strBuff= "@DNFHReparto" . "|" . $nVar1;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// SetVoucherData1()
// 
// Syntax: 
//		SetVoucherData1($strVar1, $strVar2, $byVar3, $strVar4, $strVar5, $byVar6, $nVar7);
// Prop�sito:
//		Datos del voucher de tarjeta de cr�dito 1
// Argumentos: 
//		strVar1	Nombre del cliente (max 30 bytes)
//		strVar2	Nombre tarjeta de cr�dito (max 20 bytes)
//		byVar3	Calificador de operaci�n {CVDA}
//		strVar4	N�mero de tarjeta (max 16 bytes)
//		strVar5	Fecha vencimiento tarjeta (AAMM) (max 4 bytes)
//		byVar6	Tipo de tarjeta usada {DC}
//		nVar7	Cantidad de cuotas (2 d�gitos) (nn)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION SetVoucherData1($strVar1, $strVar2, $byVar3, $strVar4, $strVar5, $byVar6, 
                          $nVar7)
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

 if(!is_string($strVar4))
 {
  echo "Error: el tipo del parametro 4 no coincide\n";
  return (-1);
 }

 if(!is_string($strVar5))
 {
  echo "Error: el tipo del parametro 5 no coincide\n";
  return (-1);
 }

 if(!is_string($byVar6))
 {
  echo "Error: el tipo del parametro 6 no coincide\n";
  return (-1);
 }

 if(!is_int($nVar7))
 {
  echo "Error: el tipo del parametro 7 no coincide\n";
  return -1;
 }

 $strBuff= "@SetVoucherData1" . "|" . $strVar1 . "|" . $strVar2 . "|" . $byVar3 . "|" . 
             $strVar4 . "|" . $strVar5 . "|" . $byVar6 . "|" . $nVar7;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// SetVoucherData2()
// 
// Syntax: 
//		SetVoucherData2($strVar1, $strVar2, $strVar3, $strVar4, $byVar5, $byVar6, $strVar7, 
//		                 $strVar8, $strVar9, $strVar10);
// Prop�sito:
//		Datos del voucher de tarjeta de cr�dito 2
// Argumentos: 
//		strVar1	C�digo de comercio (max 15 bytes)
//		strVar2	N�mero de terminal (max 8 bytes)
//		strVar3	N�mero de lote (max 3 bytes)
//		strVar4	N�mero de cup�n (max 4 bytes)
//		byVar5	Ingreso de datos tarjeta { *}
//		byVar6	Tipo de operaci�n {NF}
//		strVar7	N�mero de autorizaci�n (max 6 bytes)
//		strVar8	Importe (max 15 bytes)
//		strVar9	N�mero de comprobante fiscal (max 20 bytes)
//		strVar10	Nombre del vendedor (max 20 bytes)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION SetVoucherData2($strVar1, $strVar2, $strVar3, $strVar4, $byVar5, $byVar6, 
                          $strVar7, $strVar8, $strVar9, $strVar10)
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

 if(!is_string($strVar3))
 {
  echo "Error: el tipo del parametro 3 no coincide\n";
  return (-1);
 }

 if(!is_string($strVar4))
 {
  echo "Error: el tipo del parametro 4 no coincide\n";
  return (-1);
 }

 if(!is_string($byVar5))
 {
  echo "Error: el tipo del parametro 5 no coincide\n";
  return (-1);
 }

 if(!is_string($byVar6))
 {
  echo "Error: el tipo del parametro 6 no coincide\n";
  return (-1);
 }

 if(!is_string($strVar7))
 {
  echo "Error: el tipo del parametro 7 no coincide\n";
  return (-1);
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

 $strBuff= "@SetVoucherData2" . "|" . $strVar1 . "|" . $strVar2 . "|" . $strVar3 . "|" . 
             $strVar4 . "|" . $byVar5 . "|" . $byVar6 . "|" . $strVar7 . "|" . 
              $strVar8 . "|" . $strVar9 . "|" . $strVar10;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// PrintVoucher()
// 
// Syntax: 
//		PrintVoucher($byVar1);
// Prop�sito:
//		Imprimir voucher
// Argumentos: 
//		byVar1	Cantidad ejemplares a imprimir (m�ximo: 3) {0123}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION PrintVoucher($byVar1)
{

 if(!is_string($byVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return (-1);
 }

 $strBuff= "@PrintVoucher" . "|" . $byVar1;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//***************************************************************
//* 7. Comandos de control de la impresora
//*******************************************************************************
// Cancel()
// 
// Syntax: 
//		Cancel();
// Prop�sito:
//		Cancelaci�n
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION Cancel()
{

 $strBuff= "@Cancel";	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// BarCode()
// 
// Syntax: 
//		BarCode($byVar1, $strVar2, $byVar3, $byVar4);
// Prop�sito:
//		C�digo de barras
// Argumentos: 
//		byVar1	Tipo de barras {1234}
//		strVar2	Datos EAN 8 / UPCA / EAN 13 / ITS 2 de 5 (max 32 bytes)
//		byVar3	N: imprime n�meros; otro: no imprime n�meros {NO}
//		byVar4	Impresi�n (P: imprime en el momento; O: imprime al final {PO}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION BarCode($byVar1, $strVar2, $byVar3, $byVar4)
{

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

 $strBuff= "@BarCode" . "|" . $byVar1 . "|" . $strVar2 . "|" . $byVar3 . "|" . $byVar4;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// FeedReceipt()
// 
// Syntax: 
//		FeedReceipt($nVar1);
// Prop�sito:
//		Avanzar papel de tickets
// Argumentos: 
//		nVar1	Cantidad de l�neas a avanzar (nn)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION FeedReceipt($nVar1)
{

 if(!is_int($nVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return -1;
 }

 $strBuff= "@FeedReceipt" . "|" . $nVar1;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// FeedJournal()
// 
// Syntax: 
//		FeedJournal($nVar1);
// Prop�sito:
//		Avanzar papel cinta de auditor�a
// Argumentos: 
//		nVar1	Cantidad de l�neas a avanzar (nn)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION FeedJournal($nVar1)
{

 if(!is_int($nVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return -1;
 }

 $strBuff= "@FeedJournal" . "|" . $nVar1;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// FeedReceiptJournal()
// 
// Syntax: 
//		FeedReceiptJournal($nVar1);
// Prop�sito:
//		Avanzar papeles de tickets y cinta de auditor�a
// Argumentos: 
//		nVar1	Cantidad de l�neas a avanzar (nn)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION FeedReceiptJournal($nVar1)
{

 if(!is_int($nVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return -1;
 }

 $strBuff= "@FeedReceiptJournal" . "|" . $nVar1;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//***************************************************************
//* 8. Comandos de fecha, hora, encabezamiento y cola de documentos
//*******************************************************************************
// SetDateTime()
// 
// Syntax: 
//		SetDateTime($strVar1, $strVar2);
// Prop�sito:
//		Ingresar fecha y hora
// Argumentos: 
//		strVar1	Fecha (formato AAMMDD) (max 6 bytes)
//		strVar2	Hora (formato HHMMSS) (max 6 bytes)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION SetDateTime($strVar1, $strVar2)
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

 $strBuff= "@SetDateTime" . "|" . $strVar1 . "|" . $strVar2;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// GetDateTime()
// 
// Syntax: 
//		GetDateTime();
// Prop�sito:
//		Consultar fecha y hora
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION GetDateTime()
{

 $strBuff= "@GetDateTime";	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// SetHeaderTrailer()
// 
// Syntax: 
//		SetHeaderTrailer($nVar1, $strVar2);
// Prop�sito:
//		Programar texto de encabezamiento y cola de documentos
// Argumentos: 
//		nVar1	Nro de l�nea de encabezamiento (1-10) o cola (11-20) (nn)
//		strVar2	Texto de descripci�n (max 40 bytes)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION SetHeaderTrailer($nVar1, $strVar2)
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

 $strBuff= "@SetHeaderTrailer" . "|" . $nVar1 . "|" . $strVar2;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// GetHeaderTrailer()
// 
// Syntax: 
//		GetHeaderTrailer($nVar1);
// Prop�sito:
//		Reportar texto de encabezamiento y cola de documentos
// Argumentos: 
//		nVar1	Nro de l�nea de encabezamiento (1-10) o cola (11-20) (nn)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION GetHeaderTrailer($nVar1)
{

 if(!is_int($nVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return -1;
 }

 $strBuff= "@GetHeaderTrailer" . "|" . $nVar1;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// SetCustomerData()
// 
// Syntax: 
//		SetCustomerData($strVar1, $strVar2, $byVar3, $byVar4, $strVar5);
// Prop�sito:
//		Datos comprador factura
// Argumentos: 
//		strVar1	Nombre (max 30 bytes)
//		strVar2	CUIT / Nro documento (max 11 bytes)
//		byVar3	Responsabilidad frente al IVA {INEACBMST}
//		byVar4	Tipo de documento {CL1234}
//		strVar5	Domicilio comercial (max 40 bytes)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION SetCustomerData($strVar1, $strVar2, $byVar3, $byVar4, $strVar5)
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

 $strBuff= "@SetCustomerData" . "|" . $strVar1 . "|" . $strVar2 . "|" . $byVar3 . "|" . 
             $byVar4 . "|" . $strVar5;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// SetFantasyName()
// 
// Syntax: 
//		SetFantasyName($byVar1, $strVar2);
// Prop�sito:
//		Programar texto del nombre de fantas�a del propietario
// Argumentos: 
//		byVar1	Nro de l�nea del nombre de fantas�a (1-2) {12}
//		strVar2	Texto de descripci�n (max 40 bytes)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION SetFantasyName($byVar1, $strVar2)
{

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

 $strBuff= "@SetFantasyName" . "|" . $byVar1 . "|" . $strVar2;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// GetFantasyName()
// 
// Syntax: 
//		GetFantasyName($byVar1);
// Prop�sito:
//		Reportar texto del nombre de fantas�a del propietario
// Argumentos: 
//		byVar1	Nro de l�nea a reportar (1-2) {12}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION GetFantasyName($byVar1)
{

 if(!is_string($byVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return (-1);
 }

 $strBuff= "@GetFantasyName" . "|" . $byVar1;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// SetEmbarkNumber()
// 
// Syntax: 
//		SetEmbarkNumber($byVar1, $strVar2);
// Prop�sito:
//		Cargar informaci�n remito / comprobante original
// Argumentos: 
//		byVar1	Nro de l�nea de remito / comprobante original (1-2) {12}
//		strVar2	Texto de descripci�n (max 20 bytes)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION SetEmbarkNumber($byVar1, $strVar2)
{

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

 $strBuff= "@SetEmbarkNumber" . "|" . $byVar1 . "|" . $strVar2;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// GetEmbarkNumber()
// 
// Syntax: 
//		GetEmbarkNumber($byVar1);
// Prop�sito:
//		Reportar informaci�n remito / comprobante original
// Argumentos: 
//		byVar1	Nro de l�nea a reportar (1-2) {12}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION GetEmbarkNumber($byVar1)
{

 if(!is_string($byVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return (-1);
 }

 $strBuff= "@GetEmbarkNumber" . "|" . $byVar1;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// OpenDrawer()
// 
// Syntax: 
//		OpenDrawer();
// Prop�sito:
//		Abrir gaveta
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION OpenDrawer()
{

 $strBuff= "@OpenDrawer";	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// WriteDisplay()
// 
// Syntax: 
//		WriteDisplay($byVar1, $strVar2);
// Prop�sito:
//		Escribir en display
// Argumentos: 
//		byVar1	Campo sobre el que se escribe {KLN}
//		strVar2	Mensaje a exhibir (max 16 bytes)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION WriteDisplay($byVar1, $strVar2)
{

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

 $strBuff= "@WriteDisplay" . "|" . $byVar1 . "|" . $strVar2;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// Sincro()
// 
// Syntax: 
//		Sincro();
// Prop�sito:
//		Cancela cualquier documento fiscal o no fiscal abierto
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION Sincro()
{

 $strBuff= "@Sincro";	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
 
?>
