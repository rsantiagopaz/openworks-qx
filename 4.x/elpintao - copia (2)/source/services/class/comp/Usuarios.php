<?php

session_start();

require($_SESSION['services_require'] . "Base.php");

class class_Usuarios extends class_Base
{
  function __construct() {
    parent::__construct();
  }
  
  
  public function method_leer_usuario($params, $error) {
	$p = $params[0];
	
	$sql = "SELECT * FROM usuario WHERE nick LIKE '" . $p->nick . "'";
	$rs = mysql_query($sql);
	if (mysql_num_rows($rs) > 0) {
		$row = mysql_fetch_object($rs);
		if ($row->password == md5($p->password)) {
			return $row;
		} else {
			$error->SetError(0, "password");
			return $error;
		}
	} else {
		$error->SetError(0, "nick");
		return $error;
	}
  }
}

?>