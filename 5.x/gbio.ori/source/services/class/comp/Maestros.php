<?php 
require("Base.php");

class class_Maestros extends class_Base {
	function __construct() {
		parent::__construct();
	}
	
	function method_getEmpleados ($params, $error) {
		$p = $params[0];
		
		$q = mysql_query("
		SELECT id_empleado as value, name as label
		FROM empleado
		ORDER BY name
		");
		
		$res = "";
		while ($r = mysql_fetch_object($q)) {
			if ($res == "") {
				$row = new stdClass();
				$row->id = '';
				$row->value = 'TODOS';
				$res[] = $row; 
			}
			$res[] = $r;
		}
		
		return $res;
	}
}
?>