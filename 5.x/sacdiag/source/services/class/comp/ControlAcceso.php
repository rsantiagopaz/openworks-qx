<?php
session_start();

require("Base.php");

class class_ControlAcceso extends class_Base
{


  public function method_login($params, $error) {
  	$p = $params[0];
  	
	$resultado = new stdClass;
	
	$resultado->ok = "¡¡Bienvenido ".$_SESSION['usuario_nombre']." (".$SYSusuario.")!!\n\n";
	$resultado->ok.="Puede comenzar a trabajar. Recuerde CERRAR SESION cuando termine o si desea cambiar de usuario.\n\n";
	$resultado->ok.="¡NUNCA DEJE EL NAVEGADOR ABIERTO Y SE RETIRE!";
	$resultado->_sistema_id = $SYSsistema_id;
	$resultado->_usuario = $_SESSION['usuario'];
	$resultado->_usuario_id = $_SESSION['usuario_id'];
	$resultado->_usuario_nombre = $_SESSION['usuario_nombre'];
	$resultado->_usuario_estado = $_SESSION['usuario_estado'];
	$resultado->_sesion_id = $_SESSION['SYSsesion_id'];
	$resultado->_autorizado = true;
	$resultado->_usuario_organismo_id = $_SESSION['usuario_organismo_id'];
	$resultado->_usuario_nivel_id = $_SESSION['usuario_nivel_id'];
	$resultado->_usuario_organismo = $_SESSION['usuario_organismo'];
	$resultado->_usuario_organismo_area_id = $_SESSION['usuario_organismo_area_id'];
	$resultado->_usuario_organismo_area = $_SESSION['usuario_organismo_area'];
	$resultado->_usuario_sistemas_perfiles = $_SESSION['sistemas_perfiles_usuario'];
	$resultado->_usuario_organismo_area_mesa_entradas = ((empty($_SESSION['usuario_organismo_area_mesa_entrada'])) ? "0" : $_SESSION['usuario_organismo_area_mesa_entrada']);


	return $resultado;
  }
}

?>