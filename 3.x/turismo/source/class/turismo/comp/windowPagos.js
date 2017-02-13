qx.Class.define("turismo.comp.windowPagos",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (rowParamet)
	{
	this.base(arguments);
	
		this.set({
			caption: "Pagos",
			width: 1200,
			height: 700,
			showMinimize: false,
			showMaximize: false
		});
		
		this.setLayout(new qx.ui.layout.Canvas());
		//this.setResizable(false, false, false, false);

	this.addListenerOnce("appear", function(e){

	});
	
	var application = qx.core.Init.getApplication();
	
	var numberformatMonto = new qx.util.format.NumberFormat("es");
	numberformatMonto.setMaximumFractionDigits(2);
	numberformatMonto.setMinimumFractionDigits(2);
	
	var dateformatFecha = new qx.util.format.DateFormat("dd/MM/y HH:mm");
	
	var totalSaldo_cli = 0;
	var totalSel_cli = 0;
	
	var totalSaldo_pro = 0;
	var totalSel_pro = 0;
	
	var tableFocused = null;
	var statusbar;
	
	
	var functionAlerta = function(id_pago) {
		var p = {};
		p.operacion_producto_item = [];
		p.pago = tblPagoCli.buscar("id_pago", id_pago, false);

		for (var x in p.pago.operacion_producto_item) {
			p.operacion_producto_item.push(tblProducto.buscar("id_operacion_producto_item", p.pago.operacion_producto_item[x].id_operacion_producto_item, false));
		}
		
		//alert(qx.lang.Json.stringify(p, null, 2));
		
		var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Proforma");
		try {
			var resultado = rpc.callSync("alerta_pago", p);
		} catch (ex) {
			alert("Sync exception: " + ex);
		}
	}
	
	
	var functionActualizar = function(paramet) {
		var p = {};
		p.id_operacion = rowParamet.id_operacion;
		var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Proforma");
		try {
			var resultado = rpc.callSync("leer_pagos", p);
		} catch (ex) {
			alert("Sync exception: " + ex);
		}
		
		//alert(qx.lang.Json.stringify(resultado, null, 2));
		
		tableModelProducto.setDataAsMapArray(resultado.operacion_producto_item, true);
		tableModelPagoCli.setDataAsMapArray(resultado.pago_cli, true);
		tableModelPagoPro.setDataAsMapArray(resultado.pago_pro, true);
		
		totalSaldo_cli = 0;
		totalSel_cli = 0;
		totalSaldo_pro = 0;
		totalSel_pro = 0;
		for (var x = 0; x <= tableModelProducto.getRowCount() - 1; x++) {
			var rowData = tableModelProducto.getRowDataAsMap(x);
			totalSaldo_cli = totalSaldo_cli + rowData.saldo_cli;
			totalSaldo_pro = totalSaldo_pro + rowData.saldo_pro;
			if (selectionModelProducto.isSelectedIndex(x)) {
				totalSel_cli = totalSel_cli + rowData.saldo_cli;
				totalSel_pro = totalSel_pro + rowData.saldo_pro;
			}
		}
		//tblProducto.setAdditionalStatusBarText("T.saldo cli.: " + numberformatMonto.format(totalSaldo_cli) + " - T.sel.cli.: " + numberformatMonto.format(totalSel_cli));
		var aux;
		aux = '<table border="0" rules="all" width="100%" align="center"><tr align="center">';
		aux+= '<td>' + "Total saldo cli.: <b>" + numberformatMonto.format(totalSaldo_cli) + '</b></td>';
		aux+= '<td>' + "Total selec. cli.: <b>" + numberformatMonto.format(totalSel_cli) + '</b></td>';
		aux+= '<td colspan="6">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>';
		aux+= '<td>' + "Total saldo pro.: <b>" + numberformatMonto.format(totalSaldo_pro) + '</b></td>';
		aux+= '<td>' + "Total selec. pro.: <b>" + numberformatMonto.format(totalSel_pro) + '</b></td>';
		aux+= '</tr></table>';
		statusbar.setValue(aux);
		
		if (paramet) {
			if (paramet.id_pago != null) {
				paramet.tbl.buscar("id_pago", paramet.id_pago);
			} else if (paramet.id_operacion_producto_item != null) {
				tblProducto.buscar("id_operacion_producto_item", paramet.id_operacion_producto_item);
				
				var focusedRow = tblProducto.getFocusedRow();
				selectionModelProducto.setSelectionInterval(focusedRow, focusedRow);
			}
		}
	}

	
	
		// Menu de contexto
	
	var menuProducto = new componente.comp.ui.ramon.menu.Menu();
	
	var btnAsignarPagoCli = new qx.ui.menu.Button("Asignar pago cliente...");
	btnAsignarPagoCli.setEnabled(false);
	btnAsignarPagoCli.addListener("execute", function(e) {
		var win = new turismo.comp.windowPago(totalSel_cli, "C");
		win.addListener("aceptado", function(e){
			var data = e.getData();
			var rowData;
			var p = data;
			p.tipo = "C";
			p.id_operacion = rowParamet.id_operacion;
			p.operacion_producto_item = [];
			selectionModelProducto.iterateSelection(function(index) {
				rowData = tableModelProducto.getRowDataAsMap(index);
				//alert(qx.lang.Json.stringify(rowData, null, 2));
				if (rowData.bandera_cli != 0) p.operacion_producto_item.push(rowData.id_operacion_producto_item);
			});
			
			p.json = {};
			if (p.tipo_pago == "C" || p.tipo_pago == "D") {
				p.json.datos_pago = {nombre: p.tarjeta_nombre, cant_cuotas: p.tarjeta_cant_cuotas, nro_cupon: p.tarjeta_nro_cupon, nro_autorizacion: p.tarjeta_nro_autorizacion};
			} else if (p.tipo_pago == "Q") {
				p.json.datos_pago = {fecha_cobro: p.cheque_fecha_cobro};
			} else if (p.tipo_pago == "T") {
				p.json.datos_pago = {banco: p.transferencia_banco, nro_operacion: p.transferencia_nro_operacion};
			}
			
			//alert(qx.lang.Json.stringify(p, null, 2));
			
			var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Proforma");
			try {
				var resultado = rpc.callSync("grabar_pago", p);
			} catch (ex) {
				alert("Sync exception: " + ex);
			}
			
			tblProducto.resetSelection();
			tblProducto.setFocusedCell();
			
			functionActualizar({id_pago: resultado, tbl: tblPagoCli});
			//functionAlerta(resultado);
		}, this);
		win.setModal(true);
		application.getRoot().add(win);
		win.center();
		win.open();
	}, this);
	
	var btnAsignarPagoPro = new qx.ui.menu.Button("Asignar pago proveedor...");
	btnAsignarPagoPro.setEnabled(false);
	btnAsignarPagoPro.addListener("execute", function(e) {
		var win = new turismo.comp.windowPago(totalSel_pro, "P");
		win.addListener("aceptado", function(e){
			var data = e.getData();
			var rowData;
			var p = data;
			p.tipo = "P";
			p.id_operacion = rowParamet.id_operacion;
			p.operacion_producto_item = [];
			selectionModelProducto.iterateSelection(function(index) {
				rowData = tableModelProducto.getRowDataAsMap(index);
				//alert(qx.lang.Json.stringify(rowData, null, 2));
				if (rowData.bandera_pro != 0) p.operacion_producto_item.push(rowData.id_operacion_producto_item);
			});
			
			p.json = {};
			if (p.tipo_pago == "C" || p.tipo_pago == "D") {
				p.json.datos_pago = {nombre: p.tarjeta_nombre, cant_cuotas: p.tarjeta_cant_cuotas, nro_cupon: p.tarjeta_nro_cupon, nro_autorizacion: p.tarjeta_nro_autorizacion};
			} else if (p.tipo_pago == "Q") {
				p.json.datos_pago = {fecha_cobro: p.cheque_fecha_cobro};
			} else if (p.tipo_pago == "T") {
				p.json.datos_pago = {banco: p.transferencia_banco, nro_operacion: p.transferencia_nro_operacion};
			}
			
			//alert(qx.lang.Json.stringify(p, null, 2));
			
			var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Proforma");
			try {
				var resultado = rpc.callSync("grabar_pago", p);
			} catch (ex) {
				alert("Sync exception: " + ex);
			}
			
			tblProducto.resetSelection();
			tblProducto.setFocusedCell();
			
			functionActualizar({id_pago: resultado, tbl: tblPagoPro});
			//functionAlerta(resultado);
		}, this);
		win.setModal(true);
		application.getRoot().add(win);
		win.center();
		win.open();
	}, this);
	
	var btnInsertarLocalizador = new qx.ui.menu.Button("Insertar localizador...");
	btnInsertarLocalizador.addListener("execute", function(e) {
		var win = new turismo.comp.windowProducto();
		win.addListener("aceptado", function(e){
			var data = e.getData();
			data.model.f_venc.setHours(parseInt(data.model.h_venc.substr(0, 2)), parseInt(data.model.h_venc.substr(3, 2)));
			
			var p = data;
			p.model.id_operacion = rowParamet.id_operacion;
			p.model.id_operacion_producto_item = "0";
			
			//alert(qx.lang.Json.stringify(p, null, 2));
			
			var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Proforma");
			try {
				var resultado = rpc.callSync("agregar_referencia_operacion", p);
			} catch (ex) {
				alert("Sync exception: " + ex);
			}
			
			tblProducto.resetSelection();
			tblProducto.setFocusedCell();
			
			functionActualizar({id_operacion_producto_item: resultado});
			//var tableModel = tblFocus.getTableModel();
			//tableModel.addRowsAsMapArray([data], null, true);
			//tblFocus.setFocusedCell(0, tableModel.getRowCount() - 1, true);
			//tblFocus.focus();
		});
		
		win.setModal(true);
		application.getRoot().add(win);
		win.center();
		win.open();
	}, this);
	
	var btnModificarLocalizador = new qx.ui.menu.Button("Modificar localizador...");
	btnModificarLocalizador.setEnabled(false);
	btnModificarLocalizador.addListener("execute", function(e) {
		var focusedRow = tblProducto.getFocusedRow();
		var rowData = tblProducto.getTableModel().getRowDataAsMap(focusedRow);
		
		//alert(qx.lang.Json.stringify(rowData, null, 2));

		var win = new turismo.comp.windowProducto(rowData, rowData.producto);
		win.addListener("aceptado", function(e){
			var data = e.getData();
			data.model.f_venc.setHours(parseInt(data.model.h_venc.substr(0, 2)), parseInt(data.model.h_venc.substr(3, 2)));
			//alert(qx.lang.Json.stringify(data, null, 2));
			
			var p = data;
			p.model.id_operacion = rowParamet.id_operacion;
			p.model.id_operacion_producto_item = rowData.id_operacion_producto_item;
			
			//alert(qx.lang.Json.stringify(p, null, 2));
			
			var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Proforma");
			try {
				var resultado = rpc.callSync("agregar_referencia_operacion", p);
			} catch (ex) {
				alert("Sync exception: " + ex);
			}
			
			tblProducto.resetSelection();
			tblProducto.setFocusedCell();
			
			functionActualizar({id_operacion_producto_item: resultado});
		});
		
		win.setModal(true);
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	menuProducto.add(btnAsignarPagoCli);
	menuProducto.add(btnAsignarPagoPro);
	menuProducto.addSeparator();
	menuProducto.add(btnInsertarLocalizador);
	menuProducto.add(btnModificarLocalizador);
	menuProducto.memorizar();
	
	

		//Tabla

		var tableModelProducto = new qx.ui.table.model.Simple();
		tableModelProducto.setColumns(["Producto", "Localizador", "Descripción", "Venc.", "Cotiza", "Precio", "Saldo cli.", "Estado cli.", "Precio neto", "Saldo pro.", "Estado pro.", "Bandera cli", "Bandera pro"], ["producto", "localizador", "descrip", "f_venc", "cotiza", "precio", "saldo_cli", "estado_cli", "precio_neto", "saldo_pro", "estado_pro", "bandera_cli", "bandera_pro"]);
		tableModelProducto.setColumnSortable(0, false);
		tableModelProducto.setColumnSortable(1, false);
		tableModelProducto.setColumnSortable(2, false);
		tableModelProducto.setColumnSortable(3, false);
		tableModelProducto.setColumnSortable(4, false);
		tableModelProducto.setColumnSortable(5, false);
		tableModelProducto.setColumnSortable(6, false);
		tableModelProducto.setColumnSortable(7, false);
		tableModelProducto.setColumnSortable(8, false);
		tableModelProducto.setColumnSortable(9, false);
		tableModelProducto.setColumnSortable(10, false);

		var custom = {tableColumnModel : function(obj) {
			return new qx.ui.table.columnmodel.Resize(obj);
		}};
		var tblProducto = new componente.comp.ui.ramon.table.Table(tableModelProducto, custom);
		//var tblProducto = new turismo.comp.Table(tableModelProducto, custom);
		tblProducto.setWidth(450);
		tblProducto.setHeight(150);
		tblProducto.setShowCellFocusIndicator(false);
		tblProducto.toggleColumnVisibilityButtonVisible();
		//tblProducto.toggleStatusBarVisible();
		tblProducto.setContextMenu(menuProducto);
		tblProducto.modo = "normal";
		statusbar = tblProducto.getChildControl("statusbar");
		statusbar.setRich(true);
		
		
		//var l = new qx.ui.basic.Label("Esta es preva 1");
		//l.setAppearance("textfield");
		//tblProducto.getChildControl("statusbar").add(l);
		//var l = new qx.ui.basic.Label("Esta es preva 2");
		//l.setAppearance("textfield");
		//tblProducto.getChildControl("statusbar").add(l);

		
		
		
		tblProducto.addListener("focus", function(e){
			tableFocused = tblProducto;
		});
		
		tblProducto.addListener("dataEdited", function(e){
			/*
			var data = e.getData();
			if (data.col == 1) {
				var rowData = tableModelContactar.getRowDataAsMap(data.row);
				rowData.descrip = rowData.descrip.trim();
				tableModelContactar.setRowsAsMapArray([rowData], data.row, true);
			}
			*/
		});

		
		var tableColumnModelProducto = tblProducto.getTableColumnModel();
		tableColumnModelProducto.setColumnVisible(11, false);
		tableColumnModelProducto.setColumnVisible(12, false);
		
		var resizeBehavior = tableColumnModelProducto.getBehavior();
		resizeBehavior.set(0, {width:"7%", minWidth:100});
		resizeBehavior.set(1, {width:"19%", minWidth:100});
		resizeBehavior.set(2, {width:"19%", minWidth:100});
		resizeBehavior.set(3, {width:"9%", minWidth:100});
		resizeBehavior.set(4, {width:"4%", minWidth:100});
		resizeBehavior.set(5, {width:"7%", minWidth:100});
		resizeBehavior.set(6, {width:"7%", minWidth:100});
		resizeBehavior.set(7, {width:"7%", minWidth:100});
		resizeBehavior.set(8, {width:"7%", minWidth:100});
		resizeBehavior.set(9, {width:"7%", minWidth:100});
		resizeBehavior.set(10, {width:"7%", minWidth:100});
		

	var cellrenderReplace = new qx.ui.table.cellrenderer.Replace();
	cellrenderReplace.setReplaceMap({
		"0" : "Aéreo",
		"1" : "Hoteles",
		"2" : "Autos",
		"3" : "Seguros",
		"4" : "Cruceros",
		"5" : "Paquetes",
		"6" : "Trenes",
		"7" : "Traslado",
		"8" : "Excursiones",
		"9" : "Servicios"
	});
	cellrenderReplace.addReversedReplaceMap();
	tableColumnModelProducto.setDataCellRenderer(0, cellrenderReplace);
	
		var cellrendererDate = new qx.ui.table.cellrenderer.Date();
		cellrendererDate.setDateFormat(new qx.util.format.DateFormat("dd/MM/y HH:mm"));
		tableColumnModelProducto.setDataCellRenderer(3, cellrendererDate);
		
		var cellrendererNumber = new qx.ui.table.cellrenderer.Number();
		cellrendererNumber.setNumberFormat(numberformatMonto);
		tableColumnModelProducto.setDataCellRenderer(4, cellrendererNumber);
		tableColumnModelProducto.setDataCellRenderer(5, cellrendererNumber);
		tableColumnModelProducto.setDataCellRenderer(6, cellrendererNumber);
		tableColumnModelProducto.setDataCellRenderer(8, cellrendererNumber);
		tableColumnModelProducto.setDataCellRenderer(9, cellrendererNumber);
		
		var cellrendererString = new qx.ui.table.cellrenderer.String();
		cellrendererString.addNumericCondition("==", -1, "center", "#FF9F05", null, null, "bandera_cli");
		cellrendererString.addNumericCondition("==", 0, null, "#339900", null, null, "bandera_cli");
		cellrendererString.addNumericCondition("==", 1, "right", "#FF0000", null, null, "bandera_cli");
		tableColumnModelProducto.setDataCellRenderer(7, cellrendererString);
		
		var cellrendererString = new qx.ui.table.cellrenderer.String();
		cellrendererString.addNumericCondition("==", -1, "center", "#FF9F05", null, null, "bandera_pro");
		cellrendererString.addNumericCondition("==", 0, null, "#339900", null, null, "bandera_pro");
		cellrendererString.addNumericCondition("==", 1, "right", "#FF0000", null, null, "bandera_pro");
		tableColumnModelProducto.setDataCellRenderer(10, cellrendererString);
		

		/*
		var celleditorString = new qx.ui.table.celleditor.TextField();
		celleditorString.setValidationFunction(function(newValue, oldValue){
			return newValue.trim();
		});
		tableColumnModelProducto.setCellEditorFactory(0, celleditorString);
		tableColumnModelProducto.setCellEditorFactory(1, celleditorString);
		
		var celleditorNumber = new qx.ui.table.celleditor.TextField();
		celleditorNumber.setValidationFunction(function(newValue, oldValue){
			newValue = newValue.trim();
			if (newValue == "") return oldValue;
			else if (isNaN(newValue)) return oldValue; else return newValue;
		});

		tableColumnModelProducto.setCellEditorFactory(2, celleditorNumber);
		tableColumnModelProducto.setCellEditorFactory(3, celleditorNumber);
		*/
	
		

		var selectionModelProducto = tblProducto.getSelectionModel();
		selectionModelProducto.setSelectionMode(qx.ui.table.selection.Model.MULTIPLE_INTERVAL_SELECTION);
		selectionModelProducto.addListener("changeSelection", function(){
			var rowData;
			var bool_cli = false;
			var bool_pro = false;
			var bool_mod = false;
			
			totalSaldo_cli = 0;
			totalSel_cli = 0;
			totalSaldo_pro = 0;
			totalSel_pro = 0;
			
			totalSaldo_pro = 0;
			totalSel_pro = 0;
			
			for (var x = 0; x <= tableModelProducto.getRowCount() - 1; x++) {
				var rowData = tableModelProducto.getRowDataAsMap(x);
				
				totalSaldo_cli = totalSaldo_cli + rowData.saldo_cli;
				totalSaldo_pro = totalSaldo_pro + rowData.saldo_pro;
				if (selectionModelProducto.isSelectedIndex(x)) {
					totalSel_cli = totalSel_cli + rowData.saldo_cli;
					totalSel_pro = totalSel_pro + rowData.saldo_pro;
					if (rowData.bandera_cli != 0) bool_cli = true;
					if (rowData.bandera_pro != 0) bool_pro = true;
				}
			}
				/*
				selectionModelProducto.iterateSelection(function(index){
					rowData = tableModelProducto.getRowData(index);
					totalSel_cli+= rowData.saldo_cli;
					if (rowData.bandera_cli != 0) bool = true;
				});
				*/

			
			bool_mod = (selectionModelProducto.getSelectedCount() == 1);
			
			if (tableFocused == tblProducto) {
				btnAsignarPagoCli.setEnabled(bool_cli);
				btnAsignarPagoPro.setEnabled(bool_pro);
				btnModificarLocalizador.setEnabled(bool_mod);
				menuProducto.memorizar([btnAsignarPagoCli, btnAsignarPagoPro, btnModificarLocalizador]);
			} else {
				menuProducto.memorizarEnabled([btnAsignarPagoCli], bool_cli);
				menuProducto.memorizarEnabled([btnAsignarPagoPro], bool_pro);
				menuProducto.memorizarEnabled([btnModificarLocalizador], bool_mod);
			}
			
			//tblProducto.setAdditionalStatusBarText("T.saldo cli.: " + numberformatMonto.format(totalSaldo_cli) + " - T.sel.cli: " + numberformatMonto.format(totalSel_cli));
			var aux;
			aux = '<table border="0" rules="all" width="100%" align="center"><tr align="center">';
			aux+= '<td>' + "Total saldo cli.: <b>" + numberformatMonto.format(totalSaldo_cli) + '</b></td>';
			aux+= '<td>' + "Total selec. cli.: <b>" + numberformatMonto.format(totalSel_cli) + '</b></td>';
			aux+= '<td colspan="6">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>';
			aux+= '<td>' + "Total saldo pro.: <b>" + numberformatMonto.format(totalSaldo_pro) + '</b></td>';
			aux+= '<td>' + "Total selec. pro.: <b>" + numberformatMonto.format(totalSel_pro) + '</b></td>';
			aux+= '</tr></table>';
			statusbar.setValue(aux);
		});

		this.add(tblProducto, {left: 0, top: 0, right: 0, bottom: "45%"});
	
	
	
	
	
	
	
	
		// Menu de contexto
	
	var menuPagoCli = new componente.comp.ui.ramon.menu.Menu();
	
	var btnRecibo = new qx.ui.menu.Button("Recibo...");
	btnRecibo.setEnabled(false);
	btnRecibo.addListener("execute", function(e) {
		var rowData = tableModelPagoCli.getRowDataAsMap(tblPagoCli.getFocusedRow());
		
		window.open("services/class/comp/Impresion.php?rutina=recibo&id_pago=" + rowData.id_pago);
	}, this);
	
	menuPagoCli.add(btnRecibo);
	menuPagoCli.memorizar();
	
	
		
		
		//Tabla

		var tableModelPagoCli = new qx.ui.table.model.Simple();
		tableModelPagoCli.setColumns(["Fecha", "Importe", "Tipo", "Datos", "Usuario"], ["fecha", "importe", "tipo_pago", "datos", "usuario"]);
		tableModelPagoCli.setColumnSortable(0, false);
		tableModelPagoCli.setColumnSortable(1, false);
		tableModelPagoCli.setColumnSortable(2, false);
		tableModelPagoCli.setColumnSortable(3, false);
		tableModelPagoCli.setColumnSortable(4, false);

		var custom = {tableColumnModel : function(obj) {
			return new qx.ui.table.columnmodel.Resize(obj);
		}};
		var tblPagoCli = new componente.comp.ui.ramon.table.Table(tableModelPagoCli, custom);
		tblPagoCli.setWidth(450);
		tblPagoCli.setHeight(150);
		tblPagoCli.setShowCellFocusIndicator(false);
		tblPagoCli.toggleColumnVisibilityButtonVisible();
		tblPagoCli.toggleStatusBarVisible();
		tblPagoCli.setContextMenu(menuPagoCli);
		
		
		tblPagoCli.addListener("focus", function(e){
			tableFocused = tblPagoCli;
		});
		
		tblPagoCli.addListener("dataEdited", function(e){
			/*
			var data = e.getData();
			if (data.col == 1) {
				var rowData = tableModelContactar.getRowDataAsMap(data.row);
				rowData.descrip = rowData.descrip.trim();
				tableModelContactar.setRowsAsMapArray([rowData], data.row, true);
			}
			*/
		});

		
		var tableColumnModelPagoCli = tblPagoCli.getTableColumnModel();
		var resizeBehaviorPagoCli = tableColumnModelPagoCli.getBehavior();
		//resizeBehaviorPagoCli.set(0, {width:"20%", minWidth:100});
		//resizeBehaviorPagoCli.set(1, {width:"40%", minWidth:100});
		//resizeBehaviorPagoCli.set(2, {width:"20%", minWidth:100});
		//resizeBehaviorPagoCli.set(3, {width:"20%", minWidth:100});
		

		var cellrendererNumber = new qx.ui.table.cellrenderer.Number();
		cellrendererNumber.setNumberFormat(numberformatMonto);
		tableColumnModelPagoCli.setDataCellRenderer(1, cellrendererNumber);
		
		
		var cellrendererDate = new qx.ui.table.cellrenderer.Date();
		cellrendererDate.setDateFormat(dateformatFecha);
		tableColumnModelPagoCli.setDataCellRenderer(0, cellrendererDate);
		
		
		var cellrendererReplace = new qx.ui.table.cellrenderer.Replace;
		cellrendererReplace.setReplaceMap({
			"E": "Efectivo",
			"C": "T.Crédito",
			"D": "T.Débito",
			"Q": "Cheque",
			"T": "Transferencia"
		});
		cellrendererReplace.addReversedReplaceMap();
		tableColumnModelPagoCli.setDataCellRenderer(2, cellrendererReplace);
		

		

		var selectionModelPagoCli = tblPagoCli.getSelectionModel();
		selectionModelPagoCli.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
		selectionModelPagoCli.addListener("changeSelection", function(){
			var bool = ! selectionModelPagoCli.isSelectionEmpty();
			
			btnRecibo.setEnabled(bool);
			menuPagoCli.memorizar([btnRecibo]);
			
			if (bool) {
				var rowData = tableModelPagoCli.getRowData(tblPagoCli.getFocusedRow());
				var focusedRow;
				
				tblProducto.resetSelection();
				for (var x in rowData.operacion_producto_item) {
					tblProducto.buscar("id_operacion_producto_item", rowData.operacion_producto_item[x].id_operacion_producto_item);
					focusedRow = tblProducto.getFocusedRow();
					selectionModelProducto.addSelectionInterval(focusedRow, focusedRow);
				}
			}
			//btnEliminarContactar.setEnabled(bool);
			//menuContactar.memorizar([btnEliminarContactar]);
		});

		
		var aux = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
		aux.add(new qx.ui.basic.Label("Pagos cliente"), {left: 0, top: 0});
		aux.add(tblPagoCli, {left: 0, top: 15, right: 0, bottom: 0});
		
		this.add(aux, {left: 0, top: "57%", right: "51%", bottom: 0});

		

	

		
		
		
		
		//Tabla

		var tableModelPagoPro = new qx.ui.table.model.Simple();
		tableModelPagoPro.setColumns(["Fecha", "Importe", "Tipo", "Datos", "Usuario"], ["fecha", "importe", "tipo_pago", "datos", "usuario"]);
		tableModelPagoPro.setColumnSortable(0, false);
		tableModelPagoPro.setColumnSortable(1, false);
		tableModelPagoPro.setColumnSortable(2, false);
		tableModelPagoPro.setColumnSortable(3, false);
		tableModelPagoPro.setColumnSortable(4, false);

		var custom = {tableColumnModel : function(obj) {
			return new qx.ui.table.columnmodel.Resize(obj);
		}};
		var tblPagoPro = new componente.comp.ui.ramon.table.Table(tableModelPagoPro, custom);
		tblPagoPro.setWidth(450);
		tblPagoPro.setHeight(150);
		tblPagoPro.setShowCellFocusIndicator(false);
		tblPagoPro.toggleColumnVisibilityButtonVisible();
		tblPagoPro.toggleStatusBarVisible();
		//tblPagoPro.setContextMenu(menuContactar);
		
		
		tblPagoPro.addListener("focus", function(e){
			tableFocused = tblPagoPro;
		});
		
		tblPagoPro.addListener("dataEdited", function(e){
			/*
			var data = e.getData();
			if (data.col == 1) {
				var rowData = tableModelContactar.getRowDataAsMap(data.row);
				rowData.descrip = rowData.descrip.trim();
				tableModelContactar.setRowsAsMapArray([rowData], data.row, true);
			}
			*/
		});

		
		var tableColumnModelPagoPro = tblPagoPro.getTableColumnModel();
		var resizeBehaviorPagoPro = tableColumnModelPagoPro.getBehavior();
		//resizeBehaviorPagoPro.set(0, {width:"20%", minWidth:100});
		//resizeBehaviorPagoPro.set(1, {width:"40%", minWidth:100});
		//resizeBehaviorPagoPro.set(2, {width:"20%", minWidth:100});
		//resizeBehaviorPagoPro.set(3, {width:"20%", minWidth:100});
		

		var cellrendererNumber = new qx.ui.table.cellrenderer.Number();
		cellrendererNumber.setNumberFormat(numberformatMonto);
		tableColumnModelPagoPro.setDataCellRenderer(1, cellrendererNumber);
		
		
		var cellrendererDate = new qx.ui.table.cellrenderer.Date();
		cellrendererDate.setDateFormat(dateformatFecha);
		tableColumnModelPagoPro.setDataCellRenderer(0, cellrendererDate);
		
		
		var cellrendererReplace = new qx.ui.table.cellrenderer.Replace;
		cellrendererReplace.setReplaceMap({
			"E": "Efectivo",
			"C": "T.Crédito",
			"D": "T.Débito",
			"Q": "Cheque",
			"T": "Transferencia"
		});
		cellrendererReplace.addReversedReplaceMap();
		tableColumnModelPagoPro.setDataCellRenderer(2, cellrendererReplace);
		

		

		var selectionModelPagoPro = tblPagoPro.getSelectionModel();
		selectionModelPagoPro.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
		selectionModelPagoPro.addListener("changeSelection", function(){
			var bool = ! selectionModelPagoPro.isSelectionEmpty();
			if (bool) {
				var rowData = tableModelPagoPro.getRowData(tblPagoPro.getFocusedRow());
				var focusedRow;
				
				tblProducto.resetSelection();
				for (var x in rowData.operacion_producto_item) {
					tblProducto.buscar("id_operacion_producto_item", rowData.operacion_producto_item[x].id_operacion_producto_item);
					focusedRow = tblProducto.getFocusedRow();
					selectionModelProducto.addSelectionInterval(focusedRow, focusedRow);
				}
			}
			//btnEliminarContactar.setEnabled(bool);
			//menuContactar.memorizar([btnEliminarContactar]);
		});

		var aux = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
		aux.add(new qx.ui.basic.Label("Pagos proveedor"), {left: 0, top: 0});
		aux.add(tblPagoPro, {left: 0, top: 15, right: 0, bottom: 0});
		
		this.add(aux, {left: "51%", top: "57%", right: 0, bottom: 0});
		
		
		
		
		
	
	functionActualizar();
	
	
	},
	members : 
	{

	},
	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});