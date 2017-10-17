qx.Class.define("sacdiag.comp.pageControlDePrefacturaciones",
{
	extend : qx.ui.tabview.Page,
	construct : function ()
	{
	this.base(arguments);

	this.setLabel('Control de Prefacturaciones');
	this.toggleShowCloseButton();
	this.setLayout(new qx.ui.layout.Canvas());
	
	this.addListenerOnce("appear", function(e){
		//dtfDesde.focus();
	});
	
	
	var application = qx.core.Init.getApplication();
	
	var rowDataSolicitud;
	var rowDataPrefac;
	
	
	
	
	var functionActualizarPrefac = function(id_prefacturacion) {
		
		tblPrefac.resetSelection();
		tblSolicitud.resetSelection();
		tblPrestacion.resetSelection();
		
		tblPrefac.setFocusedCell();
		tblSolicitud.setFocusedCell();
		tblPrestacion.setFocusedCell();
		
		tableModelSolicitud.setDataAsMapArray([], true);
		tableModelPrestacion.setDataAsMapArray([], true);
		
		var p = {};
		
		var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Prefacturacion");
		rpc.addListener("completed", function(e){
			var data = e.getData();
			
			//alert(qx.lang.Json.stringify(data, null, 2));

			tableModelPrefac.setDataAsMapArray(data.result, true);
			
			if (id_prefacturacion != null) {
				tblPrefac.blur();
				tblPrefac.buscar("id_prefacturacion", id_prefacturacion);
				tblPrefac.focus();
			}
		});
		rpc.addListener("failed", function(e){
			var data = e.getData();
			
			alert(qx.lang.Json.stringify(data, null, 2));

		});
		rpc.callAsyncListeners(true, "leer_prefacturacion", p);
		
		return rpc;
	}
	

	
	
	
	
	
	
	// Menu

	

	
	var btnCambiarPrestador = new qx.ui.menu.Button("Cambiar prestador...");
	btnCambiarPrestador.setEnabled(false);
	btnCambiarPrestador.addListener("execute", function(e){
		var win = new sacdiag.comp.windowSeleccionarPrestador();
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();

			rowDataSolicitud.id_prestador = data;
			
			var p = rowDataSolicitud;
			
			var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Solicitudes");
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				//alert(qx.lang.Json.stringify(data, null, 2));
				
				functionActualizarPrefac(rowDataSolicitud.id_solicitud);
			});
			rpc.callAsyncListeners(true, "escribir_solicitud", p);
		});
		
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	var btnAutorizar = new qx.ui.menu.Button("Aprobar...");
	btnAutorizar.setEnabled(false);
	btnAutorizar.addListener("execute", function(e){
		(new dialog.Confirm({
		        "message"   : "Desea aprobar la solicitud seleccionada?",
		        "callback"  : function(e){
	        					if (e) {
									var focusedRow = tblPrefac.getFocusedRow();
									
									tblPrefac.blur();
									
									rowDataSolicitud.estado = "A";
									tableModelPrefac.setRowsAsMapArray([rowDataSolicitud], focusedRow, true);
									
									var p = rowDataSolicitud;
									
									var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Solicitudes");
									rpc.addListener("completed", function(e){
										var data = e.getData();
										
										//alert(qx.lang.Json.stringify(data, null, 2));
										
										tblPrefac.focus();
									});
									rpc.addListener("failed", function(e){
										var data = e.getData();
										
										alert(qx.lang.Json.stringify(data, null, 2));
									});
									rpc.callAsyncListeners(true, "escribir_solicitud", p);
	        					}
		        			},
		        "context"   : this,
		        "image"     : "icon/48/status/dialog-warning.png"
		})).show();
	});
	
	var btnBloquear = new qx.ui.menu.Button("Bloquear...");
	btnBloquear.setEnabled(false);
	btnBloquear.addListener("execute", function(e){
		var focusedRow = tblPrefac.getFocusedRow();
		
		tblPrefac.blur();
		
		rowDataSolicitud.estado = (rowDataSolicitud.estado=="B") ? "A" : "B";
		tableModelPrefac.setRowsAsMapArray([rowDataSolicitud], focusedRow, true);
		
		var p = rowDataSolicitud;
		
		var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Solicitudes");
		rpc.addListener("completed", function(e){
			var data = e.getData();
			
			//alert(qx.lang.Json.stringify(data, null, 2));

			tblPrefac.focus();
		});
		rpc.addListener("failed", function(e){
			var data = e.getData();
			
			alert(qx.lang.Json.stringify(data, null, 2));
		});
		rpc.callAsyncListeners(true, "escribir_solicitud", p);
	});
	
	
	
	var menuPrefac = new componente.comp.ui.ramon.menu.Menu();
	
	menuPrefac.add(btnCambiarPrestador);
	menuPrefac.add(btnAutorizar);
	menuPrefac.add(btnBloquear);
	//menuPrefac.addSeparator();
	//menuPrefac.add(btnVerPrestacion);
	menuPrefac.memorizar();
	
	
	
	
	
	
	//Tabla
	
	
	var tableModelPrefac = new qx.ui.table.model.Simple();
	tableModelPrefac.setColumns(["Fecha", "Prestador", "Cantidad", "Total", "Estado"], ["fecha_creacion", "prestador", "cantidad", "valor", "estado"]);
	tableModelPrefac.addListener("dataChanged", function(e){
		var rowCount = tableModelPrefac.getRowCount();
		
		tblPrefac.setAdditionalStatusBarText(rowCount + ((rowCount == 1) ? " item" : " items"));
	});

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblPrefac = new componente.comp.ui.ramon.table.Table(tableModelPrefac, custom);
	tblPrefac.setShowCellFocusIndicator(false);
	tblPrefac.toggleColumnVisibilityButtonVisible();
	//tbl.setRowHeight(45);
	tblPrefac.setContextMenu(menuPrefac);

	
	var tableColumnModelPrefac = tblPrefac.getTableColumnModel();
	
	var resizeBehaviorPrefac = tableColumnModelPrefac.getBehavior();
	/*
	resizeBehavior.set(0, {width:"3%", minWidth:100});
	resizeBehavior.set(1, {width:"5%", minWidth:100});
	resizeBehavior.set(2, {width:"5%", minWidth:100});
	resizeBehavior.set(3, {width:"21%", minWidth:100});
	resizeBehavior.set(4, {width:"5%", minWidth:100});
	resizeBehavior.set(5, {width:"21%", minWidth:100});
	resizeBehavior.set(6, {width:"5%", minWidth:100});
	resizeBehavior.set(7, {width:"5%", minWidth:100});
	resizeBehavior.set(8, {width:"21%", minWidth:100});
	resizeBehavior.set(9, {width:"4%", minWidth:100});
	resizeBehavior.set(10, {width:"5%", minWidth:100});

	
	
	var cellrendererBoolean = new qx.ui.table.cellrenderer.Boolean();
	cellrendererBoolean.setDefaultCellStyle("display: table-cell; vertical-align: middle; position: relative;");
	tableColumnModel.setDataCellRenderer(0, cellrendererBoolean);
	
	var cellrendererDate = new defineMultiLineCellDate();
	cellrendererDate.setDateFormat(new qx.util.format.DateFormat("dd/MM/y"));
	tableColumnModel.setDataCellRenderer(1, cellrendererDate);
	
	var cellrenderer = new defineMultiLineCellHtml();
	tableColumnModel.setDataCellRenderer(2, cellrenderer);
	tableColumnModel.setDataCellRenderer(3, cellrenderer);
	tableColumnModel.setDataCellRenderer(4, cellrenderer);
	tableColumnModel.setDataCellRenderer(5, cellrenderer);
	tableColumnModel.setDataCellRenderer(6, cellrenderer);
	tableColumnModel.setDataCellRenderer(7, cellrenderer);
	tableColumnModel.setDataCellRenderer(8, cellrenderer);
	tableColumnModel.setDataCellRenderer(9, cellrenderer);
	tableColumnModel.setDataCellRenderer(10, cellrenderer);
	*/
	
	var cellrendererReplace = new qx.ui.table.cellrenderer.Replace();
	cellrendererReplace.setReplaceMap({
		"E" : "Emitida",
		"O" : "Observada",
		"A" : "Aprobada"
	});
	tableColumnModelPrefac.setDataCellRenderer(4, cellrendererReplace);
	
	
	var selectionModelPrefac = tblPrefac.getSelectionModel();
	selectionModelPrefac.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelPrefac.addListener("changeSelection", function(e){
		if (selectionModelPrefac.isSelectionEmpty()) {
			commandVerPrestacion.setEnabled(false);
			menuPrefac.memorizar([commandVerPrestacion]);
		} else {
			rowDataPrefac = tableModelPrefac.getRowDataAsMap(tblPrefac.getFocusedRow());
			
			/*
			commandVerPrestacion.setEnabled(true);
			btnCambiarPrestador.setEnabled(rowDataSolicitud.estado == "E" || rowDataSolicitud.estado == "A");
			btnAutorizar.setEnabled(rowDataSolicitud.estado == "E");
			btnBloquear.setEnabled(rowDataSolicitud.estado == "B" || rowDataSolicitud.estado == "A");
			btnBloquear.setLabel((rowDataSolicitud.estado == "B") ? "Desbloquear" : "Bloquear")
			
			menuPrefac.memorizar([commandVerPrestacion, btnCambiarPrestador, btnAutorizar, btnBloquear]);
			*/
			
			
			tblSolicitud.resetSelection();
			tblPrestacion.resetSelection();
			
			tblSolicitud.setFocusedCell();
			tblPrestacion.setFocusedCell();
			
			tableModelSolicitud.setDataAsMapArray([], true);
			tableModelPrestacion.setDataAsMapArray([], true);
			
			var p = {};
			p.id_prefacturacion = rowDataPrefac.id_prefacturacion;
			
			var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Prefacturacion");
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				//alert(qx.lang.Json.stringify(data, null, 2));
		
				tableModelSolicitud.setDataAsMapArray(data.result, true);
			});
			rpc.addListener("failed", function(e){
				var data = e.getData();
				
				alert(qx.lang.Json.stringify(data, null, 2));
			});
			rpc.callAsyncListeners(true, "leer_solicitudes", p);
		}
	});

	this.add(tblPrefac, {left: 0, top: 0, right: "51%", bottom: 0});
	
	
	
	
	
	
	
	//Tabla
	
	
	var tableModelSolicitud = new qx.ui.table.model.Simple();
	tableModelSolicitud.setColumns(["Paciente", "DNI", "Fecha", "Efector público", "Estado"], ["persona_nombre", "persona_dni", "fecha_emite", "efector_publico", "estado"]);
	tableModelSolicitud.addListener("dataChanged", function(e){
		var rowCount = tableModelSolicitud.getRowCount();
		
		tblSolicitud.setAdditionalStatusBarText(rowCount + ((rowCount == 1) ? " item" : " items"));
	});

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblSolicitud = new componente.comp.ui.ramon.table.Table(tableModelSolicitud, custom);
	tblSolicitud.setShowCellFocusIndicator(false);
	tblSolicitud.toggleColumnVisibilityButtonVisible();
	//tbl.setRowHeight(45);
	//tblSolicitud.setContextMenu(menuSolicitud);

	
	var tableColumnModelSolicitud = tblSolicitud.getTableColumnModel();
	
	var resizeBehaviorSolicitud = tableColumnModelSolicitud.getBehavior();
	/*
	resizeBehavior.set(0, {width:"3%", minWidth:100});
	resizeBehavior.set(1, {width:"5%", minWidth:100});
	resizeBehavior.set(2, {width:"5%", minWidth:100});
	resizeBehavior.set(3, {width:"21%", minWidth:100});
	resizeBehavior.set(4, {width:"5%", minWidth:100});
	resizeBehavior.set(5, {width:"21%", minWidth:100});
	resizeBehavior.set(6, {width:"5%", minWidth:100});
	resizeBehavior.set(7, {width:"5%", minWidth:100});
	resizeBehavior.set(8, {width:"21%", minWidth:100});
	resizeBehavior.set(9, {width:"4%", minWidth:100});
	resizeBehavior.set(10, {width:"5%", minWidth:100});

	
	
	var cellrendererBoolean = new qx.ui.table.cellrenderer.Boolean();
	cellrendererBoolean.setDefaultCellStyle("display: table-cell; vertical-align: middle; position: relative;");
	tableColumnModel.setDataCellRenderer(0, cellrendererBoolean);
	
	var cellrendererDate = new defineMultiLineCellDate();
	cellrendererDate.setDateFormat(new qx.util.format.DateFormat("dd/MM/y"));
	tableColumnModel.setDataCellRenderer(1, cellrendererDate);
	
	var cellrenderer = new defineMultiLineCellHtml();
	tableColumnModel.setDataCellRenderer(2, cellrenderer);
	tableColumnModel.setDataCellRenderer(3, cellrenderer);
	tableColumnModel.setDataCellRenderer(4, cellrenderer);
	tableColumnModel.setDataCellRenderer(5, cellrenderer);
	tableColumnModel.setDataCellRenderer(6, cellrenderer);
	tableColumnModel.setDataCellRenderer(7, cellrenderer);
	tableColumnModel.setDataCellRenderer(8, cellrenderer);
	tableColumnModel.setDataCellRenderer(9, cellrenderer);
	tableColumnModel.setDataCellRenderer(10, cellrenderer);
	*/
	
	var cellrendererReplace = new qx.ui.table.cellrenderer.Replace();
	cellrendererReplace.setReplaceMap({
		"E" : "Emitida",
		"A" : "Aprobada",
		"B" : "Bloqueada",
		"C" : "Capturada",
		"L" : "Liberada",
		"F" : "Prefacturada",
		"P" : "para Pago"
	});
	tableColumnModelSolicitud.setDataCellRenderer(4, cellrendererReplace);
	
	
	var selectionModelSolicitud = tblSolicitud.getSelectionModel();
	selectionModelSolicitud.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelSolicitud.addListener("changeSelection", function(e){
		if (selectionModelSolicitud.isSelectionEmpty()) {
			commandVerPrestacion.setEnabled(false);
			menuSolicitud.memorizar([commandVerPrestacion]);
		} else {
			rowDataSolicitud = tableModelSolicitud.getRowDataAsMap(tblSolicitud.getFocusedRow());
			
			tblPrestacion.resetSelection();
			
			tblPrestacion.setFocusedCell();
			
			tableModelPrestacion.setDataAsMapArray([], true);
			
			var p = {};
			p.id_solicitud = rowDataSolicitud.id_solicitud;
			
			var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Solicitudes");
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				//alert(qx.lang.Json.stringify(data, null, 2));
		
				tableModelPrestacion.setDataAsMapArray(data.result, true);
			});
			rpc.addListener("failed", function(e){
				var data = e.getData();
				
				alert(qx.lang.Json.stringify(data, null, 2));
			});
			rpc.callAsyncListeners(true, "leer_solicitudes_prestaciones", p);
		}
	});

	this.add(tblSolicitud, {left: "51%", top: 0, right: 0, bottom: "51%"});
	
	
	
	
	
	
	
	
	
	
	
	//Tabla
	
	
	var tableModelPrestacion = new qx.ui.table.model.Simple();
	tableModelPrestacion.setColumns(["Tipo prestación", "Código", "Descripción", "Valor"], ["prestacion_tipo", "codigo", "denominacion", "valor"]);
	tableModelPrestacion.addListener("dataChanged", function(e){
		var rowCount = tableModelPrestacion.getRowCount();
		
		tblPrestacion.setAdditionalStatusBarText(rowCount + ((rowCount == 1) ? " item" : " items"));
	});

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblPrestacion = new componente.comp.ui.ramon.table.Table(tableModelPrestacion, custom);
	tblPrestacion.setShowCellFocusIndicator(false);
	tblPrestacion.toggleColumnVisibilityButtonVisible();
	//tbl.setRowHeight(45);
	//tblPrestacion.setContextMenu(menuPrestacion);
	
	var tableColumnModelPrestacion = tblPrestacion.getTableColumnModel();
	
	var resizeBehaviorPrestacion = tableColumnModelPrestacion.getBehavior();
	/*
	resizeBehavior.set(0, {width:"3%", minWidth:100});
	resizeBehavior.set(1, {width:"5%", minWidth:100});
	resizeBehavior.set(2, {width:"5%", minWidth:100});
	resizeBehavior.set(3, {width:"21%", minWidth:100});
	resizeBehavior.set(4, {width:"5%", minWidth:100});
	resizeBehavior.set(5, {width:"21%", minWidth:100});
	resizeBehavior.set(6, {width:"5%", minWidth:100});
	resizeBehavior.set(7, {width:"5%", minWidth:100});
	resizeBehavior.set(8, {width:"21%", minWidth:100});
	resizeBehavior.set(9, {width:"4%", minWidth:100});
	resizeBehavior.set(10, {width:"5%", minWidth:100});

	
	
	var cellrendererBoolean = new qx.ui.table.cellrenderer.Boolean();
	cellrendererBoolean.setDefaultCellStyle("display: table-cell; vertical-align: middle; position: relative;");
	tableColumnModel.setDataCellRenderer(0, cellrendererBoolean);
	
	var cellrendererDate = new defineMultiLineCellDate();
	cellrendererDate.setDateFormat(new qx.util.format.DateFormat("dd/MM/y"));
	tableColumnModel.setDataCellRenderer(1, cellrendererDate);
	
	var cellrenderer = new defineMultiLineCellHtml();
	tableColumnModel.setDataCellRenderer(2, cellrenderer);
	tableColumnModel.setDataCellRenderer(3, cellrenderer);
	tableColumnModel.setDataCellRenderer(4, cellrenderer);
	tableColumnModel.setDataCellRenderer(5, cellrenderer);
	tableColumnModel.setDataCellRenderer(6, cellrenderer);
	tableColumnModel.setDataCellRenderer(7, cellrenderer);
	tableColumnModel.setDataCellRenderer(8, cellrenderer);
	tableColumnModel.setDataCellRenderer(9, cellrenderer);
	tableColumnModel.setDataCellRenderer(10, cellrenderer);
	*/
	
	
	var selectionModelPrestacion = tblPrestacion.getSelectionModel();
	selectionModelPrestacion.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelPrestacion.addListener("changeSelection", function(e){
		if (! selectionModelPrestacion.isSelectionEmpty()) {
			rowDataPrestacion = tableModelPrestacion.getRowDataAsMap(tblPrestacion.getFocusedRow());
			
			commandEditarPrestacion.setEnabled(true);
		} else {
			commandEditarPrestacion.setEnabled(false);
		}
		
		menuPrestacion.memorizar([commandEditarPrestacion]);
	});

	this.add(tblPrestacion, {left: "51%", top: "51%", right: 0, bottom: 0});

	
	
	
	
	
	functionActualizarPrefac();
	
		
	},
	members : 
	{

	}
});