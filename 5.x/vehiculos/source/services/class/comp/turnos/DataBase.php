<?php
class DataBase {
	private $conexion;
	private $resource;
	private $sql;
	public static $queries;

	public function __construct($server, $user, $password, $dbName){
		$this->conexion = @mysql_connect($server, $user, $password);
		mysql_select_db($dbName, $this->conexion);
		$this->queries = 0;
		$this->resource = null;
	}

	public function execute(){
		if(!($this->resource = mysql_query($this->sql, $this->conexion))){
			return null;
		}
		$this->queries++;
		return $this->resource;
	}

	public function alter(){
		if(!($this->resource = mysql_query($this->sql, $this->conexion))){
			return false;
		}
		return true;
	}

	public function loadResult(){
		if (!($cur = $this->execute())){
			return null;
		}
		$array = array();
		while ($row = @mysql_fetch_object($cur)){
			$array[] = $row;
		}
		return $array;
	}

	public function setQuery($sql){
		if(empty($sql)){
			return false;
		}
		$this->sql = $sql;
		return true;
	}

	public function freeResults(){
		@mysql_free_result($this->resource);
		return true;
	}

	public function loadObject(){
		if ($cur = $this->execute()){
			if ($object = mysql_fetch_object($cur)){
				@mysql_free_result($cur);
				return $object;
			}
			else {
				return null;
			}
		}
		else {
			return false;
		}
	}

	function __destruct(){
		@mysql_free_result($this->resource);
		@mysql_close($this->conexion);
	}
}
?>
