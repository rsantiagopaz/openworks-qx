<?php 

require("../services/class/elpintao/conexion.php");
$link = mysql_connect("$servidor", "$usuario", "$password");
mysql_select_db("$base", $link);
mysql_query("SET NAMES 'utf8'");

$q = mysql_query("SELECT * FROM configuraciones LIMIT 1");
$config = mysql_fetch_object($q);

$_REQUEST["id_ctacte_pago"];

$q = mysql_query("
SELECT
ctacte_pagos.*,
ctacte_pagos.fyh as fechayhora,
clientes.*,
formas_pago.*,
usuario.* 
FROM ctacte_pagos
INNER JOIN ctas_ctes USING(id_cta_cte)
INNER JOIN clientes USING(id_cliente)
INNER JOIN formas_pago USING(id_formas_pago)
INNER JOIN usuario USING(id_usuario)
WHERE ctacte_pagos.id_ctacte_pago = '" . $_REQUEST["id_ctacte_pago"] ."'
");
$r = mysql_fetch_object($q);

SWITCH ($r->condicion_iva) {
	CASE "I":
		$r->condicion = "Resp. Inscripto"; 
	BREAK;
	CASE "C":
		$r->condicion = "Consumidor Final";
	BREAK;
	CASE "E":
		$r->condicion = "Excento";
	BREAK;
}

/*
mysql_query("SET @id_cta_cte='" . $r->id_cta_cte . "'");

$DESDE_HASTA_VENTA = " AND ventas.fecha <= DATE('" . $r->fyh . "') ";
$DESDE_HASTA_NC = " AND notascreditos.fecha <= DATE('" . $r->fyh . "') ";
$DESDE_HASTA_PAGO = " AND date(ctacte_pagos.fyh) <= DATE('" . $r->fyh . "') ";


$qSALDO = mysql_query("
	(SELECT
	id_venta as id,
	ventas.fecha,
	'Venta' as operacion,
	CONCAT(ventas.tipo, ' - ', ventas.nro) as tipo_nro,
	(formas_pago.t_monto_total + (formas_pago.t_monto_total*formas_pago.t_interes_ctacte/100)) as debe,
	'0' as haber,
	'1' as orden
	FROM ventas
	INNER JOIN formas_pago USING(id_formas_pago)
	WHERE formas_pago.t_id_cta_cte = @id_cta_cte
	AND ventas.estado = 'A'
	 " . $DESDE_HASTA_VENTA . "
	ORDER BY ventas.fecha, ventas.id_venta DESC)
UNION
	(SELECT
	id_notacredito as id,
	notascreditos.fecha,
	'Nota Credito' as operacion,
	CONCAT(notascreditos.tipo, ' - ', notascreditos.nro, ' - Fact:', notascreditos.tipo_fac, '-', notascreditos.nro_fac) as tipo_nro,
	'0' as debe,
	(formas_pago.t_monto_total + (formas_pago.t_monto_total*formas_pago.t_interes_ctacte/100)) as haber,
	'2' as orden
	FROM notascreditos
	LEFT JOIN ventas USING(id_venta)
	INNER JOIN formas_pago ON notascreditos.id_formas_pago = formas_pago.id_formas_pago
	INNER JOIN notascreditos_items USING(id_notacredito)
	WHERE formas_pago.t_id_cta_cte = @id_cta_cte
	AND notascreditos.estado = 'A'
	 " . $DESDE_HASTA_NC . "
	GROUP BY notascreditos.id_notacredito
	ORDER BY notascreditos.fecha, notascreditos.id_notacredito DESC)
UNION
	(SELECT
	ctacte_pagos.id_ctacte_pago as id,
	date(ctacte_pagos.fyh) as fecha,
	'Pago' as operacion,
	id_ctacte_pago as tipo_nro,
	'0' as debe,
	ctacte_pagos.monto as haber,
	'3' as orden
	FROM ctacte_pagos
	WHERE id_cta_cte = @id_cta_cte
	AND monto > 0
	 " . $DESDE_HASTA_PAGO . "
	ORDER BY date(ctacte_pagos.fyh), ctacte_pagos.id_ctacte_pago DESC)
ORDER BY fecha, orden
		");
// die($q);

if (mysql_error()) {
	die(mysql_error());
}


$DEBE = 0;
$HABER = 0;
$SALDO = 0;
while ($rSALDO = mysql_fetch_object($qSALDO)) {
// 	$r->debe = (float) $r->debe;
// 	$r->haber = (float) $r->haber;
	$DEBE += $rSALDO->debe;
	$HABER += $rSALDO->haber;
// 	$r->saldo = (float) $debe - $haber;
}

$SALDO = $DEBE - $HABER;

*/

$qPAGO = mysql_query("
SELECT
monto,
formas_pago.*
FROM ctacte_pagos
INNER JOIN formas_pago USING(id_formas_pago)
WHERE id_ctacte_pago = '" . $_REQUEST["id_ctacte_pago"] . "'
");

$rPAGO = mysql_fetch_object($qPAGO);

//$SALDO_ANTERIOR = $SALDO + $rPAGO->monto; 

/*
$qSA = mysql_query("
SELECT 
SUM(t_monto_total+(t_monto_total*t_interes_ctacte)/100) as anterior,
(SELECT SUM(monto) FROM ctacte_pagos WHERE id_cta_cte = '" . $r->id_cta_cte . "') as pagos
FROM formas_pago
INNER JOIN ventas USING(id_formas_pago)
WHERE t_id_cta_cte = '" . $r->id_cta_cte . "'
AND ventas.estado = 'A'
");
$rSA = mysql_fetch_object($qSA);
*/


require("../services/class/elpintao/CtaCteDetalles.php");

$ctacte = new class_CtaCteDetalles();
$params = Array();
$params[0] = new stdClass();
$params[0]->id_cta_cte = $r->id_cta_cte;
//$params[0]->desde = $_REQUEST["desde"];
$params[0]->hasta = date("Y-m-d");

$res = $ctacte->method_getCtaCteMovimientos ($params, $error);

$debe_tot = 0;
$haber_tot = 0;
$saldo_tot = 0;
$j = 0;
?>
<!--
<table width="750px" border="1">
<tr>
	<td>id</td>
	<td>Op</td>
	<td>Debe</td>
	<td>Haber</td>
	<td>Saldo</td>
</tr>
-->
<?php
for ($i = 0; $i < count($res->datos); $i++) {
	?>
	<!--
	<tr>
		<td><?php echo $res->datos[$i]->id; ?>&nbsp;</td>
		<td><?php echo $res->datos[$i]->operacion; ?>&nbsp;</td>
		<td><?php echo $res->datos[$i]->debe; ?>&nbsp;</td>
		<td><?php echo $res->datos[$i]->haber; ?>&nbsp;</td>
		<td><?php echo $res->datos[$i]->saldo; ?>&nbsp;</td>
	</tr>
	-->
	<?php
	//echo "id: " . $res->datos[$i]->id . " - Op: " . $res->datos[$i]->operacion . " - Debe: " . $res->datos[$i]->debe . " - Haber: " . $res->datos[$i]->haber . " - Saldo: " . $res->datos[$i]->saldo . "<br />";
	if (($res->datos[$i]->id == $_REQUEST["id_ctacte_pago"]) && ($res->datos[$i]->operacion == "Pago")) {
		$SALDO_ANTERIOR = $res->datos[$i]->saldo + $rPAGO->monto;
		$SALDO = $res->datos[$i]->saldo;
		$i = count($res->datos);
		break;
	} else {
	
 		//echo "Op: " . $res->datos[$i]->operacion . " - Debe: " . $res->datos[$i]->debe . " - Haber: " . $res->datos[$i]->haber . " - Saldo: " . $res->datos[$i]->saldo . "<br />";
		$debe_tot += $res->datos[$i]->debe;
		$haber_tot += $res->datos[$i]->haber;
		$saldo_tot += $res->datos[$i]->saldo;
		//$SALDO = $res->datos[$i]->saldo;
		//$SALDO_ANTERIOR = $res->datos[$i]->saldo + $rPAGO->monto;
		
	}
}
//die();
/*
echo $debe_tot . " - " . $haber_tot . " - " . $saldo_tot . "<br />";

echo $res->datos[$j]->saldo . " - " . $rPAGO->monto . "<br />"; 

$SALDO = $res->datos[$i]->saldo;
$SALDO_ANTERIOR = $res->datos[$i]->saldo + $rPAGO->monto;
*/
?>

<table cellpadding="5" cellspacing="0" width="700px" border="1" >
<tr align="center">
	<td>
	<table width="100%" border="0">
	<tr>
		<td width="33%">
			<table width="100%" border="0" style="font-size:14; font-weight: bold;" align="center">
				<tr>
				<td rowspan="3"><img src="logo.png" border="0"></td>
				<td><b>El Pintao Pintuteria</b></td>
				</tr>
				<!-- 
				<tr style="font-size:8; font-weight:normal;"><td>DirecciÃ³n: Rivadavia NÂº 1018</td></tr>
				<tr style="font-size:8; font-weight:normal;"><td>Tel: 0385 421-8866/ 0385 424-1917</td></tr>
				 -->
				 <tr style="font-size:8; font-weight:normal;"><td>Dir.: <?php echo $config->direccion; ?></td></tr>
				<tr style="font-size:8; font-weight:normal;"><td>Tel/Fax: <?php echo $config->telefono; ?></td></tr>
			</table>
			</td>
		<td width="33%" align="center"><table align="center" cellpadding="5" border="1"><tr><td align="center"><big>RECIBO DE PAGO</big><br /><font style="font-size:8;">Sin firma y sello no posee validez.</font></td></tr></table></td>
		<td width="33%" align="right">Fecha: <?php echo $r->fechayhora; ?> <br /><br /> <?php echo $config->sucursal; ?> - 00000000<?php echo $_REQUEST["id_ctacte_pago"]; ?> <br /> Vendedor: <?php echo $r->nick; ?></td>
	</tr>
	<tr><td colspan="3"><hr></td></tr>
	<tr><td colspan="3" align="center"><b><u>Cliente</u>:</b> <?php echo $r->dni_cuit; ?> - <?php echo $r->razon_social; ?> - <?php echo $r->condicion; ?><br /><br />
		Recibimos del mismo la suma de: <b>$<?php echo number_format($rPAGO->monto, 2, ',', '.'); ?></b> para ser aplicada a CUENTA CORRIENTE. 
		</td>
	</tr>
	<tr><td colspan="3"><hr></td></tr>
	<tr><td colspan="3">
	<b><u>FORMA DE PAGO</u>:</b> 
		Efectivo: $<?php echo number_format($rPAGO->e_monto_total, 2, ',', '.'); ?> -
		Credito: $<?php echo number_format($rPAGO->c_monto_total, 2, ',', '.'); ?> -
		Debito: $<?php echo number_format($rPAGO->d_monto_total, 2, ',', '.'); ?> -
		Cheque: $<?php echo number_format($r->q_monto_total, 2, ',', '.'); ?> 
	</td></tr>
	<tr><td colspan="3"><hr></td></tr>
	<tr><td align="right">SALDO ANTERIOR: </td><td align="right">$<?php echo number_format($SALDO_ANTERIOR, 2, ',', '.'); ?></td><td></td></tr>
	<tr><td align="right">PAGO A CUENTA: </td><td align="right">$<?php echo number_format($rPAGO->monto, 2, ',', '.'); ?></td><td></td></tr>
	<tr><td></td><td><hr /></td><td></td></tr>
	<tr><td align="right">SALDO ACTUAL: </td><td align="right">$<?php echo number_format($SALDO, 2, ',', '.'); ?></td><td></td></tr>
	<tr><td colspan="3"><hr></td></tr>
	<tr><td colspan="3" align="right"><br />____________________________<br /> Firma y Sello &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>
	</table>
	</td>
	</tr>
</table>
<script>
//window.print();
</script>		
<?php
?>