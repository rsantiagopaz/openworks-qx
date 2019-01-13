<?php

require("Base.php");

class class_IncumbenciaEspaciosxTitulo extends class_Base
{
	
	
  public function method_leer_espacios($params, $error) {
  	$p = $params[0];
  	
  	return "fds";
	
	$sql = "SELECT tomo_espacios.*, TRIM(carreras.nombre) AS carrera_descrip, TRIM(espacios.denominacion) AS espacio_descrip, tipos_clasificacion.denominacion AS tipo_clasificacion, tipos_titulos.tipo AS tipo_titulo";
	$sql.= " FROM (((tomo_espacios INNER JOIN carreras USING(id_carrera)) INNER JOIN espacios USING(id_espacio)) INNER JOIN tipos_clasificacion USING(id_tipo_clasificacion)) INNER JOIN tipos_titulos USING(id_tipo_titulo)";
	$sql.= " WHERE id_titulo=" . $p->id_titulo;
	$sql.= " ORDER BY carrera_descrip, espacio_descrip";
	
	return $this->toJson($sql);
  }
  
  
  
  public function method_guardar_espacios($params, $error) {
  	$p = $params[0];
  	
  	$resultado = new stdClass;
  	
	$this->mysqli->query("START TRANSACTION");
  	
  	foreach ($p->espacio as $espacio) {
		$sql = "SELECT id_tomo_espacio";
		$sql.= " FROM tomo_espacios";
		$sql.= " WHERE id_titulo = " . $p->titulo->model;
		$sql.= " AND id_espacio = " . $espacio->id_espacio;
		$sql.= " AND id_carrera = " . $espacio->id_carrera;
		
		$rs = $this->mysqli->query($sql);
		
		if ($rs->num_rows == 0) {
			$sql = "SELECT id_tomo_espacio";
			$sql.= " FROM nov_tomo_espacios";
			$sql.= " WHERE id_titulo =" . $p->titulo->model;
			$sql.= " AND id_espacio =" . $espacio->id_espacio;
			$sql.= " AND id_carrera =" . $espacio->id_carrera;
			$sql.= " AND estado = 'S'";
			
			$rs = $this->mysqli->query($sql);
			
			if ($rs->num_rows == 0) {
				$sql = "SELECT id_tomo_espacio";
				$sql.= " FROM tomo_espacios";
				$sql.= " WHERE id_espacio = " . $espacio->id_espacio;
				
				$rs = $this->mysqli->query($sql);
				
				if ($rs->num_rows == 0) {
					$sql = "INSERT tomo_espacios SET";
					$sql.= "  id_espacio='" . $espacio->id_espacio . "'";
					$sql.= ", cod_espacio='" . $espacio->cod_espacio . "'";
					$sql.= ", id_carrera='" . $espacio->id_carrera . "'";
					$sql.= ", cod_carrera='" . $espacio->cod_carrera . "'";
					$sql.= ", id_titulo='" . $p->titulo->model . "'";
					$sql.= ", cod_titulo='" . $p->titulo->codigo . "'";
					$sql.= ", id_tipo_titulo='" . $espacio->id_tipo_titulo . "'";
					$sql.= ", cod_tipo_titulo='" . $espacio->cod_tipo_titulo . "'";
					$sql.= ", id_tipo_clasificacion='" . $espacio->id_tipo_clasificacion . "'";
					
					$this->mysqli->query($sql);
					
					$id_tomo_espacio = $this->mysqli->insert_id;
					
					$resultado->id_tomo_espacio = $id_tomo_espacio;
					
					$_descrip = "ALTA DE TOMO-ESPACIO CON id='" . $id_tomo_espacio . "', TITULO '" . $p->titulo->label . "', CARRERA '" . $espacio->carrera_descrip . "', ESPACIO '" . $espacio->espacio_descrip . "'";
					
					$this->auditoria($sql, null, null, 'tomo_espacios', $id_tomo_espacio, $_descrip, '', '');
					
					
							
					$sql = "INSERT nov_tomo_espacios SET";
					$sql.= "  id_espacio='" . $espacio->id_espacio . "'";
					$sql.= ", cod_espacio='" . $espacio->cod_espacio . "'";
					$sql.= ", id_carrera='" . $espacio->id_carrera . "'";
					$sql.= ", cod_carrera='" . $espacio->cod_carrera . "'";
					$sql.= ", id_titulo='" . $p->titulo->model . "'";
					$sql.= ", cod_titulo='" . $p->titulo->codigo . "'";
					$sql.= ", id_tipo_titulo='" . $espacio->id_tipo_titulo . "'";
					$sql.= ", cod_tipo_titulo='" . $espacio->cod_tipo_titulo . "'";
					$sql.= ", id_tipo_clasificacion='" . $espacio->id_tipo_clasificacion . "'";
					
					$sql.= ", id_tomo_espacio='" . $id_tomo_espacio . "'";
					$sql.= ", tipo_novedad='N'";
					$sql.= ", estado='V'";
					$sql.= ", fecha_novedad=NOW()";
					$sql.= ", timestamp=NOW()";
					$sql.= ", usuario_novedad='" . $_SESSION['usuario'] . "'";
					
					$this->mysqli->query($sql);
					
					
				} else {
					$sql = "SELECT id_nov_tomo_espacios FROM nov_tomo_espacios WHERE id_espacio='" . $espacio->id_espacio . "' AND tipo_novedad='N' AND CURDATE() <= DATE_ADD(fecha_novedad, INTERVAL 1 DAY)";
					
					$rs = $this->mysqli->query($sql);
					
					if ($rs->num_rows == 0) {
						$sql = "INSERT nov_tomo_espacios SET";
						$sql.= "  id_espacio='" . $espacio->id_espacio . "'";
						$sql.= ", cod_espacio='" . $espacio->cod_espacio . "'";
						$sql.= ", id_carrera='" . $espacio->id_carrera . "'";
						$sql.= ", cod_carrera='" . $espacio->cod_carrera . "'";
						$sql.= ", id_titulo='" . $p->titulo->model . "'";
						$sql.= ", cod_titulo='" . $p->titulo->codigo . "'";
						$sql.= ", id_tipo_titulo='" . $espacio->id_tipo_titulo . "'";
						$sql.= ", cod_tipo_titulo='" . $espacio->cod_tipo_titulo . "'";
						$sql.= ", id_tipo_clasificacion='" . $espacio->id_tipo_clasificacion . "'";
						
						//$sql.= ", id_tomo_espacio='" . "'";
						$sql.= ", tipo_novedad='A'";
						$sql.= ", estado='S'";
						$sql.= ", fecha_novedad=NOW()";
						$sql.= ", timestamp=NOW()";
						$sql.= ", usuario_novedad='" . $_SESSION['usuario'] . "'";
						
						$this->mysqli->query($sql);
						
						$id_nov_tomo_espacios = $this->mysqli->insert_id;
						
						$resultado->id_nov_tomo_espacios = $id_nov_tomo_espacios;
						
					} else {
						
						$sql = "INSERT tomo_espacios SET";
						$sql.= "  id_espacio='" . $espacio->id_espacio . "'";
						$sql.= ", cod_espacio='" . $espacio->cod_espacio . "'";
						$sql.= ", id_carrera='" . $espacio->id_carrera . "'";
						$sql.= ", cod_carrera='" . $espacio->cod_carrera . "'";
						$sql.= ", id_titulo='" . $p->titulo->model . "'";
						$sql.= ", cod_titulo='" . $p->titulo->codigo . "'";
						$sql.= ", id_tipo_titulo='" . $espacio->id_tipo_titulo . "'";
						$sql.= ", cod_tipo_titulo='" . $espacio->cod_tipo_titulo . "'";
						$sql.= ", id_tipo_clasificacion='" . $espacio->id_tipo_clasificacion . "'";
						
						$this->mysqli->query($sql);
						
						$id_tomo_espacio = $this->mysqli->insert_id;
						
						$resultado->id_tomo_espacio = $id_tomo_espacio;
						
						$_descrip = "ALTA DE TOMO-ESPACIO CON id='" . $id_tomo_espacio . "', TITULO '" . $p->titulo->label . "', CARRERA '" . espacio_descrip->carrera_descrip . "', ESPACIO '" . $espacio->espacio_descrip . "'";
						
						$this->auditoria($sql, null, null, 'tomo_espacios', $id_tomo_espacio, $_descrip, '', '');
					}
				}
				
			} else {
				$error->SetError(0, "novedad_existente");
				return $error;
			}
			
		} else {
			$error->SetError(0, "titulo_ya_asignado");
			return $error;
		}
  	}
  	
  	$this->mysqli->query("COMMIT");
  	
  	return $resultado;
  }
}

?>