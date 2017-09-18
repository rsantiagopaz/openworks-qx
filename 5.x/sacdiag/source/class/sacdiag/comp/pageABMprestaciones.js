qx.Class.define("sacdiag.comp.pageABMprestaciones",
{
	extend : qx.ui.tabview.Page,
	construct : function ()
	{
	this.base(arguments);

	this.setLabel('ABM prestaciones');
	this.toggleShowCloseButton();
	this.setLayout(new qx.ui.layout.Canvas());
	
	this.addListenerOnce("appear", function(e){
		//cboTitulo.focus();
	});
	
	
	var application = qx.core.Init.getApplication();
	
	var rowDataPrestaciones_tipo;
	var rowDataPrestacion;
	
	
	
	var functionActualizarPrestacionTipo = function(id_prestacion_tipo) {
		tblTipo_prestacion.blur();
		tblTipo_prestacion.setFocusedCell();
		tblPrestacion.setFocusedCell();
		
		commandAgregarPrestacion.setEnabled(false);
		menuPrestacion.memorizar([commandAgregarPrestacion]);
		tableModelPrestacion.setDataAsMapArray([], true);

		
		var p = {};
		
		var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
		rpc.addListener("completed", function(e){
			var data = e.getData();
			
			//alert(qx.lang.Json.stringify(data, null, 2));
			
			tableModelTipo_prestacion.setDataAsMapArray(data.result, true);
			
			if (id_prestacion_tipo != null) {
				tblTipo_prestacion.blur();
				tblTipo_prestacion.buscar("id_prestacion_tipo", id_prestacion_tipo);
				tblTipo_prestacion.focus();
			}
		});
		rpc.callAsyncListeners(true, "leer_prestacion_tipo", p);
		
		return rpc;
	}
	
	
	var functionActualizarPrestacion = function(id_prestacion) {
		tblPrestacion.blur();
		tblPrestacion.setFocusedCell();
		
		commandAgregarPrestacion.setEnabled(true);
		menuPrestacion.memorizar([commandAgregarPrestacion]);
		
		var p = {};
		p.phpParametros = {id_prestacion_tipo: rowDataPrestaciones_tipo.id_prestacion_tipo};
		
		var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
		rpc.addListener("completed", function(e){
			var data = e.getData();
			
			//alert(qx.lang.Json.stringify(data, null, 2));
			
			tableModelPrestacion.setDataAsMapArray(data.result, true);
			
			if (id_prestacion != null) {
				tblPrestacion.blur();
				tblPrestacion.buscar("id_prestacion", id_prestacion);
				tblPrestacion.focus();
			}
		});
		rpc.callAsyncListeners(true, "autocompletarPrestacion", p);

		return rpc;
	}
	
	

	
	
	
	
	
	// Menu

	
	var commandAgregarTipo_prestacion = new qx.ui.command.Command("Insert");
	commandAgregarTipo_prestacion.addListener("execute", function(e){
		var win = new sacdiag.comp.windowPrestacion_tipo();
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();
			
			functionActualizarPrestacionTipo(data);
		});
		
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	var btnAgregarTipo_prestacion = new qx.ui.menu.Button("Agregar...", null, commandAgregarTipo_prestacion);
	
	
	var commandEditarTipo_prestacion = new qx.ui.command.Command("F2");
	commandEditarTipo_prestacion.setEnabled(false);
	commandEditarTipo_prestacion.addListener("execute", function(e){
		var win = new sacdiag.comp.windowPrestacion_tipo(rowDataPrestaciones_tipo);
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();
			
			functionActualizarPrestacionTipo(data);
		});
		
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	var btnEditarTipo_prestacion = new qx.ui.menu.Button("Editar...", null, commandEditarTipo_prestacion);
	
	
	var menuTipo_prestacion = new componente.comp.ui.ramon.menu.Menu();
	
	menuTipo_prestacion.add(btnAgregarTipo_prestacion);
	menuTipo_prestacion.add(btnEditarTipo_prestacion);
	menuTipo_prestacion.memorizar();
	
	
	
	
	
	
	//Tabla
	
	
	var tableModelTipo_prestacion = new qx.ui.table.model.Simple();
	tableModelTipo_prestacion.setColumns(["Descripción"], ["denominacion"]);
	tableModelTipo_prestacion.addListener("dataChanged", function(e){
		var rowCount = tableModelTipo_prestacion.getRowCount();
		
		tblTipo_prestacion.setAdditionalStatusBarText(rowCount + ((rowCount == 1) ? " item" : " items"));
	});

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblTipo_prestacion = new componente.comp.ui.ramon.table.Table(tableModelTipo_prestacion, custom);
	tblTipo_prestacion.setShowCellFocusIndicator(false);
	tblTipo_prestacion.toggleColumnVisibilityButtonVisible();
	//tbl.setRowHeight(45);
	tblTipo_prestacion.setContextMenu(menuTipo_prestacion);

	
	var tableColumnModelTipo_prestacion = tblTipo_prestacion.getTableColumnModel();
	
	var resizeBehaviorTipo_prestacion = tableColumnModelTipo_prestacion.getBehavior();
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
	
	
	var selectionModelTipo_prestacion = tblTipo_prestacion.getSelectionModel();
	selectionModelTipo_prestacion.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelTipo_prestacion.addListener("changeSelection", function(e){
		if (! selectionModelTipo_prestacion.isSelectionEmpty()) {
			rowDataPrestaciones_tipo = tableModelTipo_prestacion.getRowDataAsMap(tblTipo_prestacion.getFocusedRow());
			
			commandEditarTipo_prestacion.setEnabled(true);
			
			functionActualizarPrestacion();
		} else {
			commandEditarTipo_prestacion.setEnabled(false);
		}
		
		menuTipo_prestacion.memorizar([commandEditarTipo_prestacion]);
	});

	this.add(tblTipo_prestacion, {left: 0, top: 20, right: "53%", bottom: 0});	
	
	this.add(new qx.ui.basic.Label("Tipo de prestación"), {left: 0, top: 0});
	
	
	

	
	
	
	
	
	
	
	
	
	
	// Menu

	
	var commandAgregarPrestacion = new qx.ui.command.Command("Insert");
	commandAgregarPrestacion.setEnabled(false);
	commandAgregarPrestacion.addListener("execute", function(e){
		var win = new sacdiag.comp.windowPrestacion(null, rowDataPrestaciones_tipo.id_prestacion_tipo);
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();
			
			functionActualizarPrestacion(data);
		});
		
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	var btnAgregarPrestacion = new qx.ui.menu.Button("Agregar...", null, commandAgregarPrestacion);
	
	
	var commandEditarPrestacion = new qx.ui.command.Command("F2");
	commandEditarPrestacion.setEnabled(false);
	commandEditarPrestacion.addListener("execute", function(e){
		var win = new sacdiag.comp.windowPrestacion(rowDataPrestacion, rowDataPrestaciones_tipo.id_prestacion_tipo);
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();
			
			functionActualizarPrestacion(data);
		});
		
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	var btnEditarPrestacion = new qx.ui.menu.Button("Editar...", null, commandEditarPrestacion);
	
	
	var menuPrestacion = new componente.comp.ui.ramon.menu.Menu();
	
	menuPrestacion.add(btnAgregarPrestacion);
	menuPrestacion.add(btnEditarPrestacion);
	menuPrestacion.memorizar();
	
	
	
	
	//Tabla
	
	
	var tableModelPrestacion = new qx.ui.table.model.Simple();
	tableModelPrestacion.setColumns(["Código", "Descripción", "Valor"], ["codigo", "denominacion", "valor"]);
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
	tblPrestacion.setContextMenu(menuPrestacion);
	
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

	this.add(tblPrestacion, {left: "53%", top: 20, right: 0, bottom: 0});
	
	this.add(new qx.ui.basic.Label("Prestación"), {left: "53%", top: 0});
	
	
	

	
	
	
	functionActualizarPrestacionTipo();
	
	
		
	},
	members : 
	{

	}
});