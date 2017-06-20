
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
// extension = php_H320V5xts.dll 
//
// Para versiones de PHP Non-Thread Safe (la menos usada)
// extension = php_H320V5xnts.dll 
//
// 3) Copie el archivo con estas funciones al directorio de su su proyecto.
// 4) Agregue las funciones con la funcion required al principio del codigo php
// 5) Todas las funciones de la extension fiscal mas las funciones de alto nivel
//    seran accesibles desde PHP.
// 
// Por ejemplo:
//
// require 'H320PhpApi.php'
//
// $nError = IF_OPEN("COM1",9600);
//
// $nError = Sincro();
//
// ....etc
//

//***************************************************************
//* 1. Comandos de inicializaci�n, baja y configuraci�n
//*******************************************************************************
// ConfigureControllerByBlock()
// 
// Syntax: 
//		ConfigureControllerByBlock($dblVar1, $dblVar2, $dblVar3, $nVar4, $byVar5, $byVar6, 
//		                            $byVar7);
// Prop�sito:
//		Configuraci�n del controlador en bloque
// Argumentos: 
//		dblVar1	L�mite de ingreso datos consumidor (nnnnnnnnn.nn)
//		dblVar2	L�mite ticket factura (nnnnnnnnn.nn)
//		dblVar3	Porcentaje IVA responsable inscripto (nn.nn)
//		nVar4	Cantidad de copias (0-4)
//		byVar5	Impresi�n CAMBIO {PN}
//		byVar6	Impresion leyendas {PN}
//		byVar7	Tipo de corte del papel de ticket {FPN}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************

global $sp;
$sp = chr(28);

FUNCTION ConfigureControllerByBlock($dblVar1, $dblVar2, $dblVar3, $nVar4, $byVar5, 
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

 $strBuff= "@ConfigureControllerByBlock" . $sp . $dblVar1 . $sp . $dblVar2 . $sp . 
             $dblVar3 . $sp . $nVar4 . $sp . $byVar5 . $sp . $byVar6 . $sp . 
              $byVar7;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// GeneralConfiguration()
// 
// Syntax: 
//		GeneralConfiguration($byVar1, $byVar2, $dblVar3, $dblVar4, $dblVar5, $nVar6, $byVar7, 
//		                      $byVar8, $byVar9, $byVar10, $byVar11, $strVar12, 
//		                       $byVar13, $byVar14);
// Prop�sito:
//		Configuraci�n general del controlador
// Argumentos: 
//		byVar1	Impresi�n de reporte de configuraci�n {PN}
//		byVar2	Carga de valores por defecto de par�metros ausentes {PN}
//		dblVar3	L�mite ingreso datos consumidor final (nnnnnnnnn.nn)
//		dblVar4	L�mite ticket-factura (nnnnnnnnn.nn)
//		dblVar5	Porcentaje IVA Responsable no inscripto (nn.nn) (nn.nn)
//		nVar6	Cantidad de copias (0 a 4)
//		byVar7	Impresi�n CAMBIO $0.00 {PN}
//		byVar8	Impresi�n leyendas {PN}
//		byVar9	Tipo de corte del papel de tickets {FPN}
//		byVar10	Impresi�n marco {PN}
//		byVar11	Reimpresi�n documentos {PN}
//		strVar12	Texto a imprimir de existir saldo (max 80 bytes)
//		byVar13	Se�al sonora de falta de papel {PN}
//		byVar14	Tama�o del papel {MACAO}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION GeneralConfiguration($byVar1, $byVar2, $dblVar3, $dblVar4, $dblVar5, $nVar6, 
                               $byVar7, $byVar8, $byVar9, $byVar10, $byVar11, 
                                $strVar12, $byVar13, $byVar14)
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

 if(!is_numeric($dblVar5))
 {
  echo "Error: el tipo del parametro 5 no coincide\n";
  return -1;
 }

 if(!is_int($nVar6))
 {
  echo "Error: el tipo del parametro 6 no coincide\n";
  return -1;
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

 if(!is_string($byVar9))
 {
  echo "Error: el tipo del parametro 9 no coincide\n";
  return (-1);
 }

 if(!is_string($byVar10))
 {
  echo "Error: el tipo del parametro 10 no coincide\n";
  return (-1);
 }

 if(!is_string($byVar11))
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

 if(!is_string($byVar14))
 {
  echo "Error: el tipo del parametro 14 no coincide\n";
  return (-1);
 }

 $strBuff= "@GeneralConfiguration" . $sp . $byVar1 . $sp . $byVar2 . $sp . $dblVar3 . $sp . 
             $dblVar4 . $sp . $dblVar5 . $sp . $nVar6 . $sp . $byVar7 . $sp . 
              $byVar8 . $sp . $byVar9 . $sp . $byVar10 . $sp . $byVar11 . $sp . 
               $strVar12 . $sp . $byVar13 . $sp . $byVar14;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// ConfigureControllerByOne()
// 
// Syntax: 
//		ConfigureControllerByOne($byVar1, $strVar2);
// Prop�sito:
//		Configuraci�n del controlador por par�metros
// Argumentos: 
//		byVar1	Par�metro a modificar {456789ABCD}
//		strVar2	Valor del par�metro
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION ConfigureControllerByOne($byVar1, $strVar2)
{
 global $conexion, $sp;

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

 $strBuff = chr(100) . $sp . $byVar1 . $sp . $strVar2;
 
 $nError = fwrite($conexion, $strBuff);
 if ($nError != false) {
 	do {
 		usleep(500000);
		$nError = fread($conexion, 300);
		$nError = str_replace("DC2", "", $nError);
 	} while ($nError == "");
 }
 $nError = "@ConfigureControllerByOne" . $sp . $sp . $nError;
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

 $strBuff= "@ChangeIVAResponsability" . $sp . $byVar1;	

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
//		strVar1	Nro de ingresos brutos (max 30 bytes)
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

 $strBuff= "@ChangeIBNumber" . $sp . $strVar1;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// ChangeStartDate()
// 
// Syntax: 
//		ChangeStartDate($strVar1);
// Prop�sito:
//		Cambio de fecha de inicio de actividades
// Argumentos: 
//		strVar1	Fecha (AAMMDD) (max 6 bytes)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION ChangeStartDate($strVar1)
{

 if(!is_string($strVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return (-1);
 }

 $strBuff= "@ChangeStartDate" . $sp . $strVar1;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// StoreLogoData()
// 
// Syntax: 
//		StoreLogoData($byVar1, $strVar2);
// Prop�sito:
//		Carga logotipo
// Argumentos: 
//		byVar1	Tipo de informaci�n {ICSF}
//		strVar2	Datos (nro de caracteres en cantidad par) (max 128 bytes)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION StoreLogoData($byVar1, $strVar2)
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

 $strBuff= "@StoreLogoData" . $sp . $byVar1 . $sp . $strVar2;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// ResetLogoData()
// 
// Syntax: 
//		ResetLogoData();
// Prop�sito:
//		Reset logotipo
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION ResetLogoData()
{

 $strBuff= "@ResetLogoData";	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// SetComSpeed()
// 
// Syntax: 
//		SetComSpeed($nVar1);
// Prop�sito:
//		Configuraci�n de velocidad de comunicaci�n
// Argumentos: 
//		nVar1	Velocidad de comunicaci�n
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION SetComSpeed($nVar1)
{

 if(!is_int($nVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return -1;
 }

 $strBuff= "@SetComSpeed" . $sp . $nVar1;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//***************************************************************
//* 2. Comandos de diagn�stico y consulta
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
 global $conexion, $sp;
 
 $strBuff = chr(42);	

 $nError = fwrite($conexion, $strBuff);
 if ($nError != false) {
 	do {
 		usleep(500000);
		$nError = fread($conexion, 300);
		$nError = str_replace("DC2", "", $nError);
 	} while ($nError == "");
 }
 $nError = "@StatusRequest" . $sp . $sp . $nError;
 return ($nError);
}
//*******************************************************************************
// STATPRN()
// 
// Syntax: 
//		STATPRN();
// Prop�sito:
//		Consulta de estado intermedio
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION STATPRN()
{

 $strBuff= "@STATPRN";	

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
// GetGeneralConfigurationData()
// 
// Syntax: 
//		GetGeneralConfigurationData();
// Prop�sito:
//		Consulta de configuraci�n general
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION GetGeneralConfigurationData()
{

 $strBuff= "@GetGeneralConfigurationData";	

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
 global $conexion, $sp;

 $strBuff = chr(127);

 $nError = fwrite($conexion, $strBuff);
 if ($nError != false) {
 	do {
 		usleep(500000);
		$nError = fread($conexion, 300);
		$nError = str_replace("DC2", "", $nError);
 	} while ($nError == "");
 }
 $nError = "@GetPrinterVersion" . $sp . $sp . $nError;
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
//		byVar1	Tipo de reporte {ZX}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION DailyClose($byVar1)
{
 global $conexion, $sp;

 if(!is_string($byVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return (-1);
 }

 $strBuff = chr(57) . $sp . $byVar1;

 $nError = fwrite($conexion, $strBuff);
 if ($nError != false) {
 	do {
 		usleep(500000);
		$nError = fread($conexion, 300);
		$nError = str_replace("DC2", "", $nError);
 	} while ($nError == "");
 }
 $nError = "@DailyClose" . $sp . $sp . $nError;
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
//		byVar3	Tipo de reporte {TD}
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

 $strBuff= "@DailyCloseByDate" . $sp . $strVar1 . $sp . $strVar2 . $sp . $byVar3;	

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
//		byVar3	Tipo de reporte {TD}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION DailyCloseByNumber($nVar1, $nVar2, $byVar3)
{
 global $conexion, $sp;

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

 $strBuff = chr(59) . $sp . $nVar1 . $sp . $nVar2 . $sp . $byVar3;

 $nError = fwrite($conexion, $strBuff);
 if ($nError != false) {
 	do {
 		usleep(500000);
		$nError = fread($conexion, 300);
		$nError = str_replace("DC2", "", $nError);
 	} while ($nError == "");
 }
 $nError = "@DailyCloseByNumber" . $sp . $sp . $nError;
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
//		byVar2	Tipo de reporte {ZF}
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

 $strBuff= "@GetDailyReport" . $sp . $strVar1 . $sp . $byVar2;	

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
//		SendFirstIVA($byVar1);
// Prop�sito:
//		Iniciar informaci�n de IVA
// Argumentos: 
//		byVar1	Tipo de informe {DO}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION SendFirstIVA($byVar1)
{

 if(!is_string($byVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return (-1);
 }

 $strBuff= "@SendFirstIVA" . $sp . $byVar1;	

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
//*******************************************************************************
// GetLastCAI()
// 
// Syntax: 
//		GetLastCAI();
// Prop�sito:
//		Consultar n�mero de CAI del �ltimo documento A emitido
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION GetLastCAI()
{

 $strBuff= "@GetLastCAI";	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//***************************************************************
//* 4. Comandos de comprobante fiscal y nota de cr�dito
//*******************************************************************************
// OpenFiscalReceipt()
// 
// Syntax: 
//		OpenFiscalReceipt($byVar1, $byVar2);
// Prop�sito:
//		Abrir comprobante fiscal
// Argumentos: 
//		byVar1	Tipo de documento {ABabDE}
//		byVar2	T � S (valor fijo) {TS}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION OpenFiscalReceipt($byVar1, $byVar2)
{
 global $conexion, $sp;

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

 $strBuff = chr(64) . $sp . $byVar1 . $sp . $byVar2;
 
 $nError = fwrite($conexion, $strBuff);
 if ($nError != false) {
 	do {
 		usleep(500000);
		$nError = fread($conexion, 300);
		$nError = str_replace("DC2", "", $nError);
 	} while ($nError == "");
 }
 $nError = "@OpenFiscalReceipt" . $sp . $sp . $nError;
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
//		strVar1	Texto fiscal (max 50 bytes)
//		byVar2	Par�metro display: 0, 1 o 2 {012}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION PrintFiscalText($strVar1, $byVar2)
{
 global $conexion, $sp;

 if(!is_string($strVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return (-1);
 }

 if(!is_int($byVar2))
 {
  echo "Error: el tipo del parametro 2 no coincide\n";
  return (-1);
 }

 $strBuff = chr(65) . $sp . $strVar1 . $sp . $byVar2;
 
 $nError = fwrite($conexion, $strBuff);
 if ($nError != false) {
 	do {
 		usleep(500000);
		$nError = fread($conexion, 300);
		$nError = str_replace("DC2", "", $nError);
 	} while ($nError == "");
 }
 $nError = "@PrintFiscalText" . $sp . $sp . $nError;
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
//		strVar1	Texto descripci�n del item (max 50 bytes)
//		dblVar2	Cantidad (nnnn.nnnnnnnnnn)
//		dblVar3	Precio unitario (nnnnnnn.nnnn)
//		strVar4	Porcentaje IVA (nn.nn)/(**.**) (max 5 bytes)
//		byVar5	Calificador de la operaci�n {Mm}
//		strVar6	Impuestos internos
//		byVar7	Par�metro display: 0, 1 o 2 {012}
//		byVar8	Calificador de monto {TB}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION PrintLineItem($strVar1, $dblVar2, $dblVar3, $strVar4, $byVar5, $strVar6, 
                        $byVar7, $byVar8)
{
 global $conexion, $sp;

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

 if(!is_numeric($strVar6))
 {
  echo "Error: el tipo del parametro 6 no coincide\n";
  return (-1);
 }

 if(!is_int($byVar7))
 {
  echo "Error: el tipo del parametro 7 no coincide\n";
  return (-1);
 }

 if(!is_string($byVar8))
 {
  echo "Error: el tipo del parametro 8 no coincide\n";
  return (-1);
 }

 $strBuff= chr(66) . $sp . $strVar1 . $sp . number_format($dblVar2, 2, ".", "") . $sp . number_format($dblVar3, 2, ".", "") . $sp . 
             $strVar4 . $sp . $byVar5 . $sp . number_format($strVar6, 2, ".", "") . $sp . $byVar7 . $sp . 
              $byVar8;	

 $nError = fwrite($conexion, $strBuff);
 if ($nError != false) {
 	do {
 		usleep(500000);
		$nError = fread($conexion, 300);
		$nError = str_replace("DC2", "", $nError);
 	} while ($nError == "");
 }
 $nError = "@PrintLineItem" . $sp . $sp . $nError;
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
//		strVar1	Texto descripci�n (max 50 bytes)
//		dblVar2	Monto (nnnnnnnnnn.nn)
//		byVar3	Imputaci�n {Mm}
//		byVar4	Par�metro display: 0, 1 o 2 {012}
//		byVar5	Calificador de monto {TB}
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

 $strBuff= "@LastItemDiscount" . $sp . $strVar1 . $sp . $dblVar2 . $sp . $byVar3 . $sp . 
             $byVar4 . $sp . $byVar5;	

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
//		strVar1	Texto descripci�n (max 50 bytes)
//		dblVar2	Monto (nnnnnnnnnn.nn)
//		byVar3	Imputaci�n {Mm}
//		byVar4	Par�metro display: 0, 1 o 2 {012}
//		byVar5	Calificador de monto {TB}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION GeneralDiscount($strVar1, $dblVar2, $byVar3, $byVar4, $byVar5)
{
 global $conexion, $sp;

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

 if(!is_int($byVar4))
 {
  echo "Error: el tipo del parametro 4 no coincide\n";
  return (-1);
 }

 if(!is_string($byVar5))
 {
  echo "Error: el tipo del parametro 5 no coincide\n";
  return (-1);
 }

 $strBuff = chr(84) . $sp . $strVar1 . $sp . number_format($dblVar2, 2, ".", "") . $sp . $byVar3 . $sp . 
             $byVar4 . $sp . $byVar5;	

 $nError = fwrite($conexion, $strBuff);
 if ($nError != false) {
 	do {
 		usleep(500000);
		$nError = fread($conexion, 300);
		$nError = str_replace("DC2", "", $nError);
 	} while ($nError == "");
 }
 $nError = "@GeneralDiscount" . $sp . $sp . $nError;
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
//		strVar1	Texto descripci�n (max 50 bytes)
//		dblVar2	Monto (nnnnnnnnnn.nn)
//		strVar3	Porcentaje IVA (nn.nn)/(**.**) (max 5 bytes)
//		byVar4	Imputaci�n {Mm}
//		strVar5	Impuestos internos
//		byVar6	Par�metro display: 0, 1 o 2 {012}
//		byVar7	Calificador de monto {TB}
//		byVar8	Calificador de operaci�n {BD}
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

 $strBuff= "@ReturnRecharge" . $sp . $strVar1 . $sp . $dblVar2 . $sp . $strVar3 . $sp . 
             $byVar4 . $sp . $strVar5 . $sp . $byVar6 . $sp . $byVar7 . $sp . 
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
//		dblVar1	Monto (nnnnnnnnn.nn)
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

 $strBuff= "@ChargeNonRegisteredTax" . $sp . $dblVar1;	

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
//		dblVar3	Monto (nnnnnnnnn.nn)
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

 $strBuff= "@Perceptions" . $sp . $strVar1 . $sp . $strVar2 . $sp . $dblVar3;	

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
//		byVar1	Par�metro impresi�n {PN}
//		strVar2	Reservado (llenar con un caracter cualquiera) (max 26 bytes)
//		byVar3	Par�metro display: 0, 1 o 2 {012}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION Subtotal($byVar1, $strVar2, $byVar3)
{
 global $conexion, $sp;

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

 if(!is_int($byVar3))
 {
  echo "Error: el tipo del parametro 3 no coincide\n";
  return (-1);
 }

 $strBuff = chr(67) . $sp . $byVar1 . $sp . $strVar2 . $sp . $byVar3;	

 $nError = fwrite($conexion, $strBuff);
 if ($nError != false) {
 	do {
 		usleep(500000);
		$nError = fread($conexion, 300);
		$nError = str_replace("DC2", "", $nError);
 	} while ($nError == "");
 }
 $nError = "@Subtotal" . $sp . $sp . $nError;
 return ($nError);
}
//*******************************************************************************
// ReceiptText()
// 
// Syntax: 
//		ReceiptText($strVar1);
// Prop�sito:
//		Texto de l�neas de recibos
// Argumentos: 
//		strVar1	Texto descripci�n (max 106 bytes)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION ReceiptText($strVar1)
{
 global $conexion, $sp;

 if(!is_string($strVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return (-1);
 }

 $strBuff = chr(151) . $sp . $strVar1;
 
 $nError = fwrite($conexion, $strBuff);
 if ($nError != false) {
 	do {
 		usleep(500000);
		$nError = fread($conexion, 300);
		$nError = str_replace("DC2", "", $nError);
 	} while ($nError == "");
 }
 $nError = "@ReceiptText" . $sp . $sp . $nError;
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
//		strVar1	Texto de descripci�n (max 50 bytes)
//		dblVar2	Monto pagado (nnnnnnnnn.nn)
//		byVar3	Calificador operaci�n {TRC}
//		byVar4	Par�metro display: 0, 1 o 2 {012}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION TotalTender($strVar1, $dblVar2, $byVar3, $byVar4)
{
 global $conexion, $sp;

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

 if(!is_int($byVar4))
 {
  echo "Error: el tipo del parametro 4 no coincide\n";
  return (-1);
 }

 $strBuff = chr(68) . $sp . $strVar1 . $sp . number_format($dblVar2, 2, ".", "") . $sp . $byVar3 . $sp . $byVar4;

 $nError = fwrite($conexion, $strBuff);
 if ($nError != false) {
 	do {
 		usleep(500000);
		$nError = fread($conexion, 300);
		$nError = str_replace("DC2", "", $nError);
 	} while ($nError == "");
 }
 $nError = "@TotalTender" . $sp . $sp . $nError;
 return ($nError);
}
//*******************************************************************************
// CloseFiscalReceipt()
// 
// Syntax: 
//		CloseFiscalReceipt($byVar1);
// Prop�sito:
//		Cerrar comprobante fiscal
// Argumentos: 
//		byVar1	Nro de copias a imprimir autom�ticamente {01234}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION CloseFiscalReceipt($byVar1 = null)
{
 global $conexion, $sp;

 if(!is_int($byVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return (-1);
 }

 $strBuff = chr(69);
 if (!is_null($byVar1)) $strBuff.= $sp . $byVar1;

 $nError = fwrite($conexion, $strBuff);
 if ($nError != false) {
 	do {
 		usleep(500000);
		$nError = fread($conexion, 300);
		$nError = str_replace("DC2", "", $nError);
 	} while ($nError == "");
 }
 $nError = "@CloseFiscalReceipt" . $sp . $sp . $nError;
 return ($nError);
}
//***************************************************************
//* 5. Comandos de comprobante no fiscal
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
//		strVar1	Texto no fiscal (max 120 bytes)
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

 $strBuff= "@PrintNonFiscalText" . $sp . $strVar1 . $sp . $byVar2;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// CloseNonFiscalReceipt()
// 
// Syntax: 
//		CloseNonFiscalReceipt($byVar1);
// Prop�sito:
//		Cerrar comprobante no fiscal
// Argumentos: 
//		byVar1	Nro de copias a imprimir autom�ticamente {01234}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION CloseNonFiscalReceipt($byVar1)
{

 if(!is_string($byVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return (-1);
 }

 $strBuff= "@CloseNonFiscalReceipt" . $sp . $byVar1;	

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
//		byVar1	Tipo de documento {RSrstUux0123456789ABCDEFG}
//		byVar2	T � S (valor fijo) {TS}
//		strVar3	Identificaci�n o n�mero del documento (max 20 bytes)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION OpenDNFH($byVar1, $byVar2, $strVar3 = null)
{
 global $conexion, $sp;

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

 if(!is_null($strVar3) && !is_string($strVar3))
 {
  echo "Error: el tipo del parametro 3 no coincide\n";
  return (-1);
 }

 $strBuff = chr(128) . $sp . $byVar1 . $sp . $byVar2;
 if (!is_null($strVar3)) $strBuff.= $sp . $strVar3;

 $nError = fwrite($conexion, $strBuff);
 if ($nError != false) {
 	do {
 		usleep(500000);
		$nError = fread($conexion, 300);
		$nError = str_replace("DC2", "", $nError);
 	} while ($nError == "");
 }
 $nError = "@OpenDNFH" . $sp . $sp . $nError;
 return ($nError);
}
//*******************************************************************************
// PrintEmbarkItem()
// 
// Syntax: 
//		PrintEmbarkItem($strVar1, $dblVar2, $byVar3);
// Prop�sito:
//		Imprimir item en remito u orden de salida
// Argumentos: 
//		strVar1	Descripci�n item (max 108 bytes)
//		dblVar2	Cantidad (nnn.nnnn)
//		byVar3	Par�metro display: 0, 1 o 2 {012}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION PrintEmbarkItem($strVar1, $dblVar2, $byVar3)
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

 $strBuff= "@PrintEmbarkItem" . $sp . $strVar1 . $sp . $dblVar2 . $sp . $byVar3;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// PrintAccountItem()
// 
// Syntax: 
//		PrintAccountItem($strVar1, $strVar2, $strVar3, $dblVar4, $dblVar5, $byVar6);
// Prop�sito:
//		Imprimir item en resumen de cuenta o en cargo a la habitaci�n
// Argumentos: 
//		strVar1	Fecha del comprobante (AAMMDD) (max 6 bytes)
//		strVar2	N�mero del comprobante (max 20 bytes)
//		strVar3	Descripci�n venta o servicio (max 60 bytes)
//		dblVar4	Monto debe (nnnnnnnnn.nn)
//		dblVar5	Monto haber (nnnnnnnnn.nn)
//		byVar6	Par�metro display: 0, 1 o 2 {012}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION PrintAccountItem($strVar1, $strVar2, $strVar3, $dblVar4, $dblVar5, $byVar6)
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

 if(!is_numeric($dblVar4))
 {
  echo "Error: el tipo del parametro 4 no coincide\n";
  return -1;
 }

 if(!is_numeric($dblVar5))
 {
  echo "Error: el tipo del parametro 5 no coincide\n";
  return -1;
 }

 if(!is_string($byVar6))
 {
  echo "Error: el tipo del parametro 6 no coincide\n";
  return (-1);
 }

 $strBuff= "@PrintAccountItem" . $sp . $strVar1 . $sp . $strVar2 . $sp . $strVar3 . $sp . 
             $dblVar4 . $sp . $dblVar5 . $sp . $byVar6;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// PrintQuotationItem()
// 
// Syntax: 
//		PrintQuotationItem($strVar1, $byVar2);
// Prop�sito:
//		Imprimir item en cotizaci�n
// Argumentos: 
//		strVar1	Descripci�n item (max 120 bytes)
//		byVar2	Par�metro display: 0, 1 o 2 {012}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION PrintQuotationItem($strVar1, $byVar2)
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

 $strBuff= "@PrintQuotationItem" . $sp . $strVar1 . $sp . $byVar2;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// PrintDNFHInfo()
// 
// Syntax: 
//		PrintDNFHInfo($byVar1, $strVar2, $byVar3);
// Prop�sito:
//		Imprimir l�nea de informaci�n en DNFH
// Argumentos: 
//		byVar1	Campo a imprimir: 1, 2 o 3 {123}
//		strVar2	Texto informaci�n (max 120 bytes)
//		byVar3	Par�metro display: 0, 1 o 2 {012}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION PrintDNFHInfo($byVar1, $strVar2, $byVar3)
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

 $strBuff= "@PrintDNFHInfo" . $sp . $byVar1 . $sp . $strVar2 . $sp . $byVar3;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// CloseDNFH()
// 
// Syntax: 
//		CloseDNFH($byVar1);
// Prop�sito:
//		Cerrar documento no fiscal homologado
// Argumentos: 
//		byVar1	Nro de copias a imprimir autom�ticamente {01234}
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION CloseDNFH($byVar1)
{
 global $conexion, $sp;

 if(!is_int($byVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return (-1);
 }

 $strBuff = chr(129) . $sp . $byVar1;

 $nError = fwrite($conexion, $strBuff);
 if ($nError != false) {
 	do {
 		usleep(500000);
		$nError = fread($conexion, 300);
		$nError = str_replace("DC2", "", $nError);
 	} while ($nError == "");
 }
 $nError = "@CloseDNFH" . $sp . $sp . $nError;
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
//		strVar1	Nombre del cliente (max 50 bytes)
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

 $strBuff= "@SetVoucherData1" . $sp . $strVar1 . $sp . $strVar2 . $sp . $byVar3 . $sp . 
             $strVar4 . $sp . $strVar5 . $sp . $byVar6 . $sp . $nVar7;	

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

 $strBuff= "@SetVoucherData2" . $sp . $strVar1 . $sp . $strVar2 . $sp . $strVar3 . $sp . 
             $strVar4 . $sp . $byVar5 . $sp . $byVar6 . $sp . $strVar7 . $sp . 
              $strVar8 . $sp . $strVar9 . $sp . $strVar10;	

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
//		byVar1	Cantidad ejemplares a imprimir {0123}
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

 $strBuff= "@PrintVoucher" . $sp . $byVar1;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//***************************************************************
//* 7. Comandos comunes a varios tipos de documentos
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
// Reprint()
// 
// Syntax: 
//		Reprint();
// Prop�sito:
//		Reimpresi�n del �ltimo documento emitido
// Argumentos: 
//		Ninguno
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION Reprint()
{
 global $conexion, $sp;

 $strBuff = chr(153);

 $nError = fwrite($conexion, $strBuff);
 if ($nError != false) {
 	do {
 		usleep(500000);
		$nError = fread($conexion, 300);
		$nError = str_replace("DC2", "", $nError);
 	} while ($nError == "");
 }
 $nError = "@Reprint". $sp . $sp . $nError;
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
//		byVar1	Tipo de barras {12340}
//		strVar2	Datos EAN 8 / UPCA / EAN 13 / ITS 2 de 5 (max 32 bytes)
//		byVar3	Impresi�n de n�meros {NO}
//		byVar4	Sin efecto en este modelo (poner cualquier caracter)
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

 $strBuff= "@BarCode" . $sp . $byVar1 . $sp . $strVar2 . $sp . $byVar3 . $sp . $byVar4;	

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
 global $conexion, $sp;

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

 $strBuff = chr(88) . $sp . $strVar1 . $sp . $strVar2;

 $nError = fwrite($conexion, $strBuff);
 if ($nError != false) {
 	do {
 		usleep(500000);
		$nError = fread($conexion, 300);
		$nError = str_replace("DC2", "", $nError);
 	} while ($nError == "");
 }
 $nError = "@SetDateTime" . $sp . $sp . $nError;
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
// SetFantasyName()
// 
// Syntax: 
//		SetFantasyName($byVar1, $strVar2);
// Prop�sito:
//		Programar texto del nombre de fantas�a del propietario
// Argumentos: 
//		byVar1	Nro de l�nea del nombre de fantas�a (1-2) {12}
//		strVar2	Texto de descripci�n (max 50 bytes)
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

 $strBuff= "@SetFantasyName" . $sp . $byVar1 . $sp . $strVar2;	

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

 $strBuff= "@GetFantasyName" . $sp . $byVar1;	

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
//		nVar1	Nro de l�nea de encabezamiento (1-5) o cola (11-14) (nn)
//		strVar2	Texto de descripci�n (max 120 bytes)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION SetHeaderTrailer($nVar1, $strVar2)
{
 global $conexion, $sp;

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

 $strBuff = chr(93) . $sp . $nVar1 . $sp . $strVar2;	
 
 $nError = fwrite($conexion, $strBuff);
 if ($nError != false) {
 	do {
 		usleep(500000);
		$nError = fread($conexion, 300);
		$nError = str_replace("DC2", "", $nError);
 	} while ($nError == "");
 }
 $nError = "@SetHeaderTrailer" . $sp . $sp . $nError;
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
//		nVar1	Nro de l�nea de encabezamiento (1-5) o cola (11-14) (nn)
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

 $strBuff= "@GetHeaderTrailer" . $sp . $nVar1;	

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
//		strVar1	Nombre (max 50 bytes)
//		strVar2	CUIT / Nro documento (max 11 bytes)
//		byVar3	Responsabilidad frente al IVA {INEACBMSVWT}
//		byVar4	Tipo de documento {CL1234-}
//		strVar5	Domicilio comercial (max 50 bytes)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION SetCustomerData($strVar1, $strVar2, $byVar3, $byVar4, $strVar5 = null)
{
 global $conexion, $sp;

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

 if(!is_null($strVar5) && !is_string($strVar5))
 {
  echo "Error: el tipo del parametro 5 no coincide\n";
  return (-1);
 }

 $strBuff = chr(98) . $sp . $strVar1 . $sp . $strVar2 . $sp . $byVar3 . $sp . $byVar4;
 if (!is_null($strVar5)) $strBuff.= $sp . $strVar5;

 $nError = fwrite($conexion, $strBuff);
 if ($nError != false) {
 	do {
 		usleep(500000);
		$nError = fread($conexion, 300);
		$nError = str_replace("DC2", "", $nError);
 	} while ($nError == "");
 }
 $nError = "@SetCustomerData" . $sp . $sp . $nError;
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
 global $conexion, $sp;

 if(!is_int($byVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return (-1);
 }

 if(!is_string($strVar2))
 {
  echo "Error: el tipo del parametro 2 no coincide\n";
  return (-1);
 }

 $strBuff = chr(147) . $sp . $byVar1 . $sp . $strVar2;

 $nError = fwrite($conexion, $strBuff);
 if ($nError != false) {
 	do {
 		usleep(500000);
		$nError = fread($conexion, 300);
		$nError = str_replace("DC2", "", $nError);
 	} while ($nError == "");
 }
 $nError = "@SetEmbarkNumber" . $sp . $sp . $nError;
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

 $strBuff= "@GetEmbarkNumber" . $sp . $byVar1;	

 $nError = IF_WRITE($strBuff);
 
 return ($nError);
}
//*******************************************************************************
// ChangeBusinessStartupDate()
// 
// Syntax: 
//		ChangeBusinessStartupDate($strVar1);
// Prop�sito:
//		Cambiar fecha de inicio de actividad
// Argumentos: 
//		strVar1	Fecha (formato AAMMDD) (max 6 bytes)
// Devuelve:
//		0 si no hay error y != 0 si hay un error
//******************************************************************************
FUNCTION ChangeBusinessStartupDate($strVar1)
{

 if(!is_string($strVar1))
 {
  echo "Error: el tipo del parametro 1 no coincide\n";
  return (-1);
 }

 $strBuff= "@ChangeBusinessStartupDate" . $sp . $strVar1;	

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
