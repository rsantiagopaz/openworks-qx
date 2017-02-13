<?php

require("Conexion.php");

set_time_limit(0);

$link1 = mysql_connect($servidor, $usuario, $password);
mysql_select_db($base, $link1);
mysql_query("SET NAMES 'utf8'", $link1);

switch ($_REQUEST['rutina'])
{
case "recibo" : {
	
	$sql = "SELECT cliente.*, usuario.descrip AS usuario, pago.importe, pago.tipo_pago FROM ((pago INNER JOIN usuario USING(id_usuario)) INNER JOIN operacion_cliente USING(id_operacion)) INNER JOIN cliente USING(id_cliente) WHERE pago.id_pago=" . $_REQUEST['id_pago'];
	$rs = mysql_query($sql);
	$row = mysql_fetch_object($rs);
	$apenom = $row->apellido . ", " . $row->nombre . " - " . $row->dni . " - " . $row->cuit;

	$tipo_pago = array();
	$tipo_pago["E"] = "Efectivo";
	$tipo_pago["C"] = "Tarjeta crédito";
	$tipo_pago["D"] = "Tarjeta débito";
	$tipo_pago["Q"] = "Cheque";
	$tipo_pago["T"] = "Transferencia";
	
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
				<td><b>Almundo</b></td>
				</tr>
				<!-- 
				<tr style="font-size:8; font-weight:normal;"><td>DirecciÃ³n: Rivadavia NÂº 1018</td></tr>
				<tr style="font-size:8; font-weight:normal;"><td>Tel: 0385 421-8866/ 0385 424-1917</td></tr>
				 -->
				<tr style="font-size:8; font-weight:normal;"><td>Mitre 372</td><td>C.P. 4200</td></tr>
				<tr style="font-size:8; font-weight:normal;"><td>(0385) 4221527</td><td>mario.avila@almundo.com</td></tr>
			</table>
			</td>
		<td width="33%" align="center"><table align="center" cellpadding="5" border="1"><tr><td align="center"><big>RECIBO DE PAGO</big><br /><font style="font-size:8;">Sin firma y sello no posee validez.</font></td></tr></table></td>
		<td width="33%" align="right">Fecha: <?php echo date('Y-m-d'); ?> <br /><br /> <?php echo $config->sucursal; ?> - 00000000<?php echo $_REQUEST["id_ctacte_pago"]; ?> <br /> Usuario: <?php echo $row->usuario; ?></td>
	</tr>
	<tr><td colspan="3"><hr></td></tr>
	<tr><td colspan="3" align="center"><b><u>Cliente</u>:</b> <?php echo $apenom; ?><br /><br />
		Recibimos del mismo la suma de: <b>$<?php echo number_format((float) $row->importe, 2, ',', '.'); ?></b> 
		</td>
	</tr>
	<tr><td colspan="3"><hr></td></tr>
	<tr><td colspan="3">
	<b><u>FORMA DE PAGO</u>:</b> 
		<?php echo $tipo_pago[$row->tipo_pago] . ": $" . number_format((float) $row->importe, 2, ',', '.'); ?>
	</td></tr>
	<tr><td colspan="3"><hr></td></tr>
	<!--
	<tr><td align="right">SALDO ANTERIOR: </td><td align="right">$<?php echo number_format($SALDO_ANTERIOR, 2, ',', '.'); ?></td><td></td></tr>
	<tr><td align="right">PAGO A CUENTA: </td><td align="right">$<?php echo number_format($rPAGO->monto, 2, ',', '.'); ?></td><td></td></tr>
	<tr><td></td><td><hr /></td><td></td></tr>
	<tr><td align="right">SALDO ACTUAL: </td><td align="right">$<?php echo number_format($SALDO, 2, ',', '.'); ?></td><td></td></tr>
	-->
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td colspan="3" align="right"><br />____________________________<br /> Firma y Sello &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>
	</table>
	</td>
	</tr>
</table>
<script>
//window.print();
</script>		

<?php

	
break;
}
	
	
case "comprobante_entrega" : {
	
	$sql = "SELECT entrega_lugar.descrip AS lugar, entrega.descrip, entrega.fecha FROM entrega INNER JOIN entrega_lugar USING(id_entrega_lugar) WHERE id_entrega=" . $_REQUEST['id_entrega'];
	$rsEntrega = mysql_query($sql);
	$rowEntrega = mysql_fetch_object($rsEntrega);

	$sql = "SELECT producto.descrip, stock.lote, stock.f_vencimiento, entrega_item.cantidad FROM ((entrega INNER JOIN entrega_item USING(id_entrega)) INNER JOIN stock USING(id_stock)) INNER JOIN producto ON stock.id_producto = producto.id_producto WHERE entrega.id_entrega=" . $_REQUEST['id_entrega'] . " ORDER BY descrip, f_vencimiento";
	$rsEntrega_item = mysql_query($sql);
	
	?>
	<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>Comprobante de entrega</title>
	</head>
	<body>
	<table border="0" width="700" align="center">
	<tr><td align="center" colspan="2"><big>COMPROBANTE DE ENTREGA</big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>Destino: </td><td><?php echo $rowEntrega->lugar; ?></td></tr>
	<tr><td>Descripción: </td><td><?php echo $rowEntrega->descrip; ?></td></tr>
	<tr><td>Fecha: </td><td><?php echo $rowEntrega->fecha; ?></td></tr>
	<tr><td>&nbsp;</td></tr>
	
	<tr><td colspan="20">
	<table border="1" rules="all" width="100%" align="center">
	<tr><th>Producto</th><th>Lote</th><th>F.vencimiento</th><th align="right">Cantidad</th></tr>
	<?php
	while ($rowEntrega_item = mysql_fetch_object($rsEntrega_item)) {
		?>
		<tr><td><?php echo $rowEntrega_item->descrip; ?></td><td><?php echo $rowEntrega_item->lote; ?></td><td><?php echo $rowEntrega_item->f_vencimiento; ?></td><td align="right"><?php echo $rowEntrega_item->cantidad; ?></td></tr>
		<?php
	}
	?>
	</table>
	</td></tr>
	</table>
	</body>
	</html>
	<?php
	
break;
}
	
	
case "consumo_producto" : {

	$sql = "SELECT producto.id_producto, producto.descrip, SUM(entrega_item.cantidad) AS cantidad FROM (entrega INNER JOIN entrega_item USING(id_entrega)) INNER JOIN producto USING(id_producto) WHERE entrega.fecha BETWEEN '" . $_REQUEST['desde'] . "' AND '" . $_REQUEST['hasta'] . "' GROUP BY id_producto ORDER BY descrip";
	$rs = mysql_query($sql);
	
	?>
	<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>Listado Consumo x Producto</title>
	</head>
	<body>
	<table border="0" width="700" align="center">
	<tr><td align="center" colspan="6"><big><?php echo date('Y-m-d') ?> - LISTADO CONSUMO x PRODUCTO</big></td></tr>
	<tr><td align="center" colspan="6"><big>(período <?php echo substr($_REQUEST['desde'], 0, 10) . " / " . substr($_REQUEST['hasta'], 0, 10) ?>)</big></td></tr>
	<tr><td>&nbsp;</td></tr>
	
	<tr><td colspan="20">
	<table border="1" rules="all" width="100%" align="center">
	<tr><th>Producto</th><th align="right">Cantidad</th></tr>
	<?php
	while ($row = mysql_fetch_array($rs)) {
		?>
		<tr><td><?php echo $row['descrip']; ?></td><td align="right"><?php echo $row['cantidad']; ?></td></tr>
		<?php
	}
	?>
	</table>
	</td></tr>
	</table>
	</body>
	</html>
	<?php
	
break;
}


case "stock" : {

	$sql = "SELECT producto.*, SUM(stock.stock) AS cantidad FROM producto LEFT JOIN stock USING(id_producto) GROUP BY id_producto ORDER BY descrip";
	$rs = mysql_query($sql);
	
	?>
	<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>Listado de Stock</title>
	</head>
	<body>
	<table border="0" width="700" align="center">
	<tr><td align="center" colspan="6"><big><?php echo date('Y-m-d') ?> - LISTADO DE STOCK</big></td></tr>
	<tr><td>&nbsp;</td></tr>
	
	<tr><td colspan="20">
	<table border="1" rules="all" width="100%" align="center">
	<tr><th>Producto</th><th align="right">Pto.reposición</th><th align="right">Stock</th></tr>
	<?php
	while ($row = mysql_fetch_array($rs)) {
		?>
		<tr><td><?php echo $row['descrip']; ?></td><td align="right"><?php echo $row['pto_reposicion']; ?></td><td align="right"><?php echo (($row['cantidad'] == null) ? 0: $row['cantidad']); ?></td></tr>
		<?php
	}
	?>
	</table>
	</td></tr>
	</table>
	</body>
	</html>
	<?php
	
break;
}


case "producto_falta" : {

	$sql = "SELECT producto.*, SUM(stock.stock) AS cantidad FROM producto LEFT JOIN stock USING(id_producto) GROUP BY id_producto HAVING cantidad <= pto_reposicion OR ISNULL(cantidad) ORDER BY descrip";
	$rs = mysql_query($sql);
	
	?>
	<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>Listado Producto en Falta</title>
	</head>
	<body>
	<table border="0" width="700" align="center">
	<tr><td align="center" colspan="6"><big><?php echo date('Y-m-d') ?> - LISTADO PRODUCTO EN FALTA</big></td></tr>
	<tr><td>&nbsp;</td></tr>
	
	<tr><td colspan="20">
	<table border="1" rules="all" width="100%" align="center">
	<tr><th>Producto</th><th align="right">Pto.reposición</th><th align="right">Stock</th></tr>
	<?php
	while ($row = mysql_fetch_array($rs)) {
		?>
		<tr><td><?php echo $row['descrip']; ?></td><td align="right"><?php echo $row['pto_reposicion']; ?></td><td align="right"><?php echo (($row['cantidad'] == null) ? 0: $row['cantidad']); ?></td></tr>
		<?php
	}
	?>
	</table>
	</td></tr>
	</table>
	</body>
	</html>
	<?php
	
break;
}

}

?>