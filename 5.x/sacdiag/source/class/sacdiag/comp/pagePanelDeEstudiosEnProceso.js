qx.Class.define("sacdiag.comp.pagePanelDeEstudiosEnProceso",
{
	extend : qx.ui.tabview.Page,
	construct : function ()
	{
	this.base(arguments);

	this.setLabel('Panel de Estudios en Proceso');
	this.toggleShowCloseButton();
	this.setLayout(new qx.ui.layout.Canvas());
	
	this.addListenerOnce("appear", function(e){
		btnFiltrar.execute();
		dtfDesde.focus();
	});
	
	
	var application = qx.core.Init.getApplication();
	
	var rowDataSolicitud;
	var mapEstado = {
		"E" : "Emitida",
		"A" : "Aprobada",
		"B" : "Bloqueada",
		"C" : "Capturada",
		"L" : "Liberada",
		"F" : "Prefacturada",
		"P" : "para Pago"
	};
	
	
	
	
	var functionActualizarSolicitud = function(id_solicitud) {
		
		tblSolicitud.setFocusedCell();
		tableModelPrestacion.setDataAsMapArray([], true);
		
		controllerFormInfoEntsal.resetModel();
		
		var p = {};
		p.desde = dtfDesde.getValue();
		p.hasta = dtfHasta.getValue();
		if (! lstPrestador.isSelectionEmpty()) p.id_prestador = lstPrestador.getSelection()[0].getModel();
		if (! lstPaciente.isSelectionEmpty()) p.persona_id = lstPaciente.getSelection()[0].getModel();
		if (! lstPersonal.isSelectionEmpty()) p.id_usuario_medico = lstPersonal.getSelection()[0].getModel();
		p.estado = slbEstado.getSelection()[0].getModel();
		
		//alert(qx.lang.Json.stringify(p, null, 2));
		
		var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Solicitudes");
		rpc.addListener("completed", function(e){
			var data = e.getData();
			
			//alert(qx.lang.Json.stringify(data, null, 2));

			tableModelSolicitud.setDataAsMapArray(data.result, true);
			
			if (id_solicitud != null) {
				tblSolicitud.blur();
				tblSolicitud.buscar("id_solicitud", id_solicitud);
				tblSolicitud.focus();
			}
		});
		rpc.callAsyncListeners(true, "leer_solicitud", p);
		
		return rpc;
	}
	
	
	
	
	
	var gbxFiltrar = new qx.ui.groupbox.GroupBox("Filtrar solicitudes");
	gbxFiltrar.setLayout(new qx.ui.layout.Grid(6, 6));
	this.add(gbxFiltrar, {left: 0, top: 0});
	
	

	gbxFiltrar.add(new qx.ui.basic.Label("Desde:"), {row: 0, column: 0});
	
	var dtfDesde = new qx.ui.form.DateField();
	gbxFiltrar.add(dtfDesde, {row: 0, column: 1});
	
	gbxFiltrar.add(new qx.ui.basic.Label("Hasta:"), {row: 0, column: 2});
	
	var dtfHasta = new qx.ui.form.DateField();
	gbxFiltrar.add(dtfHasta, {row: 0, column: 3});
	
	
	var aux = new Date;
	dtfHasta.setValue(aux);
	aux.setMonth(aux.getMonth() - 1);
	dtfDesde.setValue(aux);
	
	
	gbxFiltrar.add(new qx.ui.basic.Label("Prestador:"), {row: 1, column: 0});
	
	var cboPrestador = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarPrestador"});
	//cboPrestador.setWidth(400);
	
	var lstPrestador = cboPrestador.getChildControl("list");
	lstPrestador.addListener("changeSelection", function(e){
		var data = e.getData();
		
	});
	gbxFiltrar.add(cboPrestador, {row: 1, column: 1, colSpan: 3});
	
	
	
	gbxFiltrar.add(new qx.ui.basic.Label("Paciente:"), {row: 2, column: 0});
	
	var cboPaciente = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarPersona"});
	//cboPrestador.setWidth(400);
	
	var lstPaciente = cboPaciente.getChildControl("list");
	lstPaciente.addListener("changeSelection", function(e){
		var data = e.getData();
		
	});
	gbxFiltrar.add(cboPaciente, {row: 2, column: 1, colSpan: 3});
	
	
	gbxFiltrar.add(new qx.ui.basic.Label("Médico:"), {row: 3, column: 0});
	
	var cboPersonal = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarPersonal"});
	//cboPrestador.setWidth(400);
	
	var lstPersonal = cboPersonal.getChildControl("list");
	lstPersonal.addListener("changeSelection", function(e){
		var data = e.getData();
		
	});
	gbxFiltrar.add(cboPersonal, {row: 3, column: 1, colSpan: 3});
	
	
	
	gbxFiltrar.add(new qx.ui.basic.Label("Estado:"), {row: 4, column: 0});
	
	var slbEstado = new qx.ui.form.SelectBox();
	slbEstado.add(new qx.ui.form.ListItem("-", null, ""));
	slbEstado.add(new qx.ui.form.ListItem("Emitida", null, "E"));
	slbEstado.add(new qx.ui.form.ListItem("Aprobada", null, "A"));
	slbEstado.add(new qx.ui.form.ListItem("Bloqueada", null, "B"));
	//slbEstado.add(new qx.ui.form.ListItem("Capturada", null, "C"));
	slbEstado.add(new qx.ui.form.ListItem("Liberada", null, "L"));
	slbEstado.add(new qx.ui.form.ListItem("Prefacturada", null, "F"));
	slbEstado.add(new qx.ui.form.ListItem("para Pago", null, "P"));
	
	gbxFiltrar.add(slbEstado, {row: 4, column: 1});
	

	
	var btnFiltrar = new qx.ui.form.Button("Filtrar");
	btnFiltrar.addListener("execute", function(e){
		functionActualizarSolicitud();
	})
	gbxFiltrar.add(btnFiltrar, {row: 5, column: 3});
	
	
	
	
	
	// Menu

	
	var commandVerPrestacion = new qx.ui.command.Command("Enter");
	commandVerPrestacion.setEnabled(false);
	commandVerPrestacion.addListener("execute", function(e){
		var win = new sacdiag.comp.windowSolicitudes_prestaciones(rowDataSolicitud);
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();

		});
		
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	
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
				
				functionActualizarSolicitud(rowDataSolicitud.id_solicitud);
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
									var focusedRow = tblSolicitud.getFocusedRow();
									
									tblSolicitud.blur();
									
									rowDataSolicitud.estado = "A";
									rowDataSolicitud.estado_descrip = mapEstado["A"];
									rowDataSolicitud.estado_condicion = 2;
									
									tableModelSolicitud.setRowsAsMapArray([rowDataSolicitud], focusedRow, true);
									
									var p = rowDataSolicitud;
									
									var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Solicitudes");
									rpc.addListener("completed", function(e){
										var data = e.getData();
										
										//alert(qx.lang.Json.stringify(data, null, 2));
										
										tblSolicitud.focus();
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
		var focusedRow = tblSolicitud.getFocusedRow();
		
		var functionBloquear = function() {
			tableModelSolicitud.setRowsAsMapArray([rowDataSolicitud], focusedRow, true);
			
			var p = rowDataSolicitud;
			
			var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Solicitudes");
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				//alert(qx.lang.Json.stringify(data, null, 2));
	
				tblSolicitud.focus();
			});
			rpc.addListener("failed", function(e){
				var data = e.getData();
				
				alert(qx.lang.Json.stringify(data, null, 2));
			});
			rpc.callAsyncListeners(true, "escribir_solicitud", p);			
		}
		
		
		
		if (rowDataSolicitud.estado == "A") {
			var win = new sacdiag.comp.windowObservar();
			win.setCaption("Bloquear solicitud");
			win.setModal(true);
			win.addListener("aceptado", function(e){
				var data = e.getData();
				
				rowDataSolicitud.estado = "B";
				rowDataSolicitud.estado_descrip = mapEstado["B"];
				rowDataSolicitud.estado_condicion = 0;
				rowDataSolicitud.observaciones_bloqueo = data;
				
				functionBloquear();
			});
			
			application.getRoot().add(win);
			win.center();
			win.open();
		} else {
			
			(new dialog.Confirm({
			        "message"   : "Desea desbloquear el item de solicitud seleccionado?",
			        "callback"  : function(e){
		        					if (e) {
										rowDataSolicitud.estado = "A";
										rowDataSolicitud.estado_descrip = mapEstado["A"];
										rowDataSolicitud.estado_condicion = 2;
										rowDataSolicitud.observaciones_bloqueo = "";
										functionBloquear();
		        					}
			        			},
			        "context"   : this,
			        "image"     : "icon/48/status/dialog-warning.png"
			})).show();
		}
	});
	
	var btnVerPrestacion = new qx.ui.menu.Button("Ver prestaciones...", null, commandVerPrestacion);
	
	
	var menuSolicitud = new componente.comp.ui.ramon.menu.Menu();
	
	menuSolicitud.add(btnCambiarPrestador);
	menuSolicitud.add(btnAutorizar);
	menuSolicitud.add(btnBloquear);
	//menuSolicitud.addSeparator();
	//menuSolicitud.add(btnVerPrestacion);
	menuSolicitud.memorizar();
	
	
	
	
	
	
	//Tabla
	
	
	var tableModelSolicitud = new qx.ui.table.model.Simple();
	tableModelSolicitud.setColumns(["Paciente", "DNI", "Fecha", "Efector público", "Prestador", "Estado", "estado_condicion"], ["persona_nombre", "persona_dni", "fecha_emite", "efector_publico", "prestador", "estado_descrip", "estado_condicion"]);
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
	tblSolicitud.setContextMenu(menuSolicitud);

	
	var tableColumnModelSolicitud = tblSolicitud.getTableColumnModel();
	tableColumnModelSolicitud.setColumnVisible(6, false);
	
	var resizeBehaviorSolicitud = tableColumnModelSolicitud.getBehavior();
	
	resizeBehaviorSolicitud.set(0, {width:"24%", minWidth:100});
	resizeBehaviorSolicitud.set(1, {width:"10%", minWidth:100});
	resizeBehaviorSolicitud.set(2, {width:"10%", minWidth:100});
	resizeBehaviorSolicitud.set(3, {width:"24%", minWidth:100});
	resizeBehaviorSolicitud.set(4, {width:"24%", minWidth:100});
	resizeBehaviorSolicitud.set(5, {width:"8%", minWidth:100});

	

	var cellrendererDate = new qx.ui.table.cellrenderer.Date();
	cellrendererDate.setDateFormat(new qx.util.format.DateFormat("y-MM-dd"));
	tableColumnModelSolicitud.setDataCellRenderer(2, cellrendererDate);
	

	var cellrendererString = new qx.ui.table.cellrenderer.String();
	cellrendererString.addNumericCondition("==", 1, null, "#FF6600", null, null, "estado_condicion");
	cellrendererString.addNumericCondition("==", 2, null, "#119900", null, null, "estado_condicion");
	tableColumnModelSolicitud.setDataCellRenderer(5, cellrendererString);
	
	
	var selectionModelSolicitud = tblSolicitud.getSelectionModel();
	selectionModelSolicitud.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelSolicitud.addListener("changeSelection", function(e){
		if (selectionModelSolicitud.isSelectionEmpty()) {
			commandVerPrestacion.setEnabled(false);
			menuSolicitud.memorizar([commandVerPrestacion]);
		} else {
			rowDataSolicitud = tableModelSolicitud.getRowDataAsMap(tblSolicitud.getFocusedRow());
			
			controllerFormInfoEntsal.setModel(qx.data.marshal.Json.createModel(rowDataSolicitud));
			
			commandVerPrestacion.setEnabled(true);
			btnCambiarPrestador.setEnabled(rowDataSolicitud.estado == "E" || rowDataSolicitud.estado == "A");
			btnAutorizar.setEnabled(rowDataSolicitud.estado == "E");
			btnBloquear.setEnabled(rowDataSolicitud.estado == "B" || rowDataSolicitud.estado == "A");
			btnBloquear.setLabel((rowDataSolicitud.estado == "B") ? "Desbloquear" : "Bloquear")
			
			menuSolicitud.memorizar([commandVerPrestacion, btnCambiarPrestador, btnAutorizar, btnBloquear]);
			
			
			var p = {};
			p.id_solicitud = rowDataSolicitud.id_solicitud;
			
			var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Solicitudes");
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				//alert(qx.lang.Json.stringify(data, null, 2));
		
				tableModelPrestacion.setDataAsMapArray(data.result, true);
			});
			rpc.callAsyncListeners(true, "leer_solicitudes_prestaciones", p);
		}
	});

	this.add(tblSolicitud, {left: 0, top: 215, right: "51%", bottom: 0});
	
	
	
	
	var gbxOtros = new qx.ui.groupbox.GroupBox("Otros datos");
	gbxOtros.setLayout(new qx.ui.layout.Basic());
	this.add(gbxOtros, {left: "51%", top: 215, right: 0, bottom: "41%"});
	
	
	var formInfoEntsal = new qx.ui.form.Form();
	
	var aux = new qx.ui.form.TextArea("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Observaciones", null, "observaciones_bloqueo");
	
	var aux = new qx.ui.form.TextArea("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Info.clínica", null, "informacion_clinica");
	
	var aux = new qx.ui.form.TextField("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Médico", null, "medico_descrip");
	
	var aux = new qx.ui.form.TextArea("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Ori.diagnostica", null, "orientacion_diagnostica");
	
	aux = new qx.ui.form.TextField();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	//formInfoEntsal.add(aux, "Usuario ent.", null, "id_usuario_ent");
	
	var controllerFormInfoEntsal = new qx.data.controller.Form(null, formInfoEntsal);
	//modelForm = controllerFormInfoVehiculo.createModel(true);
	
	var formViewEntsal = new qx.ui.form.renderer.Double(formInfoEntsal);
	
	
	gbxOtros.add(formViewEntsal, {left: 0, top: 0});
	
	
	
	
	
	
	
	
	
	//Tabla
	
	
	var tableModelPrestacion = new qx.ui.table.model.Simple();
	tableModelPrestacion.setColumns(["Tipo prestación", "Código", "Descripción"], ["prestacion_tipo", "codigo", "denominacion"]);
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

	resizeBehaviorPrestacion.set(0, {width:"40%", minWidth:100});
	resizeBehaviorPrestacion.set(1, {width:"20%", minWidth:100});
	resizeBehaviorPrestacion.set(2, {width:"40%", minWidth:100});

	
	
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

	this.add(tblPrestacion, {left: "51%", top: "60%", right: 0, bottom: 0});

	
	
	
	
	
		
	},
	members : 
	{

	}
});