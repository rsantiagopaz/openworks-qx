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
	
	
	
	
	var functionActualizarSolicitud = function(id_solicitud) {
		
		tblSolicitud.setFocusedCell();
		
		var p = {};
		p.desde = dtfDesde.getValue();
		p.hasta = dtfHasta.getValue();
		if (! lstPrestador.isSelectionEmpty()) p.id_prestador = lstPrestador.getSelection()[0].getModel();
		if (! lstPaciente.isSelectionEmpty()) p.persona_id = lstPaciente.getSelection()[0].getModel();
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
	
	
	
	gbxFiltrar.add(new qx.ui.basic.Label("Estado:"), {row: 3, column: 0});
	
	var slbEstado = new qx.ui.form.SelectBox();
	slbEstado.add(new qx.ui.form.ListItem("-", null, ""));
	slbEstado.add(new qx.ui.form.ListItem("Emitida", null, "E"));
	slbEstado.add(new qx.ui.form.ListItem("Aprobada", null, "A"));
	slbEstado.add(new qx.ui.form.ListItem("Bloqueada", null, "B"));
	slbEstado.add(new qx.ui.form.ListItem("Capturada", null, "C"));
	slbEstado.add(new qx.ui.form.ListItem("Liberada", null, "L"));
	slbEstado.add(new qx.ui.form.ListItem("Prefacturada", null, "F"));
	slbEstado.add(new qx.ui.form.ListItem("para Pago", null, "P"));
	
	gbxFiltrar.add(slbEstado, {row: 3, column: 1});
	

	
	var btnFiltrar = new qx.ui.form.Button("Filtrar");
	btnFiltrar.addListener("execute", function(e){
		functionActualizarSolicitud();
	})
	gbxFiltrar.add(btnFiltrar, {row: 4, column: 3});
	
	
	
	
	
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

	});
	
	var btnAutorizar = new qx.ui.menu.Button("Autorizar...");
	btnAutorizar.setEnabled(false);
	btnAutorizar.addListener("execute", function(e){

	});
	
	var btnBloquear = new qx.ui.menu.Button("Bloquear...");
	btnBloquear.setEnabled(false);
	btnBloquear.addListener("execute", function(e){
		rowDataSolicitud.estado = (rowDataSolicitud.estado=="B") ? "A" : "B";
		
		var p = rowDataSolicitud;
		
		var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Solicitudes");
		rpc.addListener("completed", function(e){
			var data = e.getData();
			
			//alert(qx.lang.Json.stringify(data, null, 2));

			tableModelSolicitud.setDataAsMapArray(data.result, true);
		});
		rpc.callAsyncListeners(true, "escribir_solicitud", p);
	});
	
	var btnVerPrestacion = new qx.ui.menu.Button("Ver prestaciones...", null, commandVerPrestacion);
	
	
	var menuSolicitud = new componente.comp.ui.ramon.menu.Menu();
	
	menuSolicitud.add(btnCambiarPrestador);
	menuSolicitud.add(btnAutorizar);
	menuSolicitud.add(btnBloquear);
	menuSolicitud.addSeparator();
	menuSolicitud.add(btnVerPrestacion);
	menuSolicitud.memorizar();
	
	
	
	
	
	
	//Tabla
	
	
	var tableModelSolicitud = new qx.ui.table.model.Simple();
	tableModelSolicitud.setColumns(["Paciente", "DNI", "Fecha", "Prestador", "Estado", "Efector público"], ["persona_nombre", "persona_dni", "fecha_emite", "prestador", "estado", "efector_publico"]);
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
			
			commandVerPrestacion.setEnabled(true);
			btnCambiarPrestador.setEnabled(rowDataSolicitud.estado == "E" || rowDataSolicitud.estado == "A");
			btnAutorizar.setEnabled(rowDataSolicitud.estado == "E");
			btnBloquear.setEnabled(rowDataSolicitud.estado == "B" || rowDataSolicitud.estado == "A");
			btnBloquear.setLabel((rowDataSolicitud.estado == "B") ? "Desbloquear" : "Bloquear")
			
			menuSolicitud.memorizar([commandVerPrestacion, btnCambiarPrestador, btnAutorizar, btnBloquear]);
		}
	});

	this.add(tblSolicitud, {left: 0, top: 200, right: "53%", bottom: 0});	
	
	
	
	
	
	
	
	
	
	
		
	},
	members : 
	{

	}
});